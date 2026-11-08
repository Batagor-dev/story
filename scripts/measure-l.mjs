import sharp from 'sharp';

async function measureL() {
  const { data, info } = await sharp('public/assets/sprites/test_tile_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's find dirt at bottom edge y = h - 1:
  let bottomMinX = -1, bottomMaxX = -1;
  for (let x = 0; x < w; x++) {
    const idx = ((h - 1) * w + x) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
    if (a > 100 && r > 140 && g > 110 && b < 130) {
      if (bottomMinX === -1) bottomMinX = x;
      bottomMaxX = x;
    }
  }

  // Let's find dirt at right edge x = w - 1:
  let rightMinY = -1, rightMaxY = -1;
  for (let y = 0; y < h; y++) {
    const idx = (y * w + (w - 1)) * 4;
    const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
    if (a > 100 && r > 140 && g > 110 && b < 130) {
      if (rightMinY === -1) rightMinY = y;
      rightMaxY = y;
    }
  }

  console.log(`L-Corner (test_tile_1):`);
  console.log(`Bottom connection (dirt): x=[${bottomMinX}..${bottomMaxX}], width=${bottomMaxX - bottomMinX + 1}`);
  console.log(`Right connection (dirt): y=[${rightMinY}..${rightMaxY}], height=${rightMaxY - rightMinY + 1}`);
}

measureL();
