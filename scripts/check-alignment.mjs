import sharp from 'sharp';

const srcPath = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794074867787_ed610199.png';

async function checkAlignment() {
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });

  // Frame 1: left armrest x ≈ 15
  // Frame 2: left armrest x ≈ 261
  // Offset between armrests = 261 - 15 = 246

  // In Frame 1:
  // Left armrest curl:
  // Let's find the exact pixel of the leftmost curl of the armrest in Frame 1 and Frame 2:
  function findCurl(minX, maxX) {
    for (let x = minX; x < maxX; x++) {
      for (let y = 120; y < 145; y++) {
        const idx = (y * info.width + x) * 4;
        if (data[idx + 3] > 200) {
          return { x, y };
        }
      }
    }
  }

  const curl1 = findCurl(10, 40);
  const curl2 = findCurl(250, 280);
  console.log('Frame 1 armrest curl:', curl1);
  console.log('Frame 2 armrest curl:', curl2);
  const dx = curl2.x - curl1.x;
  const dy = curl2.y - curl1.y;
  console.log(`Delta between frame 1 and frame 2: dx=${dx}, dy=${dy}`);

  // Now, what about the bench backrest and Ara's head?
  // Let's check Ara's head in Frame 1 vs Frame 2 shifted by dx:
  console.log('Checking Ara head top:');
  // In Frame 1, Ara head is at (85, 17).
  // If shifted by dx=246, it would be at (85 + 246 = 331).
  // But earlier we saw Right girl top of hair was at x=343!
  // Why is it at 343 instead of 331? 343 - 331 = 12px!
  // That means in Frame 2, Ara is sitting 12 pixels more to the right!
}

checkAlignment();
