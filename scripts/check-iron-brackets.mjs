import sharp from 'sharp';

async function checkIronBrackets() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Checking Left Bracket (x=35..45) vs Right Bracket (x=175..185) ---');
  for (let y = 60; y <= 115; y += 5) {
    let leftIron = -1, rightIron = -1;
    for (let x = 35; x <= 45; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx+3] > 100 && data[idx] < 80 && data[idx+1] < 60 && data[idx+2] < 60) {
        leftIron = x; break;
      }
    }
    for (let x = 175; x <= 185; x++) {
      const idx = (y * w + x) * 4;
      if (data[idx+3] > 100 && data[idx] < 80 && data[idx+1] < 60 && data[idx+2] < 60) {
        rightIron = x; break;
      }
    }
    console.log(`y=${y}: leftBracketX=${leftIron}, rightBracketX=${rightIron}`);
  }
}

checkIronBrackets();
