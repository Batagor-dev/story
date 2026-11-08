import sharp from 'sharp';

async function analyzeGrid(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's inspect the top-left 100x100 area (which is completely checkerboard in all these images!)
  // Find horizontal period:
  let bestPeriodX = 0;
  let minDiffX = Infinity;

  // Let's test periods from 30 to 60
  for (let p = 30; p <= 60; p++) {
    let diff = 0;
    let count = 0;
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < 200; x++) {
        const i1 = (y * width + x) * channels;
        const i2 = (y * width + (x + 2 * p)) * channels;
        diff += Math.abs(data[i1] - data[i2]) + Math.abs(data[i1+1] - data[i2+1]) + Math.abs(data[i1+2] - data[i2+2]);
        count++;
      }
    }
    const avgDiff = diff / count;
    if (avgDiff < minDiffX) {
      minDiffX = avgDiff;
      bestPeriodX = p;
    }
  }

  // Find vertical period:
  let bestPeriodY = 0;
  let minDiffY = Infinity;
  for (let p = 30; p <= 60; p++) {
    let diff = 0;
    let count = 0;
    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 100; x++) {
        const i1 = (y * width + x) * channels;
        const i2 = ((y + 2 * p) * width + x) * channels;
        diff += Math.abs(data[i1] - data[i2]) + Math.abs(data[i1+1] - data[i2+1]) + Math.abs(data[i1+2] - data[i2+2]);
        count++;
      }
    }
    const avgDiff = diff / count;
    if (avgDiff < minDiffY) {
      minDiffY = avgDiff;
      bestPeriodY = p;
    }
  }

  // Sample tile A (center of tile 0,0) and tile B (center of tile 1,0)
  const halfPx = Math.floor(bestPeriodX / 2);
  const halfPy = Math.floor(bestPeriodY / 2);
  const idxA = (halfPy * width + halfPx) * channels;
  const idxB = (halfPy * width + (bestPeriodX + halfPx)) * channels;

  console.log(`${file}:
  Tile size: ${bestPeriodX}x${bestPeriodY} (period error X: ${minDiffX.toFixed(2)}, Y: ${minDiffY.toFixed(2)})
  Color A: [${data[idxA]}, ${data[idxA+1]}, ${data[idxA+2]}]
  Color B: [${data[idxB]}, ${data[idxB+1]}, ${data[idxB+2]}]
  `);
}

async function run() {
  await analyzeGrid('public/assets/karakter/karakter_cowo.jpeg');
  await analyzeGrid('public/assets/karakter/karakter_cewe.jpeg');
  await analyzeGrid('public/assets/componet/bunga.jpeg');
  await analyzeGrid('public/assets/componet/buklet_bungan.jpeg');
  await analyzeGrid('public/assets/componet/pohon.jpeg');
  await analyzeGrid('public/assets/componet/semak.jpeg');
}

run();
