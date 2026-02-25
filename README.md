# ViSpeak - Eye Communication Assistant

Aplikasi komunikasi berbasis web yang memungkinkan pasien berkomunikasi menggunakan gerakan kedipan mata. Dikembangkan untuk keperluan lomba software development.

---

## 📂 Struktur Folder (Penting!)

Agar tidak bingung, pahami dulu struktur foldernya. **Fokus utama kalian ada di folder `static`**.

```text
vispeak-project/
├── app_pages/
│   └── index.html       # (FIXED) Tampilan/UI Web. Jangan diubah kecuali ada perubahan desain.
├── static/              # <-- AREA KERJA UTAMA (FOCUS HERE!)
│   ├── app_logic.js     # (FIXED) Logika AI & Alpine.js. Jangan disentuh kalau tidak paham.
│   ├── config.js        # (DINAMIS) Atur Teks, Warna, dan Daftar Kata di sini.
│   └── favicon.ico      # Icon website.
├── main.py              # (FIXED) Backend Server.
├── pyproject.toml       # (FIXED) Konfigurasi project & dependencies.
└── README.md            # Dokumentasi ini.
```

---

## 🚀 Cara Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di laptop masing-masing.

### 1. Prasyarat
Pastikan komputer sudah terinstall:
*   **Python 3.9** ke atas.
*   **UV** (Jika belum install, jalankan: pip install uv).

### 2. Langkah Eksekusi
1.  Buka terminal (CMD/PowerShell) di folder project ini.
2.  Install library yang dibutuhkan (hanya perlu dilakukan sekali):
    ```bash
    uv sync
    ```
3.  Jalankan server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8080
    ```
4.  Buka browser dan akses alamat berikut:
    **`http://localhost:8080`**

5.  Untuk menghentikan server, tekan `Ctrl + C` di terminal.

---

## ⚙️ Panduan Edit Konten (Wajib Baca!)

Semua pengaturan yang bisa diubah ada di file `static/config.js`. Buka file tersebut menggunakan VS Code atau Notepad.

### 1. Mengubah Daftar Kata (Perintah)
Cari bagian `wordList`. Ini adalah kata-kata yang akan muncul di layar scanner.

```javascript
wordList: [
    { id: 'word1', label: 'Salam', message: 'Assalamualaikum' },
    { id: 'word2', label: 'Keinginan', message: 'Saya Mau Makan' },
    // Tambahkan baris baru di sini...
],
```
*   **label:** Nama singkat yang muncul di badge kecil.
*   **message:** Kalimat lengkap yang akan diucapkan (Text-to-Speech).

### 2. Mengubah Warna Tema
Cari bagian `colors`. Gunakan kode warna HEX (misal: `#FF0000` untuk merah).

```javascript
colors: {
    primary: '#111111',    // Warna teks utama/judul
    success: '#10b981',    // Warna hijau (indikator sukses)
    background: '#fafafa', // Warna latar belakang halaman
    // ... ganti sesuai kebutuhan desain
},
```

### 3. Mengubah Teks Tombol & Label
Cari bagian `texts`. Kalian bisa ganti teks seperti judul, petunjuk, dll.

```javascript
texts: {
    main: {
        instruction: "Kedip Cepat = Geser. Kedip Tahan = Pilih.",
        btnCameraOn: "Nyalakan Kamera",
        // ...
    }
}
```

---

## 🧠 Panduan Setting Sensor (Troubleshooting)

Kalau sensor mendeteksi kedipan tapi aplikasi tidak bereaksi, atau aplikasi nge-kedip sendiri tanpa command, masuk ke menu **Pengaturan** di aplikasi web.

### Batas Deteksi Kedip (Sensitivity)
Ini adalah pengaturan paling krusial. Logikanya berbeda dari yang kalian kira!

*   **Masalah:** "Aplikasi sering nge-kedip sendiri (error) padahal mata normal."
    *   **Solusi:** **TURUNKAN** nilai slidernya (geser ke kiri).
    *   *Alasan:* Mata kalian mungkin sedikit sipit, sehingga sensor mengira itu kedipan. Menurunkan nilai membuat sensor lebih "longgar".

*   **Masalah:** "Sudah kedip tapi aplikasi tidak kebaca."
    *   **Solusi:** **NAIKKAN** nilai slidernya (geser ke kanan).
    *   *Alasan:* Kedipan kalian mungkin terlalu halus. Menaikkan nilai membuat sensor lebih "peka".

---

## 📝 Catatan Teknis (Untuk Juri)

*   **Arsitektur:** Configuration-Driven UI. Frontend (Alpine.js) membaca data dari file statis (`config.js`) yang dipisahkan dari logika utama (`app.js`).
*   **AI Processing:** Seluruh proses deteksi wajah dan kedipan (MediaPipe) berjalan sepenuhnya di **Client-Side (Browser)** menggunakan WebAssembly. Tidak ada video atau data biometrik yang dikirim ke server (Privasi Terjamin).
*   **Persistence:** Pengaturan yang disimpan user otomatis tersimpan di `localStorage` browser, sehingga tidak hilang saat halaman di-refresh.