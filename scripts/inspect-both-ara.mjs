import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function inspectBoth() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  function getExactBounds(minSearchX, maxSearchX) {
    let minX = 999, maxX = -1, minY = 999, maxY = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = minSearchX; x <= maxSearchX; x++) {
        const a = data[(y * info.width + x) * 4 + 3];
        if (a > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  const f1 = getExactBounds(0, 233);
  const f2 = getExactBounds(234, info.width - 1);
  console.log('Frame 1 (Left):', f1);
  console.log('Frame 2 (Right):', f2);
}

inspectBoth();
