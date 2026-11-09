# SayutiHub Upload API (Cloudflare Worker)

Layanan ini menerima APK sebagai **binary** dari browser. GitHub token disimpan sebagai Worker Secret, bukan di HTML/localStorage. File tetap ditulis ke path repository yang sama pada branch `main`, sehingga URL unduhan raw GitHub tidak berubah.

## 1. Buat Worker

1. Buka Cloudflare Dashboard → Workers & Pages → Create → Worker.
2. Beri nama `sayutihub-upload`.
3. Buka Edit code, ganti seluruh kode contoh dengan isi `cloudflare/worker.js`, lalu Deploy.

## 2. Isi konfigurasi Worker

Di Worker → Settings → Variables and Secrets:

**Secrets** (gunakan Add secret):
- `GITHUB_TOKEN`: buat token baru khusus repository `sayut303-dot/sayuti.my.id`, izin Contents: Read and write. Jangan gunakan token yang pernah ditempel di chat.
- `ADMIN_PIN`: PIN admin baru yang hanya Anda ketahui.
- `SESSION_SECRET`: string acak panjang minimal 32 karakter.

**Variable**:
- `ALLOWED_ORIGIN`: domain website persis, misalnya `https://sayuti.my.id`. Jangan tambahkan slash di akhir. Jika domain Anda berbeda, masukkan domain yang benar.

Setelah menyimpan secrets/variable, Deploy ulang Worker.

## 3. Tes layanan

Buka `https://NAMA-WORKER.NAMA-AKUN.workers.dev/health` dari domain website yang diizinkan. Tes browser langsung mungkin mendapat CORS jika dibuka sebagai tab baru; itu normal. URL Worker yang sebenarnya perlu disalin untuk konfigurasi frontend.

## 4. Hubungkan frontend

Frontend harus mengirim:
- Login: POST `/auth/login` dengan JSON `{"pin":"PIN_ADMIN" }`.
- Upload: POST `/upload?path=Nonton.apk`, header `Authorization: Bearer <session>`, body berupa binary file (bukan Base64).

Gunakan URL Worker Anda sebagai `UPLOAD_API_URL`. Jangan pernah memasukkan `GITHUB_TOKEN` ke JavaScript frontend.

## Batas dan perilaku

- Batas yang diterapkan pada layanan ini: 25 MiB per APK.
- Update menggunakan SHA file lama, lalu menulis file baru pada path yang sama.
- Worker hanya mengizinkan origin website yang ditentukan.
- Progress upload di browser mengukur transfer ke Worker; Worker baru mengembalikan sukses setelah GitHub memberi respons commit.
- Upload ini bukan resumable/chunked. Jika koneksi putus, unggah ulang setelah login; jangan menganggap progress 100% sebagai bukti commit.

## Keamanan penting

Token GitHub lama yang pernah dikirim melalui chat harus dicabut (revoke) di GitHub dan diganti dengan token baru. Jangan kirim token baru ke chat atau menaruhnya di file repository.
