import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function examineBoth() {
  const meta = await sharp(srcPath).metadata();
  console.log('Total size:', meta.width, 'x', meta.height);

  // Left bench:
  // minX = 15, maxX = 232, minY = 16, maxY = 208
  // w = 218, h = 193
  
  // Right bench:
  // minX = 260, maxX = 428, minY = 16, maxY = 206
  // w = 169, h = 191

  // Let's check the distance between left armrest and right armrest in BOTH:
  // Left bench armrests:
  // Left armrest is at x=15..55
  // Right armrest is at x=195..232
  // Distance between armrests = 232 - 15 = 217 px.
  // Ara's feet in left bench: where are they?
}

examineBoth();
