import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function extractAraAlone() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // In Frame 1:
  // Ara is located horizontally between x = 50 and x = 125.
  // Vertically between y = 16 and y = 208.
  // Let's inspect the boundaries of Ara alone in Frame 1:
  // Head: x ≈ 60..105, y ≈ 16..65
  // Blouse & Scarf: x ≈ 60..105, y ≈ 65..95
  // Book & hands: x ≈ 80..120, y ≈ 75..110
  // Skirt: x ≈ 65..120, y ≈ 95..180
  // Shoes/Legs: x ≈ 80..125, y ≈ 180..208
  
  // Notice that the bench planks are brown:
  // Planks: horizontal stripes of RGB(170,120,80), RGB(120,80,50), etc.
  // Iron armrests: dark black/grey RGB(30..70, 30..70, 30..70)
  
  console.log('Ara alone bounding box: x in [55..125], y in [16..208], width ~ 70, height ~ 192');
}

extractAraAlone();
