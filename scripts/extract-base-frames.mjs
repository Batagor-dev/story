import sharp from 'sharp';

async function extractBaseFrames() {
  const p1 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794101917766_b22a486f.png';
  const p2 = 'C:/Users/LENOVO/.gemini/antigravity/brain/d2cf962e-2a97-4152-94ac-3037c9cae3ca/.user_uploaded/media_1794102005307_0171ded7.png';

  // Arel frames:
  // F1: [36..113] (w=78, y: 48..256)
  // F2: [220..319] (w=100, y: 49..257)
  // F3: [388..537] (w=150, y: 49..254)
  // F4: [585..751] (w=167, y: 53..254)
  // F5: [805..901] (w=97, y: 51..258)
  const arelBoxes = [
    { left: 36, top: 46, width: 78, height: 212 },
    { left: 220, top: 46, width: 100, height: 212 },
    { left: 388, top: 46, width: 150, height: 212 },
    { left: 585, top: 46, width: 167, height: 212 },
    { left: 805, top: 46, width: 97, height: 212 },
  ];

  for (let i = 0; i < arelBoxes.length; i++) {
    const box = arelBoxes[i];
    await sharp(p1)
      .extract(box)
      .png()
      .toFile(`public/assets/sprites/test_arel_f${i+1}.png`);
    console.log(`Saved test_arel_f${i+1}.png: ${box.width}x${box.height}`);
  }

  // Ara frames:
  // F1: [31..122] (w=92, y: 7..180)
  // F2: [204..299] (w=96, y: 7..180)
  // F3: [410..492] (w=83, y: 7..180)
  // F4: [574..646] (w=73, y: 7..180)
  const araBoxes = [
    { left: 31, top: 5, width: 92, height: 176 },
    { left: 204, top: 5, width: 96, height: 176 },
    { left: 410, top: 5, width: 83, height: 176 },
    { left: 574, top: 5, width: 73, height: 176 },
  ];

  for (let i = 0; i < araBoxes.length; i++) {
    const box = araBoxes[i];
    await sharp(p2)
      .extract(box)
      .png()
      .toFile(`public/assets/sprites/test_ara_f${i+1}.png`);
    console.log(`Saved test_ara_f${i+1}.png: ${box.width}x${box.height}`);
  }
}

extractBaseFrames();
