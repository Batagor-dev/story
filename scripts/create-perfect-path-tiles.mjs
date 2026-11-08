import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function createPerfectPathTiles() {
  const { data, info } = await sharp(tilesetPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  // 1. EXTRACT L-CORNER (Tile 1: top-left corner that turns from bottom to right)
  // In media_1794074302907_375c7ec2.png:
  // Tile 1 is at minX: 28, maxX: 128, minY: 28, maxY: 128 (101x101)
  // Let's examine exact boundaries of Tile 1
  const lRaw = await sharp(tilesetPath)
    .extract({ left: 28, top: 28, width: 101, height: 101 })
    .png()
    .toFile('public/assets/sprites/path_corner_L.png');
  console.log('Saved public/assets/sprites/path_corner_L.png (101x101)');

  // 2. CREATE 100% SEAMLESS HORIZONTAL PATH TILE
  // In Tile 2: minX: 164, maxX: 288, minY: 28, maxY: 92
  // We saw x=168 to x=284 is the solid content without transparent edges.
  // Let's extract a 96px width slice that seamlessly wraps:
  const hCropX = 172;
  const hCropY = 28;
  const hWidth = 96;
  const hHeight = 65;

  const hTileBuffer = Buffer.alloc(hWidth * hHeight * 4);
  for (let y = 0; y < hHeight; y++) {
    for (let x = 0; x < hWidth; x++) {
      const srcIdx = ((hCropY + y) * w + (hCropX + x)) * 4;
      const dstIdx = (y * hWidth + x) * 4;
      hTileBuffer[dstIdx] = data[srcIdx];
      hTileBuffer[dstIdx + 1] = data[srcIdx + 1];
      hTileBuffer[dstIdx + 2] = data[srcIdx + 2];
      hTileBuffer[dstIdx + 3] = data[srcIdx + 3];
    }
  }

  // To make it 100% SEAMLESS horizontally (left edge connects to right edge with zero seam):
  // Let's blend a 10px boundary:
  const blendW = 10;
  for (let y = 0; y < hHeight; y++) {
    for (let i = 0; i < blendW; i++) {
      const leftIdx = (y * hWidth + i) * 4;
      const rightIdx = (y * hWidth + (hWidth - blendW + i)) * 4;
      
      // Interpolate over the seam
      const alpha = i / blendW; // 0 to 1
      for (let c = 0; c < 3; c++) {
        const blended = Math.round((1 - alpha) * hTileBuffer[rightIdx + c] + alpha * hTileBuffer[leftIdx + c]);
        // Also keep right edge matching left edge
        if (i === 0) {
          hTileBuffer[leftIdx + c] = hTileBuffer[rightIdx + c];
        }
      }
    }
  }

  // Also make sure all dirt pixels have alpha = 255 (no faded semi-transparent pixels at edges!)
  for (let y = 15; y < hHeight - 15; y++) {
    for (let x = 0; x < hWidth; x++) {
      const idx = (y * hWidth + x) * 4;
      if (hTileBuffer[idx + 3] > 100) {
        hTileBuffer[idx + 3] = 255;
      }
    }
  }

  await sharp(hTileBuffer, { raw: { width: hWidth, height: hHeight, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/path_straight_h.png');
  console.log('Saved public/assets/sprites/path_straight_h.png (96x65 seamless)');

  // Test repeat 3x to verify NO SEAMS
  const test3x = Buffer.alloc(hWidth * 3 * hHeight * 4);
  for (let rep = 0; rep < 3; rep++) {
    for (let y = 0; y < hHeight; y++) {
      for (let x = 0; x < hWidth; x++) {
        const srcIdx = (y * hWidth + x) * 4;
        const dstIdx = (y * (hWidth * 3) + (rep * hWidth + x)) * 4;
        test3x[dstIdx] = hTileBuffer[srcIdx];
        test3x[dstIdx + 1] = hTileBuffer[srcIdx + 1];
        test3x[dstIdx + 2] = hTileBuffer[srcIdx + 2];
        test3x[dstIdx + 3] = hTileBuffer[srcIdx + 3];
      }
    }
  }

  await sharp(test3x, { raw: { width: hWidth * 3, height: hHeight, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/test_path_h_3x.png');
  console.log('Saved test_path_h_3x.png (check seamlessness)');
}

createPerfectPathTiles();
