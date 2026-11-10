/**
 * SayutiHub Upload API — Cloudflare Worker
 * Uploads APK as raw binary from browser; GitHub PAT stays in Worker secrets.
 *
 * Required secrets: GITHUB_TOKEN, ADMIN_PIN, SESSION_SECRET
 * Required variable: ALLOWED_ORIGIN (e.g. https://sayuti.my.id)
 */
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const SESSION_TTL_SECONDS = 60 * 60 * 4;
const REPO = "sayut303-dot/sayuti.my.id";
const BRANCH = "main";

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
  });
}
function corsHeaders(origin, env) {
  const allowed = env.ALLOWED_ORIGIN || "";
  if (!allowed || origin !== allowed) return {};
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function fromB64url(s) {
  const normalized = s.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}
async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}
async function makeSession(secret) {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    scope: "admin:write"
  })));
  return payload + "." + b64url(await sign(payload, secret));
}
async function validSession(request, secret) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const expected = await sign(parts[0], secret);
  const supplied = fromB64url(parts[1]);
  if (expected.length !== supplied.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ supplied[i];
  if (diff !== 0) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(parts[0])));
    return payload.scope === "admin:write" && payload.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
function toBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}
function validPath(path) {
  return typeof path === "string" &&
    path.length > 0 && path.length <= 240 &&
    !path.startsWith("/") && !path.includes("..") &&
    /^[a-zA-Z0-9._/ -]+$/.test(path) &&
    path.toLowerCase().endsWith(".apk");
}
async function github(path, token) {
  const url = "https://api.github.com/repos/" + REPO + "/contents/" +
    path.split("/").map(encodeURIComponent).join("/") + "?ref=" + BRANCH;
  return fetch(url, {
    headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/vnd.github+json",
      "User-Agent": "SayutiHub-Cloudflare-Worker",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);
    if (request.method === "OPTIONS") {
      if (!Object.keys(cors).length) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors });
    }
    const url = new URL(request.url);
    if (!Object.keys(cors).length) return json({ ok: false, error: "Origin tidak diizinkan." }, 403);
    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, service: "SayutiHub Upload API" }, 200, cors);
    }
    if (url.pathname === "/auth/login" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: "Format login tidak valid." }, 400, cors); }
      if (!env.ADMIN_PIN || !env.SESSION_SECRET || !env.GITHUB_TOKEN) {
        return json({ ok: false, error: "Konfigurasi Worker belum lengkap." }, 503, cors);
      }
      if (String(body.pin || "") !== env.ADMIN_PIN) {
        return json({ ok: false, error: "PIN admin salah." }, 401, cors);
      }
      return json({ ok: true, token: await makeSession(env.SESSION_SECRET), expiresIn: SESSION_TTL_SECONDS }, 200, cors);
    }
    if (url.pathname === "/catalog" && request.method === "POST") {
      if (!env.GITHUB_TOKEN || !env.SESSION_SECRET) return json({ ok: false, error: "Worker belum dikonfigurasi." }, 503, cors);
      if (!(await validSession(request, env.SESSION_SECRET))) return json({ ok: false, error: "Sesi admin habis. Login kembali." }, 401, cors);
      let body;
      try { body = await request.json(); } catch { return json({ ok: false, error: "Data katalog tidak valid." }, 400, cors); }
      if (!Array.isArray(body.apps)) return json({ ok: false, error: "Daftar aplikasi tidak ditemukan." }, 400, cors);
      const getUrl = "https://api.github.com/repos/" + REPO + "/contents/js/main.js?ref=" + BRANCH;
      const get = await fetch(getUrl, { headers: {
        "Authorization": "Bearer " + env.GITHUB_TOKEN,
        "Accept": "application/vnd.github+json",
        "User-Agent": "SayutiHub-Cloudflare-Worker",
        "X-GitHub-Api-Version": "2022-11-28"
      }});
      if (!get.ok) return json({ ok: false, error: "Gagal membaca katalog GitHub (HTTP " + get.status + ")." }, get.status, cors);
      const file = await get.json();
      if (!file.sha || !file.content) return json({ ok: false, error: "Isi katalog GitHub tidak lengkap." }, 502, cors);
      const raw = atob(file.content.replace(/\s/g, ""));
      const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
      const source = new TextDecoder("utf-8").decode(bytes);
      const start = source.indexOf("let dbApps =");
      const end = source.indexOf("let favorites =");
      if (start < 0 || end < 0 || end <= start) return json({ ok: false, error: "Struktur katalog js/main.js tidak dikenali." }, 422, cors);
      const updated = source.slice(0, start) + "let dbApps = " + JSON.stringify(body.apps, null, 4) + ";\n\n" + source.slice(end);
      const encoded = toBase64(new TextEncoder().encode(updated));
      const putUrl = "https://api.github.com/repos/" + REPO + "/contents/js/main.js";
      const put = await fetch(putUrl, { method: "PUT", headers: {
        "Authorization": "Bearer " + env.GITHUB_TOKEN,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
        "User-Agent": "SayutiHub-Cloudflare-Worker",
        "X-GitHub-Api-Version": "2022-11-28"
      }, body: JSON.stringify({
        message: "Perbarui katalog aplikasi SayutiHub melalui Admin",
        content: encoded,
        sha: file.sha,
        branch: BRANCH
      })});
      const result = await put.json().catch(() => ({}));
      if (!put.ok) {
        const detail = result.message || result.errors?.map(e => e.message || e.code).join("; ") || ("HTTP " + put.status);
        return json({ ok: false, error: "GitHub menolak pembaruan katalog (HTTP " + put.status + "): " + detail }, put.status, cors);
      }
      if (!result.commit || !result.content) return json({ ok: false, error: "GitHub belum mengonfirmasi commit katalog." }, 502, cors);
      return json({ ok: true, commit: result.commit.sha, message: "Katalog berhasil disinkronkan." }, 200, cors);
    }
    if (url.pathname === "/upload" && request.method === "POST") {
      if (!env.GITHUB_TOKEN || !env.SESSION_SECRET) return json({ ok: false, error: "Worker belum dikonfigurasi." }, 503, cors);
      if (!(await validSession(request, env.SESSION_SECRET))) return json({ ok: false, error: "Sesi admin habis. Login kembali." }, 401, cors);
      const path = url.searchParams.get("path") || "";
      if (!validPath(path)) return json({ ok: false, error: "Lokasi file APK tidak valid." }, 400, cors);
      const declared = Number(request.headers.get("Content-Length") || 0);
      if (declared > MAX_UPLOAD_BYTES) return json({ ok: false, error: "Ukuran APK maksimal 25 MB." }, 413, cors);
      const bytes = new Uint8Array(await request.arrayBuffer());
      if (!bytes.length) return json({ ok: false, error: "File APK kosong." }, 400, cors);
      if (bytes.length > MAX_UPLOAD_BYTES) return json({ ok: false, error: "Ukuran APK maksimal 25 MB." }, 413, cors);
      const check = await github(path, env.GITHUB_TOKEN);
      let sha = null;
      if (check.ok) {
        const existing = await check.json();
        sha = existing.sha || null;
        if (!sha) return json({ ok: false, error: "SHA file lama tidak ditemukan." }, 502, cors);
      } else if (check.status !== 404) {
        const detail = await check.text();
        return json({ ok: false, error: "Gagal memeriksa file di GitHub: " + detail.slice(0, 400) }, check.status, cors);
      }
      const apiUrl = "https://api.github.com/repos/" + REPO + "/contents/" +
        path.split("/").map(encodeURIComponent).join("/");
      const payload = {
        message: (sha ? "Perbarui APK: " : "Upload APK: ") + path,
        content: toBase64(bytes),
        branch: BRANCH
      };
      if (sha) payload.sha = sha;
      const put = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + env.GITHUB_TOKEN,
          "Accept": "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "SayutiHub-Cloudflare-Worker",
          "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify(payload)
      });
      const result = await put.json().catch(() => ({}));
      if (!put.ok) return json({
        ok: false,
        error: result.message || ("GitHub menolak upload (HTTP " + put.status + ")."),
        status: put.status
      }, put.status, cors);
      if (!result.content || result.content.path !== path || !result.commit) {
        return json({ ok: false, error: "GitHub belum mengonfirmasi file dan commit." }, 502, cors);
      }
      return json({
        ok: true,
        path,
        sha: result.content.sha,
        commit: result.commit.sha,
        size: bytes.length,
        message: "APK berhasil disimpan pada lokasi yang sama."
      }, 200, cors);
    }
    return json({ ok: false, error: "Endpoint tidak ditemukan." }, 404, cors);
  }
};
