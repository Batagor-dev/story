import fs from 'fs';

let content = fs.readFileSync('bunga-untuk-perkenalan.html', 'utf8');

// Replace transition overlay
const oldTransition = `        const root = document.getElementById('scene-root');
        root.innerHTML = \`
          <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, #2e1065, #ea580c); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <div class="font-pixel" style="font-size: 28px; color: #fef08a; letter-spacing: 4px; margin-bottom: 12px;">SORE HARI</div>
            <div class="font-retro" style="font-size: 26px; color: #fdf2f8;">Langit berganti jingga... Arel kembali ke taman.</div>
          </div>
        \`;`;

const newTransition = `        const root = document.getElementById('scene-root');
        root.innerHTML = \`
          <div style="position: absolute; inset: 0; background: #180d19; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <img src="/assets/sprites/sunset_sky.png" class="pixelated" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.8;" />
            <div style="position: relative; z-index: 2; background: rgba(24, 25, 32, 0.9); border: 4px solid #f59e0b; padding: 24px 36px; box-shadow: 0 0 50px rgba(245, 158, 11, 0.5);">
              <div class="font-pixel" style="font-size: 26px; color: #fef08a; letter-spacing: 4px; margin-bottom: 10px;">🌅 SORE HARI</div>
              <div class="font-retro" style="font-size: 24px; color: #fdf2f8;">Langit berganti jingga keemasan... Arel kembali ke taman.</div>
            </div>
          </div>
        \`;`;

content = content.replace(oldTransition, newTransition);

// Replace Babak 5 sky with sunset_sky.png
const oldBabak5Sky = `        <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, #2e1065 0%, #831843 45%, #ea580c 100%); overflow: hidden;">
          <!-- Pixel Sunset Sun -->
          <div style="position: absolute; bottom: 40%; left: 50%; transform: translateX(-50%); width: 180px; height: 180px; border-radius: 50%; background: #fef08a; box-shadow: 0 0 80px #f59e0b;"></div>`;

const newBabak5Sky = `        <div style="position: absolute; inset: 0; background: #180d19; overflow: hidden;">
          <!-- User's Pixel Sunset Sky with Billowing Clouds -->
          <div style="position: absolute; inset-x: 0; top: 0; height: 62%; overflow: hidden; pointer-events: none;">
            <img src="/assets/sprites/sunset_sky.png" class="pixelated" style="width: 100%; height: 100%; object-fit: cover; object-position: bottom;" />
            <div style="position: absolute; inset-x: 0; bottom: 0; height: 60px; background: linear-gradient(to top, rgba(194, 65, 12, 0.4), transparent);"></div>
          </div>`;

content = content.replace(oldBabak5Sky, newBabak5Sky);

// Update bench and Ara alignment in Babak 5
content = content.replace(
  `          <div style="position: absolute; bottom: 22%; left: 620px; width: 180px; height: 120px; pointer-events: none;">
            <img src="/assets/sprites/pixel_bench.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
          </div>`,
  `          <div style="position: absolute; bottom: 22%; left: 640px; width: 176px; height: 88px; pointer-events: none; filter: drop-shadow(0 6px 8px rgba(0,0,0,0.5));">
            <img src="/assets/sprites/pixel_bench.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
          </div>`
);

content = content.replace(
  `<div id="ara-char" style="position: absolute; bottom: 20%; left: 650px; width: 85px; height: 170px;">`,
  `<div id="ara-char" style="position: absolute; bottom: 20%; left: 685px; width: 85px; height: 170px;">`
);

fs.writeFileSync('bunga-untuk-perkenalan.html', content);
fs.writeFileSync('public/bunga-untuk-perkenalan.html', content);

console.log('Successfully updated sunset clouds in HTML files!');
