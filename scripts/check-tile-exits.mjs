import sharp from 'sharp';

async function checkExits() {
  for (const name of ['test_tile_1.png', 'test_tile_3.png']) {
    const { data, info } = await sharp(`public/assets/sprites/${name}`).raw().toBuffer({ resolveWithObject: true });
    console.log(`\n=== ${name} (${info.width}x${info.height}) ===`);

    // Check top, bottom, left, right edge dirt presence
    function isDirt(r, g, b, a) {
      if (a < 50) return false;
      // Dirt is warm brown: R > G, R > B, R > 150
      return r > 140 && g > 110 && b < 130 && r > g;
    }

    let topDirt = 0, bottomDirt = 0, leftDirt = 0, rightDirt = 0;
    for (let x = 0; x < info.width; x++) {
      const tIdx = (0 * info.width + x) * 4;
      const bIdx = ((info.height - 1) * info.width + x) * 4;
      if (isDirt(data[tIdx], data[tIdx+1], data[tIdx+2], data[tIdx+3])) topDirt++;
      if (isDirt(data[bIdx], data[bIdx+1], data[bIdx+2], data[bIdx+3])) bottomDirt++;
    }
    for (let y = 0; y < info.height; y++) {
      const lIdx = (y * info.width + 0) * 4;
      const rIdx = (y * info.width + (info.width - 1)) * 4;
      if (isDirt(data[lIdx], data[lIdx+1], data[lIdx+2], data[lIdx+3])) leftDirt++;
      if (isDirt(data[rIdx], data[rIdx+1], data[rIdx+2], data[rIdx+3])) rightDirt++;
    }

    console.log(`Top dirt width: ${topDirt}`);
    console.log(`Bottom dirt width: ${bottomDirt}`);
    console.log(`Left dirt height: ${leftDirt}`);
    console.log(`Right dirt height: ${rightDirt}`);
  }
}

checkExits();
