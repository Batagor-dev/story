import sharp from 'sharp';

async function checkBodyDiff() {
  const left = await sharp('public/assets/sprites/test_ara_left.png').raw().toBuffer({ resolveWithObject: true });
  const right = await sharp('public/assets/sprites/test_ara_right.png').raw().toBuffer({ resolveWithObject: true });

  // Girl center in left: 75, girl center in right: 98
  // Let's compare parts:
  // 1. Hair and head (y: 5..45, dx: -25..25)
  // 2. Torso and blouse (y: 45..85, dx: -25..25)
  // 3. Hands and book (y: 60..100, dx: -25..25)
  // 4. Skirt and legs (y: 95..180, dx: -25..25)

  function diffRegion(name, minY, maxY, minDx, maxDx) {
    let diffs = 0, total = 0;
    for (let y = minY; y <= maxY; y++) {
      for (let dx = minDx; dx <= maxDx; dx++) {
        total++;
        const lx = 75 + dx;
        const rx = 98 + dx;
        const lIdx = (y * left.info.width + lx) * 4;
        const rIdx = (y * right.info.width + rx) * 4;

        const la = left.data[lIdx+3], ra = right.data[rIdx+3];
        if (la > 50 || ra > 50) {
          const dr = Math.abs(left.data[lIdx] - right.data[rIdx]);
          const dg = Math.abs(left.data[lIdx+1] - right.data[rIdx+1]);
          const db = Math.abs(left.data[lIdx+2] - right.data[rIdx+2]);
          if (dr > 15 || dg > 15 || db > 15) diffs++;
        }
      }
    }
    console.log(`${name}: ${diffs} differing pixels out of ${total}`);
  }

  diffRegion('Face/Eyes (y: 15..45)', 15, 45, -15, 15);
  diffRegion('Torso/Blouse (y: 46..75)', 46, 75, -20, 20);
  diffRegion('Book/Hands (y: 70..100)', 70, 100, -20, 20);
  diffRegion('Skirt/Legs (y: 101..180)', 101, 180, -25, 25);
}

checkBodyDiff();
