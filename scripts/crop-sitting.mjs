import sharp from 'sharp';

async function crop(src, dest, x, y, w, h) {
  await sharp(src)
    .extract({ left: x, top: y, width: w, height: h })
    .png()
    .toFile(dest);
}

crop('public/assets/clean/karakter_cewe.png', 'public/assets/sprites/cewe_sitting.png', 2438, 1140, 238, 344)
  .then(() => console.log('Cropped cewe_sitting!'));
