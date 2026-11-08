import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function perfectSeamlessTile() {
  const { data, info } = await sharp(tilesetPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  // Extract Tile 2 from media_1794074302907_375c7ec2.png
  // Solid dirt interior is x: 172 to 280 (w = 108), y: 28 to 92 (h = 65)
  const srcX = 172;
  const srcY = 28;
  const tileW = 96;
  const tileH = 65;

  const buf = Buffer.alloc(tileW * tileH * 4);

  // 1. Copy raw block
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

  // 2. Seamless offset crossfade:
  // We offset the image by half width:
  const halfW = Math.floor(tileW / 2); // 48
  const offsetBuf = Buffer.alloc(tileW * tileH * 4);

  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      const origX = (x + halfW) % tileW;
      const sIdx = (y * tileW + origX) * 4;
      const dIdx = (y * tileW + x) * 4;
      offsetBuf[dIdx] = buf[sIdx];
      offsetBuf[dIdx + 1] = buf[sIdx + 1];
      offsetBuf[dIdx + 2] = buf[sIdx + 2];
      offsetBuf[dIdx + 3] = buf[sIdx + 3];
    }
  }

  // Now the seam is in the middle at x = halfW (48)!
  // Crossfade around x = 40..56 (width 16)
  const blendRadius = 8;
  const blendCenter = halfW;
  for (let y = 0; y < tileH; y++) {
    for (let i = -blendRadius; i <= blendRadius; i++) {
      const cx = blendCenter + i;
      const t = (i + blendRadius) / (blendRadius * 2); // 0 to 1

      // sample left and right
      const leftSampleX = blendCenter - blendRadius;
      const rightSampleX = blendCenter + blendRadius;

      const cIdx = (y * tileW + cx) * 4;
      const lIdx = (y * tileW + leftSampleX) * 4;
      const rIdx = (y * tileW + rightSampleX) * 4;

      for (let c = 0; c < 4; c++) {
        offsetBuf[cIdx + c] = Math.round((1 - t) * offsetBuf[lIdx + c] + t * offsetBuf[rIdx + c]);
      }
    }
  }

  // Offset BACK by halfW!
  const finalBuf = Buffer.alloc(tileW * tileH * 4);
  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      const origX = (x + halfW) % tileW;
      const sIdx = (y * tileW + origX) * 4;
      const dIdx = (y * tileW + x) * 4;
      finalBuf[dIdx] = offsetBuf[sIdx];
      finalBuf[dIdx + 1] = offsetBuf[sIdx + 1];
      finalBuf[dIdx + 2] = offsetBuf[sIdx + 2];
      finalBuf[dIdx + 3] = offsetBuf[sIdx + 3];
    }
  }

  // Ensure 100% full opacity in dirt center
  for (let y = 14; y < tileH - 14; y++) {
    for (let x = 0; x < tileW; x++) {
      finalBuf[(y * tileW + x) * 4 + 3] = 255;
    }
  }

  await sharp(finalBuf, { raw: { width: tileW, height: tileH, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/path_straight_h.png');
  console.log('Saved perfect seamless public/assets/sprites/path_straight_h.png');

  // Verify repeat 4x
  const test4x = Buffer.alloc(tileW * 4 * tileH * 4);
  for (let rep = 0; rep < 4; rep++) {
    for (let y = 0; y < tileH; y++) {
      for (let x = 0; x < tileW; x++) {
        const sIdx = (y * tileW + x) * 4;
        const dIdx = (y * (tileW * 4) + (rep * tileW + x)) * 4;
        for (let c = 0; c < 4; c++) test4x[dIdx + c] = finalBuf[sIdx + c];
      }
    }
  }

  await sharp(test4x, { raw: { width: tileW * 4, height: tileH, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/test_path_h_4x.png');

  // Check diff across seam
  let maxDiff = 0;
  for (let y = 18; y < tileH - 18; y++) {
    const idxA = (y * (tileW * 4) + (tileW - 1)) * 4;
    const idxB = (y * (tileW * 4) + tileW) * 4;
    const d = Math.max(
      Math.abs(test4x[idxA] - test4x[idxB]),
      Math.abs(test4x[idxA+1] - test4x[idxB+1]),
      Math.abs(test4x[idxA+2] - test4x[idxB+2])
    );
    if (d > maxDiff) maxDiff = d;
  }
  console.log('Max color diff across seam in test4x:', maxDiff);
}

perfectSeamlessTile();
