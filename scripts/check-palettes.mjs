import sharp from 'sharp';

async function checkItemPalettes() {
  for (const item of ['item_paper_kraft.png', 'item_paper_pink.png', 'item_paper_white.png', 'item_ribbon_red.png', 'item_ribbon_yellow.png', 'item_ribbon_blue.png']) {
    const buf = await sharp(`public/assets/sprites/${item}`).raw().toBuffer();
    let colors = new Set();
    for (let i = 0; i < buf.length; i += 4) {
      if (buf[i+3] > 100) {
        colors.add(`${buf[i]},${buf[i+1]},${buf[i+2]}`);
      }
    }
    console.log(item, [...colors].slice(0, 5));
  }
}

checkItemPalettes();
