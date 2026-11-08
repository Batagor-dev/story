import fs from 'fs';

let content = fs.readFileSync('bunga-untuk-perkenalan.html', 'utf8');

// Move dialogue-portrait inside dialogue-box
const oldBoxHTML = `        <!-- Portrait on Right (Chest to Head - Badan ke Kepala saja!) -->
        <div id="dialogue-portrait" style="position: absolute; right: 28px; bottom: calc(100% - 10px); z-index: 20; pointer-events: none;"></div>

        <!-- Speaker Name Chamfered Badge -->
        <div style="display: inline-block;">
          <div id="dialogue-badge" class="font-pixel dialog-badge-clip" style="font-size: 11px; padding: 6px 16px; border-top: 2px solid; border-left: 2px solid; border-right: 2px solid; text-transform: uppercase; font-weight: bold;">
            Arel
          </div>
        </div>

        <!-- Bubble Frame -->
        <div id="dialogue-box" style="position: relative; border-width: 4px; border-style: solid; border-radius: 8px; padding: 16px; min-height: 100px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 0 rgba(0,0,0,0.6);">`;

const newBoxHTML = `        <!-- Speaker Name Chamfered Badge -->
        <div style="display: inline-block;">
          <div id="dialogue-badge" class="font-pixel dialog-badge-clip" style="font-size: 11px; padding: 6px 16px; border-top: 2px solid; border-left: 2px solid; border-right: 2px solid; text-transform: uppercase; font-weight: bold;">
            Arel
          </div>
        </div>

        <!-- Bubble Frame (Anchored Bust Inside with Zero Floating Gap!) -->
        <div id="dialogue-box" style="position: relative; border-width: 4px; border-style: solid; border-radius: 8px; padding: 16px; min-height: 100px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 0 rgba(0,0,0,0.6);">
          <!-- Portrait on Right Anchored Directly on Top of Dialogue Box -->
          <div id="dialogue-portrait" style="position: absolute; right: 28px; bottom: calc(100% - 4px); z-index: 20; pointer-events: none;"></div>`;

content = content.replace(oldBoxHTML, newBoxHTML);

// Update img in updatePortrait to have object-position: bottom
content = content.replaceAll(
  `style="width: 150px; height: 170px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));"`,
  `style="width: 140px; height: 160px; object-fit: contain; object-position: bottom; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));"`
);

fs.writeFileSync('bunga-untuk-perkenalan.html', content);
fs.writeFileSync('public/bunga-untuk-perkenalan.html', content);

console.log('Successfully anchored portrait directly on dialogue box in HTML files!');
