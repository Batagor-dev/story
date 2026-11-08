import sharp from 'sharp';

const tilesetPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074302907_375c7ec2.png';

async function examineTile1() {
  await sharp(tilesetPath)
    .extract({ left: 28, top: 28, width: 101, height: 101 })
    .png()
    .toFile('public/assets/sprites/test_tile_1.png');

  await sharp(tilesetPath)
    .extract({ left: 328, top: 28, width: 101, height: 101 })
    .png()
    .toFile('public/assets/sprites/test_tile_3.png');

  console.log('Saved test_tile_1.png and test_tile_3.png');
}

examineTile1();
