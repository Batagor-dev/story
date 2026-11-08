import sharp from 'sharp';
import fs from 'fs';

async function createPixelTiles() {
  const outDir = 'public/assets/sprites';
  fs.mkdirSync(outDir, { recursive: true });

  // 1. Pixel Grass Tile (64x64)
  const grassSvg = `
  <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="64" height="64" fill="#4d9b35"/>
    <!-- Grass shades and tufts -->
    <rect x="6" y="8" width="2" height="6" fill="#3c7d28"/>
    <rect x="8" y="6" width="2" height="4" fill="#5db841"/>
    <rect x="22" y="24" width="2" height="6" fill="#3c7d28"/>
    <rect x="24" y="22" width="2" height="4" fill="#5db841"/>
    <rect x="42" y="12" width="2" height="6" fill="#3c7d28"/>
    <rect x="44" y="10" width="2" height="4" fill="#5db841"/>
    <rect x="52" y="38" width="2" height="6" fill="#3c7d28"/>
    <rect x="54" y="36" width="2" height="4" fill="#5db841"/>
    <rect x="14" y="48" width="2" height="6" fill="#3c7d28"/>
    <rect x="16" y="46" width="2" height="4" fill="#5db841"/>
    <rect x="34" y="52" width="2" height="6" fill="#3c7d28"/>
    <rect x="36" y="50" width="2" height="4" fill="#5db841"/>
    <!-- Little wild yellow flower dot -->
    <rect x="48" y="24" width="4" height="4" fill="#facc15"/>
    <rect x="49" y="25" width="2" height="2" fill="#eab308"/>
    <rect x="18" y="16" width="3" height="3" fill="#f43f5e"/>
  </svg>`;
  await sharp(Buffer.from(grassSvg)).png().toFile(`${outDir}/tile_grass.png`);

  // 2. Pixel Path Tile (64x64) - Sand / Cobblestone
  const pathSvg = `
  <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <rect width="64" height="64" fill="#e2caa2"/>
    <!-- Paver stones and grain -->
    <rect x="4" y="4" width="26" height="12" fill="#d4ba90" stroke="#be9f72" stroke-width="2"/>
    <rect x="34" y="4" width="26" height="12" fill="#edd6b3" stroke="#be9f72" stroke-width="2"/>
    <rect x="14" y="20" width="36" height="12" fill="#d4ba90" stroke="#be9f72" stroke-width="2"/>
    <rect x="4" y="36" width="24" height="12" fill="#edd6b3" stroke="#be9f72" stroke-width="2"/>
    <rect x="32" y="36" width="28" height="12" fill="#d4ba90" stroke="#be9f72" stroke-width="2"/>
    <rect x="18" y="52" width="28" height="10" fill="#edd6b3" stroke="#be9f72" stroke-width="2"/>
    <!-- Little pebbles -->
    <rect x="6" y="22" width="4" height="4" fill="#a4845a"/>
    <rect x="54" y="22" width="4" height="4" fill="#a4845a"/>
  </svg>`;
  await sharp(Buffer.from(pathSvg)).png().toFile(`${outDir}/tile_path.png`);

  // 3. Pixel Wooden Garden Fence (80x36)
  const fenceSvg = `
  <svg width="80" height="36" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- Horizontal rails -->
    <rect x="0" y="8" width="80" height="6" fill="#a16207" stroke="#451a03" stroke-width="2"/>
    <rect x="0" y="20" width="80" height="6" fill="#a16207" stroke="#451a03" stroke-width="2"/>
    <!-- Vertical posts with pointed tops -->
    <polygon points="12,0 8,6 16,6" fill="#ca8a04"/>
    <rect x="8" y="6" width="8" height="30" fill="#ca8a04" stroke="#451a03" stroke-width="2"/>
    <polygon points="36,0 32,6 40,6" fill="#ca8a04"/>
    <rect x="32" y="6" width="8" height="30" fill="#ca8a04" stroke="#451a03" stroke-width="2"/>
    <polygon points="60,0 56,6 64,6" fill="#ca8a04"/>
    <rect x="56" y="6" width="8" height="30" fill="#ca8a04" stroke="#451a03" stroke-width="2"/>
  </svg>`;
  await sharp(Buffer.from(fenceSvg)).png().toFile(`${outDir}/pixel_fence.png`);

  // 4. Pixel Garden Street Lamp (36x96)
  const lampSvg = `
  <svg width="36" height="96" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <!-- Base -->
    <rect x="10" y="88" width="16" height="8" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <!-- Pole -->
    <rect x="15" y="28" width="6" height="60" fill="#334155" stroke="#0f172a" stroke-width="2"/>
    <!-- Lantern head -->
    <polygon points="18,4 6,14 30,14" fill="#0f172a"/>
    <rect x="8" y="14" width="20" height="14" fill="#fef08a" stroke="#0f172a" stroke-width="2"/>
    <rect x="12" y="16" width="12" height="10" fill="#ffffff" opacity="0.8"/>
  </svg>`;
  await sharp(Buffer.from(lampSvg)).png().toFile(`${outDir}/pixel_lamp.png`);

  console.log('Pixel tiles created successfully!');
}

createPixelTiles();
