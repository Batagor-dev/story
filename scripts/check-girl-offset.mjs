import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function checkGirl() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Top of head for left figure:
  // minY is 16. Let's find topmost pixel of girl's hair in Left figure:
  let leftTopX = -1, leftTopY = -1;
  for (let y = 0; y < 100; y++) {
    for (let x = 15; x < 233; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 100) {
        leftTopX = x; leftTopY = y; break;
      }
    }
    if (leftTopY !== -1) break;
  }

  // Top of head for right figure:
  let rightTopX = -1, rightTopY = -1;
  for (let y = 0; y < 100; y++) {
    for (let x = 240; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 100) {
        rightTopX = x; rightTopY = y; break;
      }
    }
    if (rightTopY !== -1) break;
  }

  console.log(`Left girl top of hair: x=${leftTopX}, y=${leftTopY}`);
  console.log(`Right girl top of hair: x=${rightTopX}, y=${rightTopY}`);

  // Now let's compare left bench left armrest vs right bench left armrest:
  let leftBenchArmX = -1;
  for (let x = 15; x < 60; x++) {
    for (let y = 80; y < 120; y++) {
      if (data[(y * info.width + x) * 4 + 3] > 100) {
        if (leftBenchArmX === -1) leftBenchArmX = x;
      }
    }
  }

  let rightBenchArmX = -1;
  for (let x = 250; x < 300; x++) {
    for (let y = 80; y < 120; y++) {
      if (data[(y * info.width + x) * 4 + 3] > 100) {
        if (rightBenchArmX === -1) rightBenchArmX = x;
      }
    }
  }

  console.log(`Left bench left armrest minX: ${leftBenchArmX}`);
  console.log(`Right bench left armrest minX: ${rightBenchArmX}`);
  console.log(`Offset between left bench and right bench left edge: ${rightBenchArmX - leftBenchArmX}`);
  console.log(`Offset between left girl top and right girl top: ${rightTopX - leftTopX}`);
}

checkGirl();
