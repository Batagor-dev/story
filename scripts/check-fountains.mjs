import sharp from 'sharp';

async function checkFountains() {
  const f1 = await sharp('public/assets/sprites/fountain_1.png').metadata();
  const f2 = await sharp('public/assets/sprites/fountain_2.png').metadata();
  console.log('f1:', f1);
  console.log('f2:', f2);
}

checkFountains();
