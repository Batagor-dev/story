import sharp from 'sharp';

async function checkUnderBench() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Checking under bench on right side (x=130..175, y=145..185) ---');
  let nonZeroCount = 0;
  for (let x = 130; x <= 175; x++) {
    for (let y = 145; y <= 185; y++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 50) {
        nonZeroCount++;
      }
    }
  }
  console.log(`Non-zero pixels under bench (x=130..175, y=145..185): ${nonZeroCount}`);
}

checkUnderBench();
