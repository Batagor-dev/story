import sharp from 'sharp';

async function inspectLeftFrontLeg() {
  const { data, info } = await sharp('public/assets/sprites/ara_bench_1.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Inspecting Left Front Leg (x=42..56, y=140..190) ---');
  for (let y = 140; y <= 190; y += 2) {
    let row = `y=${y}: `;
    for (let x = 42; x <= 56; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += ' . ';
      else if (r < 75 && g < 75 && b < 75) row += '[#]'; // iron leg
      else if (r > 120 && g > 70 && b < 70) row += '[=]'; // wood
      else row += ' ? '; // skirt or shoe
    }
    console.log(row);
  }
}

inspectLeftFrontLeg();
