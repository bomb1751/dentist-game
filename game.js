const patients = [
  { name: '兔兔', avatar: '🐰', problem: 'stain', message: '整顆牙都黃黃的，幫我刷乾淨！', done: '亮晶晶，刷乾淨了！' },
  { name: '小熊', avatar: '🐻', problem: 'cavity', message: '先清乾淨黑黑的蛀牙，再把洞補好！', done: '洞洞補好了！' },
  { name: '河馬', avatar: '🦛', problem: 'food', message: '用小夾子，把菜渣送到垃圾桶！', done: '青菜夾出來了！' },
];
const icons = {
  brush: '<svg viewBox="0 0 80 80"><path d="M25 29L67 68" stroke="#4fbdba" stroke-width="12" stroke-linecap="round"/><rect x="9" y="8" width="27" height="25" rx="7" fill="#76ddd2" transform="rotate(-35 22 20)"/><path d="M10 17L20 7M15 21L26 10M20 25L31 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>',
  drill: '<svg viewBox="0 0 80 80"><path d="M10 10L30 30" stroke="#a2aabd" stroke-width="5"/><path d="M28 29L40 41" stroke="#4b617a" stroke-width="8"/><path d="M39 39L66 66" stroke="#76bfe7" stroke-width="17" stroke-linecap="round"/><path d="M43 43L61 61" stroke="#c9efff" stroke-width="4"/></svg>',
  fill: '<svg viewBox="0 0 80 80"><path d="M9 9L27 27" stroke="#a2aabd" stroke-width="4"/><path d="M28 28L61 61" stroke="#d4b0ee" stroke-width="13"/><path d="M25 35L35 25M50 65L65 50M60 70L70 60" stroke="#8264a6" stroke-width="5" stroke-linecap="round"/></svg>',
  tweezers: '<svg viewBox="0 0 80 80"><path d="M9 14L65 65Q73 73 67 58L17 7" fill="none" stroke="#f8c458" stroke-width="7" stroke-linecap="round"/><path d="M9 14L23 28M17 7L31 21" stroke="#fff1b6" stroke-width="3"/></svg>',
};
const teeth = document.querySelector('#teeth');
const tools = [...document.querySelectorAll('.tool')];
const instruction = document.querySelector('#instruction');
const celebration = document.querySelector('#celebration');
const soundButton = document.querySelector('#soundButton');
const sparkles = document.querySelector('#sparkles');
const bin = document.querySelector('#trashBin');
const ghost = document.querySelector('#dragTool');
const meter = document.querySelector('#progressFill');
const progressText = document.querySelector('#progressText');
let currentPatient, selectedTool = null, lastPatientIndex = -1;
let soundOn = true, drag = null, treatment = null, treatments = [], completionTimer;

function playNotes(notes) {
  if (!soundOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  notes.forEach(([frequency, start, length]) => {
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.09, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + start + length);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(audio.currentTime + start); oscillator.stop(audio.currentTime + start + length);
  });
  window.setTimeout(() => audio.close(), 800);
}
function hint(text, icon = '👆') {
  instruction.replaceChildren();
  const symbol = document.createElement('span'); symbol.className = 'instruction-icon'; symbol.textContent = icon;
  const label = document.createElement('span'); label.textContent = text;
  instruction.append(symbol, label);
}
function updateProgress(value, label) {
  treatment.progress = treatment.done ? 100 : treatment.problem === 'cavity' ? (treatment.stage === 'clean' ? value / 2 : 50 + value / 2) : value;
  const total = Math.round(treatments.reduce((sum, item) => sum + (item.progress || 0), 0) / treatments.length);
  const finished = treatments.filter(item => item.done).length;
  meter.style.width = `${total}%`;
  document.querySelector('#progress').setAttribute('aria-valuenow', String(total));
  progressText.textContent = `已治好 ${finished}/2 顆 · ${label} ${value}%`;
}
function requiredTool(item = treatment) {
  if (item.problem === 'stain') return 'brush';
  if (item.problem === 'food') return 'tweezers';
  return item.stage === 'clean' ? 'drill' : 'fill';
}
function guidance() {
  if (treatment.done) return '治療完成！';
  if (treatment.problem === 'stain') return '拖曳牙刷，來回刷遍整顆黃牙';
  if (treatment.problem === 'food') return '拖曳小夾子夾住菜渣，放進垃圾桶';
  return treatment.stage === 'clean' ? '拖曳清蛀牙器，把黑色部分全部清乾淨' : '換填補器，拖曳把藍色洞洞全部補白';
}
function selectTool(name) {
  selectedTool = name;
  treatment = treatments.find(item => !item.done && requiredTool(item) === name) || treatments.find(item => !item.done) || treatment;
  tools.forEach(tool => {
    const active = tool.dataset.tool === name;
    tool.classList.toggle('selected', active); tool.setAttribute('aria-pressed', String(active));
  });
  hint(guidance());
}
function choosePatient() {
  clearTimeout(completionTimer); endDrag(false);
  let index;
  do index = Math.floor(Math.random() * patients.length); while (index === lastPatientIndex);
  lastPatientIndex = index; currentPatient = patients[index]; selectedTool = null;
  document.querySelector('#patientAvatar').textContent = currentPatient.avatar;
  document.querySelector('#patientName').textContent = currentPatient.name;
  document.querySelector('#patientMessage').textContent = '有兩顆牙齒需要幫忙，請把它們都治好！';
  tools.forEach(tool => { tool.classList.remove('selected'); tool.setAttribute('aria-pressed', 'false'); });
  bin.classList.remove('ready', 'received', 'over');
  renderTeeth(); bin.hidden = !treatments.some(item => item.problem === 'food');
  hint('有兩個問題！拿起工具，拖曳治療牙齒');
}
function renderTeeth() {
  teeth.replaceChildren(); treatments = [];
  const positions = Array.from({ length: 8 }, (_, index) => index);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const problemPositions = positions.slice(0, 2);
  const problems = ['stain', 'cavity', 'food'];
  for (let index = 0; index < 8; index++) {
    const tooth = document.createElement('div'); tooth.className = 'tooth';
    tooth.setAttribute('role', 'img'); tooth.setAttribute('aria-label', `第 ${index + 1} 顆健康牙齒`);
    if (problemPositions.includes(index)) {
      const problem = problems[Math.floor(Math.random() * problems.length)];
      tooth.classList.add('issue'); tooth.dataset.problem = problem;
      const names = { stain: '黃牙', cavity: '蛀牙', food: '卡菜渣' };
      tooth.setAttribute('aria-label', `第 ${index + 1} 顆牙齒：${names[problem]}`);
      treatment = { tooth, problem, stage: 'clean', done: false, progress: 0 };
      treatments.push(treatment);
      if (problem === 'food') {
        const food = document.createElement('span'); food.className = 'food-piece'; food.textContent = '🥦';
        tooth.append(food); treatment.food = food;
      } else {
        const canvas = document.createElement('canvas'); canvas.width = 120; canvas.height = 170;
        canvas.className = 'treatment-surface'; canvas.setAttribute('aria-hidden', 'true'); tooth.append(canvas);
        treatment.canvas = canvas; treatment.ctx = canvas.getContext('2d', { willReadFrequently: true }); drawMask();
      }
    }
    teeth.append(tooth);
  }
  treatment = treatments[0]; updateProgress(0, '準備治療');
}
function drawMask() {
  const ctx = treatment.ctx; ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, 120, 170);
  ctx.beginPath();
  if (treatment.problem === 'stain') {
    ctx.roundRect(0, 0, 120, 170, [24, 24, 38, 38]);
    const color = ctx.createLinearGradient(0, 0, 120, 170);
    color.addColorStop(0, '#ffe15b'); color.addColorStop(1, '#d8a519'); ctx.fillStyle = color;
  } else {
    ctx.ellipse(60, 85, 35, 47, -.15, 0, Math.PI * 2);
    ctx.fillStyle = treatment.stage === 'clean' ? '#33252d' : '#acd7e5';
  }
  ctx.fill();
  treatment.total = countPixels();
}
function countPixels() {
  const data = treatment.ctx.getImageData(0, 0, 120, 170).data;
  let count = 0; for (let i = 3; i < data.length; i += 4) if (data[i] > 20) count++;
  return count;
}
function inside(x, y, rect, pad = 0) {
  return x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
}
function showGhost(x, y) {
  ghost.hidden = false; ghost.style.left = `${x}px`; ghost.style.top = `${y}px`;
  ghost.innerHTML = `${icons[selectedTool]}${drag?.food ? '<span class="carried-food">🥦</span>' : ''}`;
}
function tryPickup(x, y) {
  if (drag.food || selectedTool !== 'tweezers') return;
  const target = treatments.find(item => !item.done && item.problem === 'food' && inside(x, y, item.food.getBoundingClientRect(), 8));
  if (target) {
    treatment = target; drag.food = true; drag.target = target; target.food.style.visibility = 'hidden';
    bin.classList.remove('received'); bin.classList.add('ready');
    hint('夾住了！拖到垃圾桶裡再放開', '🥦'); playNotes([[520, 0, .1]]);
  }
}
function startDrag(event, toolName) {
  if (!event.isPrimary || event.button !== 0 || treatments.every(item => item.done) || drag) return;
  if (toolName) selectTool(toolName);
  if (!selectedTool) { hint('先拿一個工具，再拖到牙齒上', '🧰'); return; }
  event.preventDefault();
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, food: false, capture: event.currentTarget };
  drag.capture.setPointerCapture(event.pointerId);
  tryPickup(event.clientX, event.clientY); showGhost(event.clientX, event.clientY);
}
function scrub(x, y) {
  const target = treatments.find(item => !item.done && item.canvas && inside(x, y, item.canvas.getBoundingClientRect()));
  if (!target) return null;
  treatment = target;
  if (requiredTool(target) !== selectedTool) { hint(guidance(), '💡'); return null; }
  const rect = target.canvas.getBoundingClientRect();
  const ctx = target.ctx; ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.ellipse((x - rect.left) / rect.width * 120, (y - rect.top) / rect.height * 170,
    13 / rect.width * 120, 13 / rect.height * 170, 0, 0, Math.PI * 2); ctx.fill();
  return target;
}
function moveDrag(event) {
  if (!drag || event.pointerId !== drag.id) return;
  const x = event.clientX, y = event.clientY;
  if (selectedTool === 'tweezers') {
    tryPickup(x, y); bin.classList.toggle('over', drag.food && inside(x, y, bin.getBoundingClientRect()));
  } else {
    const distance = Math.hypot(x - drag.x, y - drag.y);
    if (distance >= 1) {
      const steps = Math.ceil(distance / 4), touched = new Set();
      for (let i = 1; i <= steps; i++) {
        const target = scrub(drag.x + (x - drag.x) * i / steps, drag.y + (y - drag.y) * i / steps);
        if (target) touched.add(target);
      }
      for (const target of touched) {
        treatment = target;
        const percentage = Math.round((1 - countPixels() / treatment.total) * 100);
        updateProgress(percentage, treatment.problem === 'stain' ? '刷牙' : treatment.stage === 'clean' ? '清蛀牙' : '填補');
        if (percentage >= 98) {
          treatment.ctx.clearRect(0, 0, 120, 170);
          if (treatment.problem === 'cavity' && treatment.stage === 'clean') {
            treatment.stage = 'fill'; drawMask(); updateProgress(0, '填補'); endDrag(false);
            hint('這顆清乾淨了！換填補器把洞補白', '✨'); playNotes([[523, 0, .16], [659, .14, .2]]);
          } else finishTreatment();
        }
      }
      if (!drag) return;
    }
  }
  drag.x = x; drag.y = y; showGhost(x, y);
}
function endDrag(drop, event) {
  if (!drag || (event && event.pointerId !== drag.id)) return;
  const previous = drag; drag = null;
  ghost.hidden = true; bin.classList.remove('ready', 'over');
  if (previous.capture.hasPointerCapture(previous.id)) previous.capture.releasePointerCapture(previous.id);
  if (previous.food) {
    treatment = previous.target;
    if (drop && event && inside(event.clientX, event.clientY, bin.getBoundingClientRect())) {
      treatment.food.remove(); bin.classList.add('received'); updateProgress(100, '送到垃圾桶'); finishTreatment();
    } else {
      treatment.food.style.visibility = ''; hint('菜渣要放進垃圾桶喔！再試一次', '🗑️');
    }
  }
}
function finishTreatment() {
  if (treatment.done) return;
  treatment.done = true; endDrag(false); treatment.tooth.classList.remove('issue'); treatment.tooth.classList.add('healed');
  treatment.tooth.setAttribute('aria-label', '治療完成的健康牙齒');
  updateProgress(100, '治療完成'); makeSparkles();
  playNotes([[523, 0, .18], [659, .14, .18], [784, .28, .3]]);
  if (!treatments.every(item => item.done)) {
    hint('治好一顆了！再把另一顆牙齒治好', '✨'); return;
  }
  hint('兩顆牙齒都健康了！', '✨');
  completionTimer = window.setTimeout(() => {
    document.querySelector('#celebrationEmoji').textContent = '😁';
    document.querySelector('#celebrationTitle').textContent = '兩顆牙齒都治好了！';
    document.querySelector('#celebrationMessage').textContent = `${currentPatient.name}說：謝謝小醫生！`;
    celebration.showModal();
  }, 650);
}
function makeSparkles() {
  ['✨', '⭐', '✨', '💖', '⭐'].forEach((symbol, index) => {
    const sparkle = document.createElement('span'); sparkle.className = 'spark'; sparkle.textContent = symbol;
    sparkle.style.left = `${30 + index * 10}%`; sparkle.style.top = `${42 + index % 2 * 12}%`;
    sparkle.style.setProperty('--x', `${(index - 2) * 34}px`); sparkle.style.setProperty('--y', `${-65 - index % 2 * 30}px`);
    sparkles.append(sparkle); window.setTimeout(() => sparkle.remove(), 900);
  });
}
tools.forEach(tool => {
  tool.querySelector('.tool-picture').innerHTML = icons[tool.dataset.tool];
  tool.addEventListener('click', () => selectTool(tool.dataset.tool));
  tool.addEventListener('pointerdown', event => startDrag(event, tool.dataset.tool));
});
teeth.addEventListener('pointerdown', event => startDrag(event));
document.addEventListener('pointermove', moveDrag);
document.addEventListener('pointerup', event => endDrag(true, event));
document.addEventListener('pointercancel', event => endDrag(false, event));
document.addEventListener('lostpointercapture', event => endDrag(false, event));
window.addEventListener('blur', () => endDrag(false));
soundButton.addEventListener('click', () => {
  soundOn = !soundOn; soundButton.textContent = soundOn ? '🔊' : '🔇';
  soundButton.setAttribute('aria-label', soundOn ? '關閉聲音' : '開啟聲音'); soundButton.setAttribute('aria-pressed', String(soundOn));
  if (soundOn) playNotes([[660, 0, .16]]);
});
document.querySelector('#nextPatient').addEventListener('click', () => { celebration.close(); choosePatient(); });
choosePatient();
