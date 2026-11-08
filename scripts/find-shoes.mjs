import sharp from 'sharp';

async function findShoes() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Inspecting y=175..192 across x=40..130 ---');
  for (let y = 175; y <= 192; y += 2) {
    let row = `y=${y}: `;
    for (let x = 40; x <= 130; x += 3) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += ' . ';
      else if (r < 75 && g < 75 && b < 75) row += '[#]'; // shoe / iron
      else row += ' ? ';
    }
    console.log(row);
  }
}

findShoes();
