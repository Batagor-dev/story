import sharp from 'sharp';

async function cleanButtonAndBubble() {
  const cleanImage = async (input, output, isBg) => {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let head = 0, tail = 0;

    function push(x, y) {
      const idx = y * width + x;
      if (visited[idx] === 0) {
        visited[idx] = 1;
        queue[tail++] = idx;
      }
    }

    for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1); }
    for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y); }

    while (head < tail) {
      const idx = queue[head++];
      const x = idx % width;
      const y = Math.floor(idx / width);
      const pIdx = idx * 4;

      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];

      if (isBg(x, y, r, g, b)) {
        data[pIdx + 3] = 0;
        if (x > 0 && visited[idx - 1] === 0) push(x - 1, y);
        if (x < width - 1 && visited[idx + 1] === 0) push(x + 1, y);
        if (y > 0 && visited[idx - width] === 0) push(x, y - 1);
        if (y < height - 1 && visited[idx + width] === 0) push(x, y + 1);
      }
    }

    await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(output);
    console.log(`Saved: ${output}`);
  };

  await cleanImage('public/assets/componet/button.jpeg', 'public/assets/clean/button.png', (x, y, r, g, b) => {
    const diff = Math.max(r, g, b) - Math.min(r, g, b);
    const avg = (r + g + b) / 3;
    return diff <= 15 && avg >= 135 && avg <= 220;
  });

  await cleanImage('public/assets/componet/bulble_chat.jpeg', 'public/assets/clean/bulble_chat.png', (x, y, r, g, b) => {
    const diff = Math.max(r, g, b) - Math.min(r, g, b);
    const avg = (r + g + b) / 3;
    return diff <= 15 && avg >= 95 && avg <= 195;
  });
}

cleanButtonAndBubble();
