import sharp from 'sharp';

async function inspectRightFrontLegFoot() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Inspecting Right Front Leg (x=194..208, y=145..165) ---');
  for (let y = 145; y <= 165; y++) {
    let row = `y=${y}: `;
    for (let x = 194; x <= 208; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += ' . ';
      else if (r < 75 && g < 75 && b < 75) row += '[#]';
      else row += ' ? ';
    }
    console.log(row);
  }
}

inspectRightFrontLegFoot();
