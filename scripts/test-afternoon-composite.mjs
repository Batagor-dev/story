import sharp from 'sharp';

async function testAfternoonComposite() {
  // 1200 x 600 canvas
  const canvasW = 1200;
  const canvasH = 600;

  // Let's create a background
  // Sunset sky top, grass bottom
  const bg = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 92, g: 154, b: 64, alpha: 1 } // grass green
    }
  }).png().toBuffer();

  // Bench at left = 690, bottom = 22% (top = 600 - 132 - 119 = 349)
  const benchW = 180;
  const benchH = Math.round(180 * (144 / 218)); // 119

  const benchResized = await sharp('public/assets/sprites/pixel_bench.png')
    .resize(benchW, benchH, { kernel: 'nearest' })
    .toBuffer();

  // Ara standing at left = 728, bottom = 21% (top = 600 - 126 - 144 = 330)
  const araW = 72;
  const araH = 144;
  const araResized = await sharp('public/assets/sprites/cewe_idle_1.png')
    .resize(araW, araH, { kernel: 'nearest' })
    .toBuffer();

  // Arel at left = 550, bottom = 22% (top = 600 - 132 - 160 = 308)
  const arelW = 80;
  const arelH = 160;
  const arelResized = await sharp('public/assets/sprites/cowo_idle_1.png')
    .resize(arelW, arelH, { kernel: 'nearest' })
    .toBuffer();

  const composite = await sharp(bg)
    .composite([
      {
        input: benchResized,
        left: 690,
        top: 349
      },
      {
        input: araResized,
        left: 728,
        top: 330
      },
      {
        input: arelResized,
        left: 550,
        top: 308
      }
    ])
    .png()
    .toFile('public/assets/sprites/test_afternoon_scene_bench.png');

  console.log('Saved test_afternoon_scene_bench.png');
}

testAfternoonComposite();
