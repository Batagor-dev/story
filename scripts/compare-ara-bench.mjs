import sharp from 'sharp';

async function compareSprites() {
  const left = await sharp('public/assets/sprites/test_ara_left.png').raw().toBuffer({ resolveWithObject: true });
  const right = await sharp('public/assets/sprites/test_ara_right.png').raw().toBuffer({ resolveWithObject: true });

  console.log('Left sprite w=', left.info.width, 'h=', left.info.height);
  console.log('Right sprite w=', right.info.width, 'h=', right.info.height);

  // In test_ara_left:
  // The girl's head is around x = 85 - 10 = 75
  // In test_ara_right:
  // The girl's head is around x = 343 - 245 = 98

  // Let's compare the girl's face / head pixels between left and right!
  // In Left: girl center ~75
  // In Right: girl center ~98
  // Let's check diff for a 50x50 block around the girl's face:
  // Head is at y=17 - 10 = 7, face is around y=15..45
  console.log('Comparing face block...');
  let diffCount = 0;
  for (let dy = 0; dy < 60; dy++) {
    for (let dx = -25; dx < 25; dx++) {
      const lx = 75 + dx;
      const rx = 98 + dx;
      const ly = 7 + dy;
      const ry = 7 + dy;
      
      const lIdx = (ly * left.info.width + lx) * 4;
      const rIdx = (ry * right.info.width + rx) * 4;
      
      const lr = left.data[lIdx], lg = left.data[lIdx+1], lb = left.data[lIdx+2], la = left.data[lIdx+3];
      const rr = right.data[rIdx], rg = right.data[rIdx+1], rb = right.data[rIdx+2], ra = right.data[rIdx+3];
      
      if (Math.abs(lr - rr) > 20 || Math.abs(lg - rg) > 20 || Math.abs(lb - rb) > 20) {
        diffCount++;
      }
    }
  }
  console.log(`Difference in girl's face/body block: ${diffCount} pixels`);

  // Now let's compare the bench:
  // Why is the bench in Left wider?
  // Let's look at the right armrest of the bench:
  // In test_ara_left, where is the right armrest?
  // Let's find rightmost pixels of left bench:
  let leftMaxX = 0;
  for (let y = 50; y < 180; y++) {
    for (let x = left.info.width - 1; x >= 0; x--) {
      if (left.data[(y * left.info.width + x) * 4 + 3] > 100) {
        if (x > leftMaxX) leftMaxX = x;
        break;
      }
    }
  }
  console.log(`Left bench rightmost pixel: x=${leftMaxX} (relative to girl: ${leftMaxX - 75}px)`);

  let rightMaxX = 0;
  for (let y = 50; y < 180; y++) {
    for (let x = right.info.width - 1; x >= 0; x--) {
      if (right.data[(y * right.info.width + x) * 4 + 3] > 100) {
        if (x > rightMaxX) rightMaxX = x;
        break;
      }
    }
  }
  console.log(`Right bench rightmost pixel: x=${rightMaxX} (relative to girl: ${rightMaxX - 98}px)`);
}

compareSprites();
