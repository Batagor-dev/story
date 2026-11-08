import sharp from 'sharp';

async function cropAwkward() {
  await sharp('public/assets/clean/karakter_cewe.png')
    .extract({ left: 86, top: 934, width: 172, height: 544 })
    .png()
    .toFile('public/assets/sprites/cewe_awkward_reject.png');
  console.log('Cropped cewe_awkward_reject!');
}
cropAwkward();
