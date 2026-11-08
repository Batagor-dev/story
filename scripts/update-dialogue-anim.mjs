import fs from 'fs';

let content = fs.readFileSync('bunga-untuk-perkenalan.html', 'utf8');

// Replace renderCurrentLine and advanceDialogue with talking animation
const oldRenderBlock = `      // Bust Portrait (Chest to Head!)
      const portraitSrc = line.portrait || (line.speakerType === 'ara' ? '/assets/sprites/cewe_bust_talking.png' : '/assets/sprites/cowo_bust_talking.png');
      portraitEl.innerHTML = \`<img src="\${portraitSrc}" class="pixelated" style="width: 150px; height: 170px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));" />\`;

      clearInterval(typingInterval);
      textEl.innerText = '';
      choicesEl.style.display = 'none';
      choicesEl.innerHTML = '';
      promptEl.style.display = line.choices ? 'none' : 'flex';
      isTyping = true;

      let charIdx = 0;
      typingInterval = setInterval(() => {
        charIdx++;
        textEl.innerText = line.text.slice(0, charIdx);
        if (charIdx % 2 === 1) playBlip(line.speakerType === 'ara' ? 560 : 440);
        if (charIdx >= line.text.length) {
          clearInterval(typingInterval);
          isTyping = false;
          if (line.choices) renderChoices(line.choices, line.onChoice);
        }
      }, 24);
    }

    function advanceDialogue() {
      const line = dialogueLines[dialogueIndex];
      if (line && line.choices) return;
      if (isTyping) {
        clearInterval(typingInterval);
        document.getElementById('dialogue-text').innerText = line.text;
        isTyping = false;
        return;
      }
      dialogueIndex++;
      renderCurrentLine();
    }`;

const newRenderBlock = `      // Bust Portrait with Talking Mouth Animation
      const isArel = line.speakerType === 'arel' || line.speakerType === 'thought';
      const isAra = line.speakerType === 'ara';
      let mouthOpen = false;

      function updatePortrait(open) {
        let src;
        if (isArel) {
          src = open ? '/assets/sprites/arel_bust_talk.png' : '/assets/sprites/arel_bust_idle.png';
        } else if (isAra) {
          src = open ? '/assets/sprites/cewe_bust_talking.png' : '/assets/sprites/cewe_bust_smiling.png';
        } else {
          src = line.portrait || '/assets/sprites/cewe_bust_smiling.png';
        }
        portraitEl.innerHTML = \`<img src="\${src}" class="pixelated" style="width: 150px; height: 170px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));" />\`;
      }

      updatePortrait(true);

      clearInterval(typingInterval);
      textEl.innerText = '';
      choicesEl.style.display = 'none';
      choicesEl.innerHTML = '';
      promptEl.style.display = line.choices ? 'none' : 'flex';
      isTyping = true;

      let charIdx = 0;
      typingInterval = setInterval(() => {
        charIdx++;
        textEl.innerText = line.text.slice(0, charIdx);
        if (charIdx % 2 === 1) playBlip(line.speakerType === 'ara' ? 560 : 440);
        
        // Flap mouth while speaking
        if (charIdx % 4 === 1) {
          mouthOpen = !mouthOpen;
          updatePortrait(mouthOpen);
        }

        if (charIdx >= line.text.length) {
          clearInterval(typingInterval);
          isTyping = false;
          updatePortrait(false); // Closed smile when finished talking!
          if (line.choices) renderChoices(line.choices, line.onChoice);
        }
      }, 24);
    }

    function advanceDialogue() {
      const line = dialogueLines[dialogueIndex];
      if (line && line.choices) return;
      if (isTyping) {
        clearInterval(typingInterval);
        document.getElementById('dialogue-text').innerText = line.text;
        isTyping = false;
        const isArel = line.speakerType === 'arel' || line.speakerType === 'thought';
        const isAra = line.speakerType === 'ara';
        const src = isArel ? '/assets/sprites/arel_bust_idle.png' : isAra ? '/assets/sprites/cewe_bust_smiling.png' : (line.portrait || '/assets/sprites/cewe_bust_smiling.png');
        document.getElementById('dialogue-portrait').innerHTML = \`<img src="\${src}" class="pixelated" style="width: 150px; height: 170px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.6));" />\`;
        return;
      }
      dialogueIndex++;
      renderCurrentLine();
    }`;

content = content.replace(oldRenderBlock, newRenderBlock);

fs.writeFileSync('bunga-untuk-perkenalan.html', content);
fs.writeFileSync('public/bunga-untuk-perkenalan.html', content);

console.log('Successfully updated HTML dialogue talking animation!');
