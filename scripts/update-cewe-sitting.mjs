import sharp from 'sharp';

async function updateCeweSitting() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's crop around Ara:
  // x from 45 to 135 (w = 90), y from 0 to 193 (h = 193)
  // Ara's bounding box in ara_bench_1.png:
  let minX = 999, maxX = -1, minY = 999, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 45; x < 135; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Ara crop region: x=[${minX}..${maxX}], y=[${minY}..${maxY}]`);
  
  // Extract and save to cewe_sitting.png
  await sharp('public/assets/sprites/ara_bench_1.png')
    .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
    .png()
    .toFile('public/assets/sprites/cewe_sitting.png');
  console.log('Updated public/assets/sprites/cewe_sitting.png');
}

updateCeweSitting();
