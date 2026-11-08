import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function inspectBench() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Let's crop both left and right as individual images and save them to examine!
  // Left: x = 0..233, y = 0..220
  // Right: x = 234..455, y = 0..220
  
  await sharp(srcPath)
    .extract({ left: 10, top: 10, width: 224, height: 200 })
    .png()
    .toFile('public/assets/sprites/test_ara_left.png');

  await sharp(srcPath)
    .extract({ left: 245, top: 10, width: 195, height: 200 })
    .png()
    .toFile('public/assets/sprites/test_ara_right.png');

  console.log('Saved test_ara_left.png and test_ara_right.png');
}

inspectBench();
