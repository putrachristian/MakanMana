# PWA Install Prompt Checklist

Gunakan checklist ini untuk memverifikasi bahwa semua syarat PWA install prompt sudah terpenuhi.

## ✅ Syarat-syarat PWA Install Prompt

### 1. Manifest Valid ✅

- [x] `name` atau `short_name` ada
- [x] `start_url` ada
- [x] `display` set ke `standalone`, `fullscreen`, atau `minimal-ui`
- [x] Icon 192x192 dengan `purpose: "any"` ✅
- [x] Icon 512x512 dengan `purpose: "any"` ✅
- [x] `prefer_related_applications: false` ✅

### 2. Service Worker ✅

- [x] Service Worker terdaftar dan aktif
- [x] Service Worker memiliki event listener untuk `fetch`

### 3. HTTPS atau Localhost ✅

- [ ] Aplikasi diakses melalui HTTPS (production)
- [ ] ATAU diakses melalui localhost (development)
- [ ] ATAU diakses melalui 127.0.0.1 (testing)

### 4. Aplikasi Belum Diinstal ✅

- [ ] Aplikasi belum pernah diinstall sebelumnya
- [ ] Jika sudah diinstall, uninstall dulu untuk testing

### 5. Interaksi Pengguna ✅

- [ ] User sudah berinteraksi dengan halaman (scroll, klik, dll)
- [ ] Event `beforeinstallprompt` ditangani dengan benar

## Cara Verifikasi

### 1. Cek Manifest di Chrome DevTools

1. Buka aplikasi di browser Chrome
2. Buka DevTools (F12)
3. Tab **Application** → **Manifest**
4. Cek:
   - ✅ Manifest valid (tidak ada error)
   - ✅ Semua icon terdeteksi
   - ✅ `prefer_related_applications: false`

### 2. Cek Service Worker

1. DevTools → **Application** → **Service Workers**
2. Cek:
   - ✅ Service Worker terdaftar dan status "activated and is running"
   - ✅ Tidak ada error

### 3. Cek Event `beforeinstallprompt`

1. Buka Console di DevTools
2. Ketik: `window.addEventListener('beforeinstallprompt', (e) => console.log('beforeinstallprompt fired!', e))`
3. Refresh halaman
4. Cek apakah event terpicu (akan muncul log di console)

### 4. Test Install Prompt

1. Pastikan semua syarat di atas terpenuhi
2. Refresh halaman (Ctrl+Shift+R atau Cmd+Shift+R)
3. Tunggu beberapa detik
4. Cek apakah install prompt muncul

## Troubleshooting

### Event `beforeinstallprompt` tidak terpicu

**Kemungkinan penyebab:**

1. Manifest tidak valid - cek di DevTools → Application → Manifest
2. Icon tidak ada atau tidak bisa diakses - cek di DevTools → Application → Manifest
3. Service Worker tidak terdaftar - cek di DevTools → Application → Service Workers
4. Aplikasi sudah diinstall - uninstall dulu
5. Tidak menggunakan HTTPS atau localhost - pastikan menggunakan HTTPS atau localhost
6. Browser tidak mendukung - gunakan Chrome/Edge terbaru

**Solusi:**

1. Buka DevTools → Application → Manifest
2. Cek apakah ada error atau warning
3. Pastikan semua icon terdeteksi
4. Cek Service Worker di DevTools → Application → Service Workers
5. Clear cache browser dan refresh (Ctrl+Shift+R atau Cmd+Shift+R)
6. Unregister service worker lama jika ada
7. Rebuild aplikasi: `npm run build`
8. Serve build: `npm run preview` atau `npm run serve`

### Install Prompt muncul tapi tidak berfungsi

**Kemungkinan penyebab:**

1. `deferredPrompt` null - event `beforeinstallprompt` tidak terpicu
2. Error saat memanggil `deferredPrompt.prompt()`

**Solusi:**

1. Cek console untuk error
2. Pastikan event `beforeinstallprompt` terpicu
3. Cek apakah `deferredPrompt` tidak null sebelum memanggil `prompt()`

## Catatan Penting

1. **HTTPS wajib untuk production** - PWA tidak akan bekerja di HTTP (kecuali localhost)
2. **Icon harus bisa diakses** - pastikan icon ada di folder `public/` dan ter-copy ke `build/`
3. **Service Worker harus aktif** - pastikan service worker terdaftar dan tidak ada error
4. **Browser support** - Chrome/Edge terbaru mendukung PWA install prompt
5. **Testing** - Gunakan localhost untuk testing, HTTPS untuk production

