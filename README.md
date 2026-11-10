# SayutiHub — Pusat Aplikasi & Marketplace

SayutiHub adalah platform web sederhana untuk menemukan, mengunduh, dan mengelola aplikasi digital (APK/software) dengan tampilan modern, cepat, dan responsif (desktop & mobile).

## Fitur
- Katalog aplikasi dengan pencarian & filter
- Favorit (tersimpan di localStorage)
- Detail aplikasi: deskripsi, versi, format, changelog, rating & ulasan
- Download APK langsung
- Panel admin (login PIN) untuk tambah/edit/hapus aplikasi
- Upload APK & logo via Cloudflare Worker + GitHub API
- Sinkronisasi katalog ke GitHub (js/main.js)
- Analytics sederhana (total app, download, ulasan)

## Struktur
- `index.html` — halaman utama
- `css/style.css` — styling
- `js/main.js` — logika & data katalog
- `cloudflare/worker.js` — proxy upload ke GitHub
- `assets/` — aset statis

## Domain
- sayuti.my.id (CNAME)

## Lisensi
MIT (atau sesuai kebutuhan)

---
Dibuat oleh Sayuti.
