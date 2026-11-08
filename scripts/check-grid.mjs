import sharp from 'sharp';

async function checkCheckerboard(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  // scan row 10 from x=0 to 200
  const y = 10;
  let changes = [];
  let lastColor = null;
  for (let x = 0; x < 300; x++) {
    const idx = (y * info.width + x) * info.channels;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    const colorKey = `${Math.round(r/10)*10},${Math.round(g/10)*10},${Math.round(b/10)*10}`;
    if (colorKey !== lastColor) {
      changes.push({ x, rgb: [r, g, b] });
      lastColor = colorKey;
    }
  }
  console.log(`File ${file}:`);
  console.log('Changes in first 300px:', changes.slice(0, 10));
}

async function run() {
  await checkCheckerboard('public/assets/karakter/karakter_cowo.jpeg');
  await checkCheckerboard('public/assets/componet/bunga.jpeg');
  await checkCheckerboard('public/assets/componet/buklet_bungan.jpeg');
  await checkCheckerboard('public/assets/componet/pohon.jpeg');
}

run();
