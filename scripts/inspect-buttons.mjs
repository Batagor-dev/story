import sharp from 'sharp';

async function cropButtons() {
  const meta = await sharp('public/assets/clean/button.png').metadata();
  console.log('Button dimension:', meta.width, meta.height);
}
cropButtons();
