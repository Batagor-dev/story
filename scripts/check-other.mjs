import sharp from 'sharp';

async function checkOther(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const pA = 0;
  const pB = 46 * 4; // or 46 * 3
  console.log(`${file}: 0,0=[${data[0]},${data[1]},${data[2]}], 46,0=[${data[46*3]},${data[46*3+1]},${data[46*3+2]}]`);
}

async function run() {
  await checkOther('public/assets/componet/bulble_chat.jpeg');
  await checkOther('public/assets/componet/button.jpeg');
}
run();
