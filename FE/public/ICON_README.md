# ICON PLACEHOLDER - Read instructions below

## Instructions untuk Icon

Untuk mendapatkan icon yang baik untuk aplikasi MonitorPLC:

### Option 1: Generate Icon Online
1. Pergi ke https://www.favicon-generator.org/ atau https://icoconv.com/
2. Upload atau design logo Anda
3. Generate icon dalam berbagai ukuran
4. Download versi 512x512 PNG
5. Rename ke "icon.png" dan letakkan di FE/public/

### Option 2: Design Custom
Gunakan tools seperti:
- Figma: https://figma.com/ (free)
- Inkscape: https://inkscape.org/ (free, open-source)
- Adobe XD: https://www.adobe.com/products/xd.html

Requirement:
- Format: PNG
- Size: minimal 512x512 pixels (atau bigger)
- Transparent background recommended
- Filename: icon.png

### Option 3: Gunakan Placeholder (Temporary)
Untuk testing, Anda bisa skip icon dan app akan berjalan tanpa icon custom.

### Recommended Design
Untuk monitoring PLC app, icon yang bagus:
- Gear/gear icon (untuk industrial/technical)
- Factory/industrial theme
- Simple, scalable design
- Warna: Biru, abu-abu, orange

## File Resolution

Setelah icon ready:
1. Save sebagai PNG file dengan nama "icon.png"
2. Copy ke: FE/public/icon.png
3. Icon akan automatically digunakan dalam:
   - Windows installer (.exe)
   - Linux AppImage
   - Application window
   - Desktop shortcut

## Testing

Setelah menempatkan icon:
```bash
cd FE
npm run electron-dev
```

Icon akan muncul di:
- Window title bar
- Taskbar (Windows) / Dock (macOS)
- Application launcher (Linux)
