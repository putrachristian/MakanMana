# Panduan Install PWA ke Device

Panduan lengkap untuk menginstall aplikasi MakanMana sebagai PWA di berbagai device.

## Prasyarat

⚠️ **PENTING**: PWA hanya bisa diinstall jika diakses melalui:

- **HTTPS** (untuk production)
- **localhost** (untuk development/testing)
- **127.0.0.1** (untuk testing lokal)

## Langkah 1: Build Aplikasi

1. Pastikan semua dependencies terinstall:

```bash
npm install
```

2. Build aplikasi untuk production:

```bash
npm run build
```

Setelah build selesai, folder `build/` akan berisi semua file yang siap di-deploy.

## Langkah 2: Serve Aplikasi

### Opsi A: Serve Lokal (untuk Testing)

1. Install `serve` (jika belum ada):

```bash
npm install -g serve
```

2. Serve folder build:

```bash
serve -s build -l 3001
```

Atau gunakan Vite preview:

```bash
npm run build
npm run preview
# atau
npm run serve
```

3. Buka browser di: `http://localhost:3001`

### Opsi B: Deploy ke Server (untuk Production)

Deploy folder `build/` ke server web yang mendukung HTTPS, seperti:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- Server sendiri dengan HTTPS

## Langkah 3: Install ke Device

### 📱 Android (Chrome/Edge)

1. Buka aplikasi di browser Chrome atau Edge
2. Tap menu (3 titik) di pojok kanan atas
3. Pilih **"Install app"** atau **"Add to Home screen"**
4. Konfirmasi dengan tap **"Install"**
5. Aplikasi akan muncul di home screen

**Atau**:

- Browser akan menampilkan banner "Add to Home screen" di bagian bawah
- Tap banner tersebut untuk install

### 🍎 iOS (Safari)

1. Buka aplikasi di Safari (bukan Chrome)
2. Tap tombol **Share** (kotak dengan panah ke atas)
3. Scroll down dan tap **"Add to Home Screen"**
4. Edit nama aplikasi (opsional)
5. Tap **"Add"** di pojok kanan atas
6. Aplikasi akan muncul di home screen

**Catatan iOS**:

- Hanya Safari yang mendukung install PWA
- Aplikasi harus diakses via HTTPS (tidak bisa localhost)
- Setelah install, aplikasi akan terbuka seperti aplikasi native

### 💻 Desktop (Chrome/Edge)

1. Buka aplikasi di browser Chrome atau Edge
2. Di address bar, cari ikon **"Install"** (ikon + atau download)
3. Klik ikon tersebut
4. Klik **"Install"** di dialog yang muncul
5. Aplikasi akan terbuka sebagai window terpisah

**Atau**:

- Klik menu (3 titik) → **"Install MakanMana"**
- Aplikasi akan muncul di desktop dan start menu

### 🖥️ Desktop (Firefox)

Firefox tidak mendukung install PWA secara native, tapi bisa:

1. Buka aplikasi
2. Klik menu → **"More Tools"** → **"Use App"**
3. Aplikasi akan terbuka sebagai window terpisah

## Verifikasi PWA

### Chrome DevTools

1. Buka DevTools (F12)
2. Tab **Application**
3. Cek:
   - **Service Workers** - harus terdaftar dan aktif
   - **Manifest** - harus valid dengan semua icon
   - **Storage** - cek cache yang terbuat

### Lighthouse Audit

1. Buka DevTools → Tab **Lighthouse**
2. Pilih **Progressive Web App**
3. Klik **"Generate report"**
4. Pastikan semua kriteria PWA terpenuhi

## Troubleshooting

### PWA tidak bisa diinstall

**Masalah**: Tombol install tidak muncul

**Solusi**:

- Pastikan menggunakan HTTPS atau localhost
- Cek Service Worker sudah terdaftar (DevTools → Application → Service Workers)
- Cek Manifest valid (DevTools → Application → Manifest)
- Pastikan semua icon tersedia di folder `public/`

### Service Worker tidak terdaftar

**Solusi**:

1. Buka DevTools → Application → Service Workers
2. Klik **"Unregister"** untuk service worker lama
3. Refresh halaman (Ctrl+Shift+R atau Cmd+Shift+R)
4. Cek kembali Service Workers

### Icon tidak muncul

**Solusi**:

1. Pastikan semua icon ada di folder `public/`:
   - `pwa-64x64.png`
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `maskable-icon-512x512.png`
   - `apple-touch-icon.png`
   - `favicon.png`
2. Rebuild aplikasi: `npm run build`
3. Clear cache browser dan refresh

### iOS tidak menampilkan install prompt

**Solusi**:

- Pastikan menggunakan Safari (bukan Chrome)
- Pastikan menggunakan HTTPS (localhost tidak bekerja di iOS)
- Cek meta tag di `index.html` sudah benar
- Pastikan `apple-touch-icon.png` ada di folder `public/`

## Testing Offline

Setelah install, test fitur offline:

### Cara 1: Menggunakan Chrome DevTools

1. Build aplikasi: `npm run build`
2. Serve build: `npm run preview` atau `npm run serve`
3. Buka aplikasi di browser: `http://localhost:3001`
4. Buka Chrome DevTools (F12)
5. Buka tab **Network**
6. Centang **"Offline"** checkbox
7. Refresh halaman (F5 atau Ctrl+R)
8. Aplikasi harus tetap bisa dibuka (menggunakan cache)

### Cara 2: Test di Device

1. Install aplikasi ke device (lihat panduan install di atas)
2. Buka aplikasi
3. Pastikan aplikasi sudah ter-load sekali (untuk cache assets)
4. Matikan WiFi/Data di device
5. Tutup aplikasi
6. Buka kembali aplikasi
7. Aplikasi harus tetap bisa dibuka (menggunakan cache)

## Update PWA

PWA akan otomatis update saat ada versi baru karena menggunakan `registerType: "autoUpdate"`.

Untuk memaksa update:

1. Buka aplikasi
2. Tutup aplikasi
3. Buka kembali (service worker akan check update)

Atau di Chrome DevTools:

1. Application → Service Workers
2. Klik **"Update"** atau **"Unregister"** lalu refresh

## Catatan Penting

1. **Ikon PWA**: Pastikan semua icon sudah ditambahkan ke folder `public/` sebelum build
2. **HTTPS**: Di production, wajib menggunakan HTTPS
3. **Testing**: Gunakan localhost untuk testing di development
4. **Browser Support**:
   - Chrome/Edge: Full support
   - Safari (iOS): Full support (HTTPS required)
   - Firefox: Limited support
   - Samsung Internet: Full support

## Deploy ke Production

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

Setelah deploy, akses aplikasi via HTTPS dan install seperti panduan di atas.

