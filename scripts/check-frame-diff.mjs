import sharp from 'sharp';

async function checkDiff() {
  const f1 = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const f2 = await sharp('public/assets/sprites/ara_bench_2.png').raw().toBuffer({ resolveWithObject: true });

  const w = f1.info.width;
  const h = f1.info.height;

  let benchDiffs = 0;
  let headDiffs = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const d = Math.max(
        Math.abs(f1.data[idx] - f2.data[idx]),
        Math.abs(f1.data[idx+1] - f2.data[idx+1]),
        Math.abs(f1.data[idx+2] - f2.data[idx+2]),
        Math.abs(f1.data[idx+3] - f2.data[idx+3])
      );

      if (d > 10) {
        if (y < 85 && x >= 45 && x < 120) {
          headDiffs++;
        } else {
          benchDiffs++;
        }
      }
    }
  }

  console.log(`Head/face animation diffs: ${headDiffs} pixels (blinking & head tilt)`);
  console.log(`Bench & body static diffs outside head: ${benchDiffs} pixels`);
}

checkDiff();
