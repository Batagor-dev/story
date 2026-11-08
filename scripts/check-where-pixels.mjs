import sharp from 'sharp';

async function checkWherePixelsAre() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  for (let x = 130; x <= 175; x += 5) {
    let ys = [];
    for (let y = 145; y <= 185; y++) {
      const idx = (y * w + x) * 4;
      if (data[idx + 3] > 50) {
        ys.push(y);
      }
    }
    if (ys.length > 0) {
      console.log(`x=${x}: ys = [${ys[0]}..${ys[ys.length-1]}] (count ${ys.length})`);
    } else {
      console.log(`x=${x}: empty`);
    }
  }
}

checkWherePixelsAre();
