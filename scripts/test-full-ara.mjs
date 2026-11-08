import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function testFullAraTransfer() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // In Frame 1:
  // minX = 15, maxX = 232, minY = 16, maxY = 208
  // w = 218, h = 193
  const f1CropX = 15;
  const f1CropY = 16;
  const w = 218;
  const h = 193;

  // Let's create:
  // ara_seated_1.png: Frame 1 as-is (eyes open)
  // ara_seated_2_raw.png: Frame 2 as-is (cropped to its own bounds: minX=260, minY=16, w=169, h=191)
  
  await sharp(srcPath)
    .extract({ left: 15, top: 16, width: 218, height: 193 })
    .png()
    .toFile('public/assets/sprites/ara_seated_1.png');
  console.log('Saved ara_seated_1.png');

  await sharp(srcPath)
    .extract({ left: 260, top: 16, width: 169, height: 193 })
    .png()
    .toFile('public/assets/sprites/ara_seated_2_raw.png');
  console.log('Saved ara_seated_2_raw.png');

  // Now, what if we also create:
  // ara_seated_2_wide.png: where the bench is the wide bench from Frame 1, but Ara is from Frame 2!
  // Let's see: in Frame 2, what part of the bench is visible?
  // In Frame 2, the right armrest is at x=395..428.
  // In Frame 1, the right armrest is at x=195..232.
  // And the empty bench seat is at x=135..200.
  // Let's create a composite of Frame 2 Ara + Frame 1 wide bench!
}

testFullAraTransfer();
