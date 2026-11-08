import fs from 'fs';

let content = fs.readFileSync('bunga-untuk-perkenalan.html', 'utf8');

// Update dialogue-portrait positioning in CSS/HTML
content = content.replace(
  'id="dialogue-portrait" style="position: absolute; right: 20px; bottom: 90px; z-index: 20; pointer-events: none;"',
  'id="dialogue-portrait" style="position: absolute; right: 28px; bottom: calc(100% - 10px); z-index: 20; pointer-events: none;"'
);

// Update dialogue portrait image dimensions
content = content.replace(
  'width: 130px; height: 150px; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.7));',
  'width: 150px; height: 170px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));'
);

// Update startBabak1 bench & Ara alignment
const oldBabak1Scene = `          <!-- Ara Sitting on Pixel Bench -->
          <div style="position: absolute; top: 140px; right: 160px; width: 180px; height: 120px;">
            <img src="/assets/sprites/pixel_bench.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
            <img src="/assets/sprites/cewe_sitting.png" class="pixelated" style="position: absolute; top: -60px; left: 40px; width: 75px; height: 130px; object-fit: contain;" />
            <div class="font-pixel" style="position: absolute; top: -85px; left: 24px; background: #181920; border: 2px solid #ec4899; color: #fbcfe8; font-size: 8px; padding: 2px 6px;">[ ARA MEMBACA ]</div>
          </div>`;

const newBabak1Scene = `          <!-- Dedicated Top Bar -->
          <div class="font-pixel" style="position: absolute; top: 0; inset-x: 0; height: 44px; background: #12141c; border-bottom: 2px solid #2e3440; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 40;">
            <div style="color: #f59e0b; font-size: 11px;">📖 BABAK 1: PAGI DI TAMAN</div>
            <div style="color: #94a3b8; font-size: 10px;">MISI: LIHAT ARA & DEKATI TAMAN</div>
          </div>

          <!-- Ara Sitting on Pixel Bench (Natural Alignment) -->
          <div style="position: absolute; top: 130px; right: 120px; width: 176px; height: 88px;">
            <img src="/assets/sprites/pixel_bench.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
            <img src="/assets/sprites/cewe_sitting.png" class="pixelated" style="position: absolute; top: -20px; left: 45px; width: 70px; height: 98px; object-fit: contain;" />
            <div class="font-pixel" style="position: absolute; top: -48px; left: 20px; background: #181920; border: 2px solid #ec4899; color: #fbcfe8; font-size: 9px; padding: 2px 8px; white-space: nowrap;">[ 🌸 ARA SEDANG MEMBACA ]</div>
          </div>`;

content = content.replace(oldBabak1Scene, newBabak1Scene);

// Update Babak 2 with Pure Pixel Pond and Inventory HUD Bar
const oldBabak2HTML = `    function startBabak2() {
      flowersPicked = 0;
      huntStart = Date.now();
      const root = document.getElementById('scene-root');
      root.innerHTML = \`
        <div style="position: absolute; inset: 0; background-image: url(/assets/sprites/tile_grass.png); background-size: 48px 48px; overflow: hidden;">
          <div class="font-pixel" style="position: absolute; top: 16px; left: 16px; background: #181920; border: 2px solid #5a6275; color: #f59e0b; padding: 8px 16px; font-size: 11px; z-index: 10;">
            BABAK 2: CARI 5 BUNGA (<span id="hunt-counter">0</span>/5)
          </div>

          <!-- Environment -->
          <div style="position: absolute; top: 10px; left: 20px; width: 250px; height: 280px; pointer-events: none;"><img src="/assets/sprites/tree_large.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" /></div>
          <div style="position: absolute; top: 20px; left: 520px; width: 170px; height: 200px; pointer-events: none;"><img src="/assets/sprites/tree_medium.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" /></div>
          
          <!-- Ara Sitting on Bench -->
          <div style="position: absolute; top: 110px; right: 140px; width: 180px; height: 120px; pointer-events: none;">
            <img src="/assets/sprites/pixel_bench.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
            <img src="/assets/sprites/cewe_sitting.png" class="pixelated" style="position: absolute; top: -60px; left: 40px; width: 75px; height: 130px; object-fit: contain;" />
          </div>

          <!-- Flowers -->
          \${flowerList.map(f => \`
            <div id="flower-\${f.id}" onclick="pickFlower(\${f.id})" style="position: absolute; left: \${f.x}px; top: \${f.y}px; width: 65px; height: 85px; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));">
              <img src="\${f.sprite}" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
            </div>
          \`).join('')}

          <div id="shop-prompt" style="display: none; position: absolute; bottom: 40px; right: 40px; z-index: 20;">
            <button onclick="startBabak3()" class="pixel-btn pixel-btn-amber">
              MENUJU TOKO ALAT TULIS
            </button>
          </div>
        </div>
      \`;
    }`;

const newBabak2HTML = `    function startBabak2() {
      flowersPicked = 0;
      huntStart = Date.now();
      const root = document.getElementById('scene-root');
      root.innerHTML = \`
        <div style="position: absolute; inset: 0; background-image: url(/assets/sprites/tile_grass.png); background-size: 48px 48px; overflow: hidden; display: flex; flex-direction: column;">
          
          <!-- Dedicated Retro Top HUD Bar (Zero Collisions!) -->
          <div class="font-pixel" style="position: relative; width: 100%; height: 44px; background: #12141c; border-bottom: 2px solid #2e3440; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 40;">
            <div style="color: #f59e0b; font-size: 11px;">📖 BABAK 2: CARI 5 BUNGA</div>
            
            <!-- 5 Flower Inventory Slots -->
            <div style="display: flex; align-items: center; gap: 6px; background: #181a22; border: 1px solid #3b4252; padding: 4px 10px;">
              \${flowerList.map(fl => \`
                <div id="hud-slot-\${fl.id}" style="width: 26px; height: 26px; border: 1px solid #475569; background: rgba(15,23,42,0.6); opacity: 0.35; display: flex; align-items: center; justify-content: center;">
                  <img src="\${fl.sprite}" class="pixelated" style="width: 18px; height: 18px; object-fit: contain;" />
                </div>
              \`).join('')}
              <span id="hunt-counter" style="color: #f8fafc; font-size: 10px; margin-left: 6px; font-weight: bold;">0/5</span>
            </div>

            <div style="color: #cbd5e1; font-size: 10px;">⏱️ <span id="hunt-timer-val">0</span>s</div>
          </div>

          <!-- World Viewport -->
          <div style="position: relative; flex: 1; overflow: hidden;">
            <!-- Cobblestone Trail -->
            <div style="position: absolute; top: 320px; left: 0; width: 440px; height: 56px; background-image: url(/assets/sprites/tile_path.png); background-size: 48px 48px; border-top: 3px solid #b8a381; border-bottom: 3px solid #b8a381;"></div>
            <div style="position: absolute; top: 160px; left: 380px; width: 56px; height: 180px; background-image: url(/assets/sprites/tile_path.png); background-size: 48px 48px; border-left: 3px solid #b8a381; border-right: 3px solid #b8a381;"></div>
            <div style="position: absolute; top: 160px; left: 380px; width: 480px; height: 56px; background-image: url(/assets/sprites/tile_path.png); background-size: 48px 48px; border-top: 3px solid #b8a381; border-bottom: 3px solid #b8a381;"></div>

            <!-- Natural Pixel Pond (Zero Text / Zero AI Slop!) -->
            <div style="position: absolute; top: 250px; left: 440px; width: 270px; height: 175px; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.35)); pointer-events: none;">
              <img src="/assets/sprites/pixel_pond.png" class="pixelated" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>

            <!-- Trees & Park Elements -->
            <div style="position: absolute; top: 10px; left: 20px; width: 240px; height: 260px; pointer-events: none;"><img src="/assets/sprites/tree_large.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" /></div>
            <div style="position: absolute; top: 10px; left: 620px; width: 160px; height: 180px; pointer-events: none;"><img src="/assets/sprites/tree_medium.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" /></div>
            
            <!-- Ara Sitting on Park Bench (Aligned) -->
            <div style="position: absolute; top: 100px; right: 100px; width: 176px; height: 88px; pointer-events: none;">
              <img src="/assets/sprites/pixel_bench.png" class="pixelated" style="width:100%;height:100%;object-fit:contain;" />
              <img src="/assets/sprites/cewe_sitting.png" class="pixelated" style="position: absolute; top: -20px; left: 45px; width: 70px; height: 98px; object-fit: contain;" />
              <div class="font-pixel" style="position: absolute; top: -46px; left: 16px; background: #181920; border: 2px solid #ec4899; color: #fbcfe8; font-size: 9px; padding: 2px 8px; white-space: nowrap;">[ 🌸 ARA SEDANG MEMBACA ]</div>
            </div>

            <!-- Flowers (With Soft Ground Beds) -->
            \${flowerList.map(f => \`
              <div id="flower-\${f.id}" onclick="pickFlower(\${f.id})" style="position: absolute; left: \${f.x}px; top: \${f.y}px; width: 60px; height: 75px; cursor: pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
                <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 44px; height: 14px; background: rgba(46,29,15,0.35); border-radius: 50%;"></div>
                <img src="\${f.sprite}" class="pixelated" style="width:100%;height:100%;object-fit:contain;position:relative;z-index:2;" />
              </div>
            \`).join('')}

            <div id="shop-prompt" style="display: none; position: absolute; bottom: 30px; right: 30px; z-index: 20;">
              <button onclick="startBabak3()" class="pixel-btn pixel-btn-amber font-pixel" style="font-size: 11px; padding: 12px 20px;">
                🏪 MENUJU TOKO ALAT TULIS →
              </button>
            </div>
          </div>
        </div>
      \`;

      // Live timer update
      const timerInt = setInterval(() => {
        const timerVal = document.getElementById('hunt-timer-val');
        if (timerVal && flowersPicked < 5) {
          timerVal.innerText = Math.floor((Date.now() - huntStart) / 1000);
        } else {
          clearInterval(timerInt);
        }
      }, 1000);
    }`;

content = content.replace(oldBabak2HTML, newBabak2HTML);

// Update pickFlower to illuminate slot
const oldPickFlower = `      flowersPicked++;
      document.getElementById('hunt-counter').innerText = flowersPicked;`;
const newPickFlower = `      flowersPicked++;
      document.getElementById('hunt-counter').innerText = flowersPicked + '/5';
      const slot = document.getElementById('hud-slot-' + id);
      if (slot) {
        slot.style.opacity = '1';
        slot.style.borderColor = '#f59e0b';
        slot.style.background = 'rgba(245, 158, 11, 0.25)';
        slot.style.boxShadow = '0 0 8px rgba(245,158,11,0.6)';
      }`;

content = content.replace(oldPickFlower, newPickFlower);

fs.writeFileSync('bunga-untuk-perkenalan.html', content);
fs.writeFileSync('public/bunga-untuk-perkenalan.html', content);

console.log('Successfully updated standalone HTML files!');
