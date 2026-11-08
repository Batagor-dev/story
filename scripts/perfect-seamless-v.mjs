import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function perfectSeamlessVertical() {
  const { data, info } = await sharp(tilesetPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  // From crossroad vertical arms or Tile 4:
  // Tile 4 (crossroad) has long vertical arms!
  // Top vertical arm: x: 196..260 (w = 65), y: 148..240
  // Or let's inspect where path_straight_v was extracted:
  // Let's find vertical arm in Tile 4:
  const srcX = 196;
  const srcY = 152;
  const tileW = 65;
  const tileH = 96;

  const buf = Buffer.alloc(tileW * tileH * 4);
  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      const sIdx = ((srcY + y) * w + (srcX + x)) * 4;
      const dIdx = (y * tileW + x) * 4;
      buf[dIdx] = data[sIdx];
      buf[dIdx + 1] = data[sIdx + 1];
      buf[dIdx + 2] = data[sIdx + 2];
      buf[dIdx + 3] = data[sIdx + 3];
    }
  }

  // Offset by half height:
  const halfH = Math.floor(tileH / 2); // 48
  const offsetBuf = Buffer.alloc(tileW * tileH * 4);
  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      const origY = (y + halfH) % tileH;
      const sIdx = (origY * tileW + x) * 4;
      const dIdx = (y * tileW + x) * 4;
      for (let c = 0; c < 4; c++) offsetBuf[dIdx + c] = buf[sIdx + c];
    }
  }

  // Crossfade around y = halfH (48) with radius 8:
  const blendRadius = 8;
  const blendCenter = halfH;
  for (let x = 0; x < tileW; x++) {
    for (let i = -blendRadius; i <= blendRadius; i++) {
      const cy = blendCenter + i;
      const t = (i + blendRadius) / (blendRadius * 2);

      const topSampleY = blendCenter - blendRadius;
      const botSampleY = blendCenter + blendRadius;

      const cIdx = (cy * tileW + x) * 4;
      const tIdx = (topSampleY * tileW + x) * 4;
      const bIdx = (botSampleY * tileW + x) * 4;

      for (let c = 0; c < 4; c++) {
        offsetBuf[cIdx + c] = Math.round((1 - t) * offsetBuf[tIdx + c] + t * offsetBuf[bIdx + c]);
      }
    }
  }

  // Offset BACK by halfH:
  const finalBuf = Buffer.alloc(tileW * tileH * 4);
  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      const origY = (y + halfH) % tileH;
      const sIdx = (origY * tileW + x) * 4;
      const dIdx = (y * tileW + x) * 4;
      for (let c = 0; c < 4; c++) finalBuf[dIdx + c] = offsetBuf[sIdx + c];
    }
  }

  // Fully opaque dirt
  for (let y = 0; y < tileH; y++) {
    for (let x = 14; x < tileW - 14; x++) {
      finalBuf[(y * tileW + x) * 4 + 3] = 255;
    }
  }

  await sharp(finalBuf, { raw: { width: tileW, height: tileH, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/path_straight_v.png');
  console.log('Saved perfect seamless public/assets/sprites/path_straight_v.png (65x96)');
}

perfectSeamlessVertical();
