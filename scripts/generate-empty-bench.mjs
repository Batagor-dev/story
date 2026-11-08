import sharp from 'sharp';

async function generateEmptyBench() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Clone data buffer
  const out = Buffer.from(data);

  // We want to reconstruct the empty bench in the area where Ara sits:
  // Horizontally, Ara covers roughly x = 52 to 142.
  // Vertically:
  // - Above the bench: Ara's head/hair from y = 10 to ~50 (should be cleared to transparent!)
  // - Bench backrest slats: y = 50 to 105
  // - Bench seat slats: y = 105 to 145
  // - Below bench seat: Ara's legs, shoes, skirt from y = 145 to 192 (should be cleared to transparent, EXCEPT the left front leg at x=44..55 and left back leg at x=12..25!)

  // First, let's look at the clean reference slice:
  // xRef in [145, 165] (width 21 pixels)
  // Let's check slope:
  // Slat top at x=160 is y=48. Slat top at x=140 is y=52.
  // slope m = (48 - 52) / (160 - 140) = -4 / 20 = -0.2.
  const m = -0.2;

  // Let's create an empty bench buffer
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;

      // 1. Clear Ara's head and anything above the bench
      // The bench top at column x: yBenchTop(x) ≈ 48 + m * (x - 160)
      const benchTop = Math.round(48 + m * (x - 160));
      if (y < benchTop && x < 185) {
        // Clear anything above the top of the bench backrest
        out[idx] = 0;
        out[idx + 1] = 0;
        out[idx + 2] = 0;
        out[idx + 3] = 0;
        continue;
      }

      // 2. Clear Ara's body, legs, and skirt in the region x = 55 to 142
      // Bench seat bottom at column x: ySeatBottom(x) ≈ 136 + m * (x - 160)
      const seatBottom = Math.round(136 + m * (x - 160));

      if (x >= 55 && x <= 142) {
        if (y > seatBottom) {
          // Below the seat: clear to transparent (air under bench)
          out[idx] = 0;
          out[idx + 1] = 0;
          out[idx + 2] = 0;
          out[idx + 3] = 0;
        } else if (y >= benchTop && y <= seatBottom) {
          // Inside the bench backrest or seat:
          // Sample from the clean reference area [145, 165]
          // We can tile smoothly:
          const cycleLen = 18; // 18 pixels wide repeating pattern
          const offset = ((x - 55) % cycleLen + cycleLen) % cycleLen;
          const refX = 146 + offset;
          const refY = Math.round(y - m * (x - refX));

          if (refY >= 0 && refY < h && refX < w) {
            const refIdx = (refY * w + refX) * 4;
            out[idx] = data[refIdx];
            out[idx + 1] = data[refIdx + 1];
            out[idx + 2] = data[refIdx + 2];
            out[idx + 3] = data[refIdx + 3];
          }
        }
      }
    }
  }

  // Save test empty bench
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/test_bench_reconstructed.png');

  console.log('Saved test_bench_reconstructed.png');
}

generateEmptyBench();
