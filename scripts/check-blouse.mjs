import sharp from 'sharp';

async function checkColors() {
  const { data, info } = await sharp('public/assets/karakter/karakter_cewe.jpeg').raw().toBuffer({ resolveWithObject: true });
  // girl's blouse is around x=150, y=200 in the first sprite
  // let's scan a box around x=100-200, y=150-250
  for (let y = 180; y <= 210; y += 5) {
    const samples = [];
    for (let x = 140; x <= 160; x += 5) {
      const idx = (y * info.width + x) * 3;
      samples.push(`(${data[idx]},${data[idx+1]},${data[idx+2]})`);
    }
    console.log(`y=${y}: ${samples.join(' ')}`);
  }
}
checkColors();
