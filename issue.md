# Implementasi Fitur Logout User

## Deskripsi Tugas
Buatlah API endpoint untuk melakukan proses logout pengguna. Jika berhasil, data sesi (berdasarkan token yang diberikan) harus dihapus dari tabel `sessions` di database.

## Spesifikasi API

**Endpoint**: `DELETE /api/users/logout`

**Headers**: 
- `Authorization` : `Bearer <token>` (token diambil dari sisi client, yang sebelumnya di-generate pada saat login dan tersimpan di database)

**Response Body (Success)**: 
```json
{
    "data" : "Logout Success"
}
```

**Response Body (Error - Unauthorized)**: 
```json
{
    "data" : "Unauthorized"
}
```

## Struktur Direktori & Aturan Penamaan
- **Folder `src/routes`**: Berisi file untuk routing Elysia.js.
  - Penamaan file: Menggunakan format `[nama_modul]-route.ts` (contoh: `users-route.ts`).
- **Folder `src/services`**: Berisi logic bisnis dari aplikasi.
  - Penamaan file: Menggunakan format `[nama_modul]-service.ts` (contoh: `users-service.ts`).

## Tahapan Implementasi

Berikut adalah langkah-langkah yang harus dilakukan untuk mengimplementasikan fitur ini:

### 1. Buat Service untuk Logout User (`src/services/users-service.ts`)
- Buka file `src/services/users-service.ts`.
- Buat sebuah function atau method baru, misalnya `logoutUser`.
- Function ini menerima parameter `token` (berupa string).
- **Logic Bisnis:**
  1. Lakukan eksekusi query hapus (delete) pada tabel `sessions` di database di mana nilai `token` sama dengan parameter yang diinput.
  2. Pastikan query berhasil menghapus data. Jika ternyata token tidak ditemukan di tabel `sessions` (jumlah baris yang terhapus = 0), maka lemparkan error (throw error) yang menandakan "Unauthorized".
  3. Jika berhasil terhapus, function tidak perlu mengembalikan data (return void/sukses).

### 2. Buat Routing untuk Endpoint (`src/routes/users-route.ts`)
- Buka file `src/routes/users-route.ts`.
- Import service `logoutUser` yang telah dibuat.
- Daftarkan endpoint `DELETE /api/users/logout` pada router/instance Elysia.js.
- **Logic di dalam handler:**
  1. Ambil nilai dari header `Authorization` pada request.
  2. Pastikan format header valid, yaitu `Bearer <token>`, lalu ekstrak `<token>`-nya. Jika header kosong atau format salah, langsung lemparkan pesan error "Unauthorized".
  3. Panggil service `logoutUser` menggunakan token yang telah diekstrak.
  4. Jika eksekusi service **berhasil**, kembalikan response JSON sesuai dengan format *Response Body (Success)*.
  5. Jika pemanggilan service **gagal** (karena token tidak ditemukan di database atau tidak valid), tangkap error tersebut (menggunakan try-catch) dan kembalikan response JSON sesuai format *Response Body (Error)* dengan HTTP status code `401 Unauthorized`.

### 3. Integrasi Route
- Karena file `users-route.ts` pada umumnya sudah di-register ke router utama aplikasi (seperti di `src/index.ts`), penambahan route baru di dalam file tersebut akan otomatis terbaca. Pastikan saja strukturnya tidak merusak routing yang sudah ada.

### 4. Testing
- Uji coba endpoint menggunakan tools seperti Postman, cURL, atau SwaggerUI.
- Skenario pengujian:
  - **Skenario Sukses**: Kirim request DELETE dengan menyertakan token yang valid di header. Pastikan response sukses dan periksa di database apakah data di tabel `sessions` dengan token tersebut benar-benar telah terhapus.
  - **Skenario Gagal**: Kirim request DELETE tanpa menyertakan token, atau gunakan token sembarang/yang sudah dihapus. Pastikan mendapat response error `401 Unauthorized`.
