# Task: Implement User Login API and Session Management

## Deskripsi
Tugas ini bertujuan untuk membuat fitur login pengguna dan manajemen sesi (session). Kamu perlu membuat tabel `sessions` di database untuk menyimpan token login dan membangun endpoint API menggunakan Elysia JS. Ikuti langkah-langkah di bawah ini secara berurutan.

## 1. Database Schema
Buat tabel `sessions` dengan spesifikasi berikut (gunakan Drizzle ORM atau SQL biasa sesuai konfigurasi project):

| Column Name  | Data Type    | Constraints/Defaults                  | Keterangan                                      |
| ------------ | ------------ | ------------------------------------- | ----------------------------------------------- |
| `id`         | integer      | `auto increment`, `primary key`       | -                                               |
| `token`      | varchar(255) | `not null`                            | Berisi UUID (Universally Unique Identifier)     |
| `user_id`    | integer      | `not null`, `foreign key`             | Relasi ke kolom `id` pada tabel `users`         |
| `created_at` | timestamp    | `default current_timestamp`           | -                                               |

## 2. Spesifikasi API
Buat endpoint API untuk login user:

- **Endpoint:** `POST /api/users/login`
- **Request Body (JSON):**
  ```json
  {
      "email": "rama@localhost",
      "password": "rahasia"
  }
  ```

- **Response Body - Success (200):**
  Mengembalikan token UUID yang berhasil digenerate.
  ```json
  {
      "data": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```

- **Response Body - Error (401 / 400):**
  Jika email tidak ditemukan atau password tidak cocok:
  ```json
  {
      "data": "Email atau password salah"
  }
  ```

## 3. Struktur Folder dan File
Kode diorganisasikan di dalam folder `src` dengan struktur berikut (gunakan file yang sudah ada atau tambahkan fungsionalitasnya):

- `src/`
  - `routes/` (Berisi file routing Elysia JS)
    - `users-route.ts`
  - `services/` (Berisi business logic dan koneksi ke database)
    - `users-service.ts`

## 4. Langkah-Langkah Implementasi (Step-by-Step)
Agar terstruktur, kerjakan tugas ini mengikuti urutan berikut:

### Step 1: Persiapan Database (Migration & Schema)
- Buka file schema database project ini (misalnya `src/db/schema.ts`).
- Tambahkan definisi tabel `sessions` sesuai spesifikasi pada poin 1. Pastikan kolom `user_id` diatur sebagai *foreign key* yang mereferensikan ke kolom `id` di tabel `users`.
- Jalankan perintah migrasi database agar tabel `sessions` terbuat di database (misal: `bun run db:generate` dan `bun run db:migrate`).

### Step 2: Membuat Service Layer (`src/services/users-service.ts`)
- Buka file `users-service.ts`.
- Buat sebuah fungsi baru (misal: `loginUser`) yang menerima input parameter `email` dan `password`.
- **Pengecekan User:** Di dalam fungsi ini, buat query ke database untuk mencari user berdasarkan `email` tersebut.
  - Jika data user tidak ditemukan, lemparkan error atau kembalikan response "Email atau password salah".
- **Verifikasi Password:** Jika user ditemukan, bandingkan teks `password` dari input dengan password yang ada di database (yang sudah di-hash) menggunakan library `bcrypt` atau fungsi bawaan `Bun.password.verify`.
  - Jika password tidak cocok, lemparkan error "Email atau password salah".
- **Generate Token & Simpan Session:** Jika password cocok:
  1. Buat token string menggunakan format UUID (contoh: `crypto.randomUUID()`).
  2. Insert data ke tabel `sessions` dengan memasukkan `token` dan `user_id` (diambil dari id user yang berhasil diverifikasi).
- Kembalikan nilai `token` dari service tersebut.

### Step 3: Membuat Route Layer (`src/routes/users-route.ts`)
- Buka file `users-route.ts`.
- Deklarasikan endpoint `POST /api/users/login` di dalam routing Elysia.
- Di dalam handler endpoint ini, tangkap request body untuk mengambil nilai `email` dan `password`.
- Panggil fungsi `loginUser` dari `users-service.ts` dengan meneruskan data email dan password tersebut.
- Tangani hasil dari service:
  - Jika berhasil, kembalikan response JSON berisi token: `{ "data": "token_hasil_generate_disini" }`.
  - Jika gagal (karena kredensial salah), tangkap errornya dan kembalikan response JSON `{ "data": "Email atau password salah" }` dengan status code HTTP 401 atau 400.

### Step 4: Memastikan Route Terdaftar di Aplikasi Utama
- Jika endpoint ditambahkan di file `users-route.ts` yang sudah ada, dan file tersebut sudah didaftarkan di aplikasi utama (`src/index.ts`), kamu tidak perlu merubah apa-apa di file `index.ts`. Pastikan saja endpoint-nya bisa diakses.

### Step 5: Testing / Pengujian
- Jalankan server lokal.
- Lakukan pengujian menggunakan aplikasi HTTP client (Postman, Insomnia, atau Thunder Client).
- **Skenario 1 (Gagal):** Kirim payload login dengan email yang tidak terdaftar, atau email benar namun password salah. Pastikan API mengembalikan `{ "data": "Email atau password salah" }`.
- **Skenario 2 (Sukses):** Kirim payload login dengan email dan password yang valid. Pastikan mendapatkan token UUID sebagai response (`{ "data": "..." }`).
- **Verifikasi Database:** Cek tabel `sessions` di database untuk memastikan data sesi berhasil tersimpan dan field `user_id` menunjuk pada user yang tepat.
