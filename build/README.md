# PWA Icons

Folder ini berisi icon-icon yang diperlukan untuk PWA (Progressive Web App).

## Icon yang Diperlukan

Pastikan semua icon berikut ada di folder ini sebelum build:

1. **pwa-192x192.png** - Icon 192x192 untuk PWA
2. **pwa-512x512.png** - Icon 512x512 untuk PWA
3. **maskable-icon-512x512.png** - Maskable icon 512x512 untuk Android
4. **apple-touch-icon.png** - Icon untuk iOS (180x180)
5. **favicon.png** - Favicon untuk browser

## Cara Membuat Icon

1. Siapkan logo atau icon utama aplikasi (minimal 512x512)
2. Generate semua ukuran icon menggunakan tool online seperti:
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder](https://www.pwabuilder.com/imageGenerator)

3. Atau buat manual menggunakan image editor:
   - Resize ke ukuran yang diperlukan
   - Pastikan format PNG
   - Untuk maskable-icon, pastikan icon memiliki padding yang cukup (minimal 20% dari ukuran)

## Catatan

- Semua icon harus dalam format PNG
- Icon harus memiliki transparansi untuk maskable-icon
- Pastikan icon terlihat jelas di berbagai ukuran
- Icon akan otomatis di-copy ke folder `build/` saat build

