import sharp from 'sharp';

async function checkLeftHairAndScarf() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Checking ara_bench_1.png at x=35..55, y=50..90 ---');
  for (let y = 50; y <= 90; y += 2) {
    let row = `y=${y}: `;
    for (let x = 35; x <= 55; x += 2) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += '   _ ';
      else row += `${String(r).padStart(3)},${String(g).padStart(3)} `;
    }
    console.log(row);
  }
}

checkLeftHairAndScarf();
