import sharp from 'sharp';

async function generatePerfectEmptyBench() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  const out = Buffer.from(data);

  // Bench slope
  // At x = 160: benchTop ≈ 48, seatBottom ≈ 136
  // At x = 140: benchTop ≈ 52, seatBottom ≈ 140
  // m = -0.2 (1 px up per 5 px right)
  const m = -0.2;

  // Let's sample wood from a clean region on the right:
  // x in [148, 168] (width 21)
  const sampleStart = 148;
  const sampleWidth = 20;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;

      // 1. Above bench backrest:
      // Compute the top line of the backrest at x
      // For x from 40 to 180:
      const benchTop = Math.round(48 + m * (x - 160));
      const seatBottom = Math.round(136 + m * (x - 160));

      if (x >= 35 && x <= 180) {
        if (y < benchTop) {
          // Clear any head/hair
          out[idx] = 0;
          out[idx + 1] = 0;
          out[idx + 2] = 0;
          out[idx + 3] = 0;
          continue;
        }

        // 2. Below bench seat:
        if (y > seatBottom) {
          // If we are in the left front leg area (x: 40..52, y: 135..190), preserve the leg!
          if (x >= 40 && x <= 53) {
            // Check if this pixel is part of the iron leg in original data:
            // Iron leg is dark grey/black: r < 80, g < 80, b < 80
            const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
            if (a > 50 && (r < 80 && g < 80 && b < 80)) {
              // Keep original iron leg pixel
              continue;
            }
          }

          // Otherwise, clear (air under bench, shoes, skirt)
          out[idx] = 0;
          out[idx + 1] = 0;
          out[idx + 2] = 0;
          out[idx + 3] = 0;
          continue;
        }

        // 3. Inside the bench slat zone (y between benchTop and seatBottom):
        // Replace Ara's torso, book, scarf, skirt with seamless bench slats!
        // Ara covers roughly x from 43 to 142.
        if (x >= 43 && x <= 144) {
          // If in the left bracket / front leg top area (x: 43..47), let's check if there's iron:
          const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
          const isIron = a > 100 && r < 60 && g < 60 && b < 60;
          
          // Don't overwrite the left iron bracket if it's already there
          if (x <= 46 && isIron) {
            continue;
          }

          // Sample from the clean reference area:
          const refX = sampleStart + (((x - 43) % sampleWidth + sampleWidth) % sampleWidth);
          const refY = Math.round(y - m * (x - refX));

          if (refY >= 0 && refY < h && refX >= 0 && refX < w) {
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

  // Save the full empty bench
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/bench_empty.png');

  // Also trim empty transparent padding to get a clean tight bounding box
  const trimmed = await sharp('public/assets/sprites/bench_empty.png')
    .trim()
    .toBuffer({ resolveWithObject: true });

  console.log('Trimmed empty bench info:', trimmed.info);

  await sharp(trimmed.data)
    .png()
    .toFile('public/assets/sprites/bench_empty_trimmed.png');

  // Also overwrite pixel_bench.png so that any existing reference displays the matching vintage bench!
  await sharp(trimmed.data)
    .png()
    .toFile('public/assets/sprites/pixel_bench.png');

  console.log('Successfully generated bench_empty.png, bench_empty_trimmed.png, and updated pixel_bench.png!');
}

generatePerfectEmptyBench();
