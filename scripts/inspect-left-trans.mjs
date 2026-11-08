import sharp from 'sharp';

async function inspectLeftTransition() {
  const { data, info } = await sharp('public/assets/sprites/test_bench_reconstructed.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Left Frame Transition (x=30..65, y=55..185) ---');
  for (let y = 55; y <= 185; y += 4) {
    let row = `y=${('00' + y).slice(-3)}: `;
    for (let x = 30; x <= 65; x += 2) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += ' . ';
      else if (r < 70 && g < 70 && b < 70) row += '[#]'; // iron
      else if (r > 120 && g > 70 && b < 70) row += '[=]'; // wood
      else row += ' ? ';
    }
    console.log(row);
  }
}

inspectLeftTransition();
