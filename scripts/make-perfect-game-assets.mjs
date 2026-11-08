import sharp from 'sharp';
import fs from 'fs';

async function main() {
  console.log('Generating perfect game assets...');

  // 1. Fix cowo_bust_scratch.png: remove trapped white hole between arm and head
  {
    const scratchPath = 'public/assets/sprites/cowo_bust_scratch.png';
    const img = sharp(scratchPath);
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

    // Flood fill from (60, 120) for connected pixels with r>190, g>190, b>190
    const w = info.width;
    const h = info.height;
    const visited = new Uint8Array(w * h);
    const queue = [[60, 120]];
    visited[120 * w + 60] = 1;

    let cleared = 0;
    while (queue.length > 0) {
      const [cx, cy] = queue.pop();
      const idx = (cy * w + cx) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];

      // If background color
      if (r > 195 && g > 195 && b > 195 && a > 30) {
        data[idx + 3] = 0; // set transparent!
        cleared++;

        // 4-way neighbors
        const neighbors = [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ];

        for (const [nx, ny] of neighbors) {
          if (nx >= 35 && nx <= 85 && ny >= 85 && ny <= 160) {
            const nPos = ny * w + nx;
            if (!visited[nPos]) {
              visited[nPos] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Also clean any isolated light background pixels outside character at borders
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // x < 25 or x > 210 or y > 220
        if (x < 25 || x > 210 || y > 220) {
          const idx = (y * w + x) * 4;
          if (data[idx] > 200 && data[idx + 1] > 200 && data[idx + 2] > 200) {
            data[idx + 3] = 0;
          }
        }
      }
    }

    await sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .png()
      .toFile(scratchPath);

    console.log(`Cleaned cowo_bust_scratch.png! Removed ${cleared} trapped background pixels.`);
  }

  // 2. Generate high-quality pixel Pond: pixel_pond.png (280 x 180)
  {
    const width = 280;
    const height = 180;
    const pondData = new Uint8Array(width * height * 4);

    // Color palette
    const colors = {
      grassBorder: [0x3e, 0x83, 0x24, 255],
      rockDark: [0x3c, 0x38, 0x36, 255],
      rockMid: [0x50, 0x49, 0x45, 255],
      rockLight: [0x7c, 0x6f, 0x64, 255],
      rockHighlight: [0xa8, 0x99, 0x84, 255],
      waterDeep: [0x03, 0x69, 0xa1, 255],
      waterMid: [0x02, 0x84, 0xc7, 255],
      waterShallow: [0x38, 0xbd, 0xf8, 255],
      waterHighlight: [0xba, 0xe6, 0xfd, 255],
      waterShine: [0xff, 0xff, 0xff, 220],
      lilyDark: [0x15, 0x80, 0x3d, 255],
      lilyMid: [0x22, 0xc5, 0x5e, 255],
      lilyLight: [0x86, 0xef, 0xac, 255],
      flowerPink: [0xf4, 0x72, 0xb6, 255],
      flowerYellow: [0xfd, 0xe0, 0x47, 255],
    };

    function setPixel(x, y, [r, g, b, a]) {
      if (x < 0 || x >= width || y < 0 || y >= height) return;
      const idx = (y * width + x) * 4;
      pondData[idx] = r;
      pondData[idx + 1] = g;
      pondData[idx + 2] = b;
      pondData[idx + 3] = a;
    }

    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.44;
    const ry = height * 0.42;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Natural irregular elliptical pond shape with slight sine wobbles
        const angle = Math.atan2((y - cy) / ry, (x - cx) / rx);
        const wobble = 1.0 + 0.05 * Math.sin(angle * 5) + 0.03 * Math.cos(angle * 7);
        const dx = (x - cx) / (rx * wobble);
        const dy = (y - cy) / (ry * wobble);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1.15) {
          // Transparent outside
          continue;
        }

        // Stony bank ring (dist between 0.92 and 1.15)
        if (dist >= 0.92) {
          // Cobblestone rock pattern around rim
          const rockIdx = Math.floor((angle + Math.PI) * 4) + Math.floor(dist * 10);
          const rockSeed = (Math.sin(rockIdx * 37) * 1000) % 1;
          if (dist > 1.08) {
            setPixel(x, y, colors.rockDark);
          } else if (dist > 1.0) {
            setPixel(x, y, rockSeed > 0.5 ? colors.rockMid : colors.rockLight);
          } else {
            // Inner rim shadow
            setPixel(x, y, rockSeed > 0.4 ? colors.rockLight : colors.rockHighlight);
          }
        } else {
          // Water interior
          // Water depth gradient
          const depth = 1 - dist / 0.92;
          let waterCol;
          if (depth > 0.6) {
            waterCol = colors.waterDeep;
          } else if (depth > 0.3) {
            waterCol = colors.waterMid;
          } else {
            waterCol = colors.waterShallow;
          }

          // Gentle specular wave ripples in pixel steps
          const ripple = Math.sin((x + y * 0.5) * 0.3) + Math.sin(x * 0.2);
          if (ripple > 1.5 && depth > 0.2 && depth < 0.8) {
            waterCol = colors.waterHighlight;
          }
          if (ripple > 1.85 && depth > 0.3 && depth < 0.7) {
            waterCol = colors.waterShine;
          }

          setPixel(x, y, waterCol);
        }
      }
    }

    // Helper to draw a pixel lily pad
    function drawLilyPad(lx, ly, radius) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= radius) {
            // Cut notch
            if (dx > 0 && Math.abs(dy) < 2) continue;
            let col = colors.lilyMid;
            if (d > radius - 1.5) col = colors.lilyDark;
            else if (dy < 0 && dx < 0) col = colors.lilyLight;
            setPixel(lx + dx, ly + dy, col);
          }
        }
      }
      // Little flower blossom in the center
      setPixel(lx, ly, colors.flowerYellow);
      setPixel(lx - 1, ly, colors.flowerPink);
      setPixel(lx + 1, ly, colors.flowerPink);
      setPixel(lx, ly - 1, colors.flowerPink);
      setPixel(lx, ly + 1, colors.flowerPink);
    }

    drawLilyPad(Math.floor(cx - 50), Math.floor(cy - 20), 10);
    drawLilyPad(Math.floor(cx + 45), Math.floor(cy + 15), 12);
    drawLilyPad(Math.floor(cx - 10), Math.floor(cy + 30), 8);
    drawLilyPad(Math.floor(cx + 60), Math.floor(cy - 25), 9);

    await sharp(pondData, { raw: { width, height, channels: 4 } })
      .png()
      .toFile('public/assets/sprites/pixel_pond.png');

    console.log('Created pixel_pond.png (280x180)');
  }

  // 3. Generate refined pixel Bench: pixel_bench.png (160 x 80)
  // Tailored to Ara's seated sprite (height 344 scaled to ~96px, legs ~35px)
  {
    const bw = 160;
    const bh = 80;
    const benchData = new Uint8Array(bw * bh * 4);

    const c = {
      woodDark: [0x78, 0x35, 0x0f, 255],     // warm shadow
      woodMid: [0xb4, 0x53, 0x09, 255],      // rich teak
      woodLight: [0xd9, 0x77, 0x06, 255],    // top plank
      woodHighlight: [0xf5, 0x9e, 0x0b, 255],// plank rim
      ironDark: [0x18, 0x18, 0x1b, 255],     // wrought iron
      ironMid: [0x3f, 0x3f, 0x46, 255],      // iron highlight
      ironBolt: [0x71, 0x71, 0x7a, 255],
    };

    function setB(x, y, [r, g, b, a]) {
      if (x < 0 || x >= bw || y < 0 || y >= bh) return;
      const idx = (y * bw + x) * 4;
      benchData[idx] = r;
      benchData[idx + 1] = g;
      benchData[idx + 2] = b;
      benchData[idx + 3] = a;
    }

    function fillRect(x0, y0, w, h, col) {
      for (let y = y0; y < y0 + h; y++) {
        for (let x = x0; x < x0 + w; x++) {
          setB(x, y, col);
        }
      }
    }

    // Backrest Planks (Y: 10 to 36)
    // Slat 1
    fillRect(14, 10, 132, 7, c.woodMid);
    fillRect(14, 10, 132, 2, c.woodHighlight);
    fillRect(14, 15, 132, 2, c.woodDark);

    // Slat 2
    fillRect(14, 20, 132, 7, c.woodMid);
    fillRect(14, 20, 132, 2, c.woodHighlight);
    fillRect(14, 25, 132, 2, c.woodDark);

    // Slat 3 (Lower backrest)
    fillRect(14, 30, 132, 7, c.woodMid);
    fillRect(14, 30, 132, 2, c.woodHighlight);
    fillRect(14, 35, 132, 2, c.woodDark);

    // Bench Seat (Y: 40 to 52) - horizontal perspective slab
    fillRect(10, 40, 140, 12, c.woodMid);
    fillRect(10, 40, 140, 3, c.woodHighlight);
    fillRect(10, 49, 140, 3, c.woodDark);

    // Cast iron frame / legs (Left: x=20..26, Right: x=134..140)
    for (const legX of [22, 134]) {
      // Back vertical support
      fillRect(legX, 8, 6, 32, c.ironDark);
      fillRect(legX + 1, 8, 2, 32, c.ironMid);

      // Armrest curve
      fillRect(legX - 4, 32, 14, 6, c.ironDark);
      fillRect(legX - 3, 33, 12, 2, c.ironMid);

      // Front & back legs to ground (Y: 48 to 78)
      fillRect(legX - 2, 50, 6, 26, c.ironDark);
      fillRect(legX - 1, 50, 2, 26, c.ironMid);

      fillRect(legX + 4, 50, 6, 28, c.ironDark);
      fillRect(legX + 5, 50, 2, 28, c.ironMid);

      // Foot pad
      fillRect(legX - 4, 76, 16, 4, c.ironDark);

      // Decorative bolts
      setB(legX + 2, 13, c.ironBolt);
      setB(legX + 2, 23, c.ironBolt);
      setB(legX + 2, 43, c.ironBolt);
    }

    await sharp(benchData, { raw: { width: bw, height: bh, channels: 4 } })
      .png()
      .toFile('public/assets/sprites/pixel_bench.png');

    console.log('Created refined pixel_bench.png (160x80)');
  }

  // 4. Clean seamless Grass Tile (48x48) - Lush and natural without harsh dots
  {
    const tw = 48;
    const th = 48;
    const grassData = new Uint8Array(tw * th * 4);

    const gc = {
      base: [0x48, 0x9b, 0x30, 255],     // Vibrant park green
      dark: [0x3c, 0x85, 0x27, 255],     // Soft shadow blade
      light: [0x56, 0xb0, 0x3b, 255],    // Sunlight blade
      highlight: [0x64, 0xc4, 0x47, 255],// Fresh tuft tip
    };

    // Fill base
    for (let i = 0; i < tw * th * 4; i += 4) {
      grassData[i] = gc.base[0];
      grassData[i + 1] = gc.base[1];
      grassData[i + 2] = gc.base[2];
      grassData[i + 3] = 255;
    }

    function setG(x, y, col) {
      const gx = (x + tw) % tw;
      const gy = (y + th) % th;
      const idx = (gy * tw + gx) * 4;
      grassData[idx] = col[0];
      grassData[idx + 1] = col[1];
      grassData[idx + 2] = col[2];
      grassData[idx + 3] = 255;
    }

    // Draw gentle natural grass tufts (clusters of blades)
    const tufts = [
      [10, 14],
      [34, 8],
      [22, 32],
      [42, 38],
      [6, 40],
    ];

    for (const [tx, ty] of tufts) {
      // Left blade
      setG(tx - 1, ty, gc.light);
      setG(tx - 2, ty - 1, gc.highlight);
      setG(tx - 2, ty - 2, gc.highlight);

      // Center blade
      setG(tx, ty, gc.dark);
      setG(tx, ty - 1, gc.light);
      setG(tx, ty - 2, gc.highlight);
      setG(tx, ty - 3, gc.highlight);

      // Right blade
      setG(tx + 1, ty, gc.light);
      setG(tx + 2, ty - 1, gc.highlight);
      setG(tx + 2, ty - 2, gc.highlight);

      // Base shadow
      setG(tx - 1, ty + 1, gc.dark);
      setG(tx, ty + 1, gc.dark);
      setG(tx + 1, ty + 1, gc.dark);
    }

    await sharp(grassData, { raw: { width: tw, height: th, channels: 4 } })
      .png()
      .toFile('public/assets/sprites/tile_grass.png');

    console.log('Created beautiful tile_grass.png (48x48)');
  }

  // 5. Cobblestone / Sandy Trail Tile (48x48)
  {
    const pw = 48;
    const ph = 48;
    const pathData = new Uint8Array(pw * ph * 4);

    const pc = {
      base: [0xd8, 0xc7, 0xa5, 255],     // Warm sand / stone
      dark: [0xb8, 0xa3, 0x81, 255],     // Stone mortar / edge
      light: [0xe6, 0xd7, 0xb8, 255],    // Sunlight stone top
      pebble: [0x9c, 0x86, 0x64, 255],
    };

    for (let i = 0; i < pw * ph * 4; i += 4) {
      pathData[i] = pc.base[0];
      pathData[i + 1] = pc.base[1];
      pathData[i + 2] = pc.base[2];
      pathData[i + 3] = 255;
    }

    function setP(x, y, col) {
      const px = (x + pw) % pw;
      const py = (y + ph) % ph;
      const idx = (py * pw + px) * 4;
      pathData[idx] = col[0];
      pathData[idx + 1] = col[1];
      pathData[idx + 2] = col[2];
      pathData[idx + 3] = 255;
    }

    // Draw cobblestone paving outlines
    for (let x = 0; x < pw; x++) {
      setP(x, 0, pc.dark);
      setP(x, 24, pc.dark);
    }
    for (let y = 0; y < 24; y++) {
      setP(0, y, pc.dark);
      setP(24, y, pc.dark);
    }
    for (let y = 24; y < 48; y++) {
      setP(12, y, pc.dark);
      setP(36, y, pc.dark);
    }

    // Stone highlights
    for (const [sx, sy, w, h] of [
      [2, 2, 20, 20],
      [26, 2, 20, 20],
      [14, 26, 20, 20],
      [38, 26, 8, 20],
      [2, 26, 8, 20],
    ]) {
      for (let i = 0; i < w; i++) {
        setP(sx + i, sy + 1, pc.light);
      }
    }

    await sharp(pathData, { raw: { width: pw, height: ph, channels: 4 } })
      .png()
      .toFile('public/assets/sprites/tile_path.png');

    console.log('Created beautiful tile_path.png (48x48)');
  }
}

main().catch(console.error);
