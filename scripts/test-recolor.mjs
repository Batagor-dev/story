import sharp from 'sharp';

async function testRecolor() {
  const { data, info } = await sharp('public/assets/sprites/test_arel_f2.png').raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;

  // Let's test recoloring pink paper to kraft in F2
  // Bouquet in F2 is in x = 40..95, y = 70..155
  const kraftOut = Buffer.from(data);
  const whiteOut = Buffer.from(data);

  for (let y = 70; y <= 150; y++) {
    for (let x = 40; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];

      // Pink wrapping paper detection:
      // In F2: pink has high r, moderate g, moderate b, r > g + 50, r > b + 40
      if (a > 100 && r > 170 && g < 150 && b > 90 && (r - g) > 60 && (r - b) > 50) {
        // Luminance/brightness factor: 0.0 to 1.0
        const brightness = (r + g + b) / (255 * 3);

        // Kraft paper mapping:
        // bright -> [225, 190, 155]
        // mid -> [175, 125, 75]
        // dark -> [120, 75, 35]
        const kr = Math.round(70 + brightness * 170);
        const kg = Math.round(40 + brightness * 160);
        const kb = Math.round(20 + brightness * 140);
        kraftOut[idx] = kr;
        kraftOut[idx+1] = kg;
        kraftOut[idx+2] = kb;

        // White paper mapping:
        // bright -> [255, 255, 255]
        // mid -> [215, 225, 235]
        // dark -> [150, 165, 180]
        const wr = Math.round(110 + brightness * 145);
        const wg = Math.round(120 + brightness * 135);
        const wb = Math.round(135 + brightness * 120);
        whiteOut[idx] = wr;
        whiteOut[idx+1] = wg;
        whiteOut[idx+2] = wb;
      }
    }
  }

  await sharp(kraftOut, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/test_arel_f2_kraft.png');

  await sharp(whiteOut, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile('public/assets/sprites/test_arel_f2_white.png');

  console.log('Saved test_arel_f2_kraft.png and test_arel_f2_white.png');
}

testRecolor();
