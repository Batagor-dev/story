import sharp from 'sharp';

async function inspectSeatSlats() {
  const { data, info } = await sharp('public/assets/sprites/test_bench_reconstructed.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;

  console.log('--- Inspecting Seat Area in Reconstructed (x=60..130, y=110..145) ---');
  for (let y = 110; y <= 145; y += 3) {
    let row = `y=${y}: `;
    for (let x = 60; x <= 130; x += 5) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a < 50) row += '   _ ';
      else row += `${String(r).padStart(3)},${String(g).padStart(3)} `;
    }
    console.log(row);
  }
}

inspectSeatSlats();
