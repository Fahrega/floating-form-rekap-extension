# Floating Form Rekap — Chrome Extension

Extension Chrome untuk merekap data pesanan (resi, invoice, nama, dll) langsung dari browser dan menyalinnya ke Google Spreadsheet dengan satu klik.

---

## Instalasi

> Karena extension ini belum dipublikasi di Chrome Web Store, install secara manual via **Developer Mode**.

### Langkah-langkah

1. **Download / Clone repo ini**
   ```
   git clone https://github.com/Fahrega/floating-form-rekap-extension.git
   ```
   Atau klik **Code → Download ZIP** lalu ekstrak.

2. **Buka Chrome** dan masuk ke halaman extension:
   ```
   chrome://extensions/
   ```

3. **Aktifkan Developer Mode** — toggle di pojok kanan atas.

4. Klik tombol **Load unpacked**.

5. Pilih folder hasil clone/ekstrak tadi (`floating-form-rekap-extension`).

6. Extension siap — ikon akan muncul di toolbar Chrome.

---

## Cara Pakai

### Membuka Widget

Klik ikon extension di toolbar Chrome saat berada di halaman web manapun (tidak bisa di halaman `chrome://`).

Widget mengambang akan muncul di pojok kanan atas halaman.

### Tab Input ✍️

Isi kolom-kolom berikut lalu klik **Simpan ke Daftar**:

| No | Field | Keterangan |
|----|-------|------------|
| 1 | No. Resi | Nomor resi pengiriman |
| 2 | Invoice | Nomor invoice pesanan |
| 3 | Nama Customer | Nama penerima |
| 4 | No. Telp | Nomor telepon customer |
| 5 | Produk | Nama/deskripsi produk |

> Minimal satu dari field Resi, Invoice, atau Nama harus diisi.

### Tab Daftar 📋

- Menampilkan semua data yang sudah disimpan.
- Badge merah menunjukkan jumlah data di daftar.
- Klik **Salin Semua ke Spreadsheet** — semua data disalin ke clipboard dalam format tab-separated (siap paste langsung ke Google Sheets).
- Klik **Hapus Semua** untuk mengosongkan daftar.

### Paste ke Google Spreadsheet

1. Buka Google Sheets.
2. Klik sel pertama di baris yang diinginkan.
3. Tekan `Ctrl+V` — data otomatis masuk ke kolom-kolom terpisah.

### Memindahkan Widget

Klik dan drag bagian header (area tab) untuk memindahkan posisi widget di layar.

### Menutup Widget

Klik tombol **×** di pojok kanan header. Klik ikon extension lagi untuk membukanya kembali.

---

## Struktur File

```
floating-form-rekap-extension/
├── Manifest.json          # Konfigurasi extension (MV3)
├── background_script.js   # Service worker — handle klik ikon
└── Content_script.js      # UI widget yang di-inject ke halaman
```

---

## Catatan

- Data hanya tersimpan **sementara di memori** selama sesi browser. Menutup tab atau me-refresh halaman akan menghapus daftar.
- Extension tidak mengirim data ke server manapun — semua berjalan lokal di browser.
