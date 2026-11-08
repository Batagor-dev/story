import sharp from 'sharp';

async function inspectLeftSide() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Left Side x = 10..55 ---');
  for (let x = 10; x <= 55; x += 5) {
    let nonZero = [];
    for (let y = 50; y < 190; y++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 100) nonZero.push(y);
    }
    if (nonZero.length > 0) {
      console.log(`x=${x}: y min=${nonZero[0]}, max=${nonZero[nonZero.length - 1]}, count=${nonZero.length}`);
    } else {
      console.log(`x=${x}: empty`);
    }
  }
}

inspectLeftSide();
