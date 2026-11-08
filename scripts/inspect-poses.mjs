import sharp from 'sharp';

async function checkGirlPoses() {
  const meta = await sharp('public/assets/clean/karakter_cewe.png').metadata();
  console.log('cewe dimension:', meta.width, meta.height);
}

checkGirlPoses();
