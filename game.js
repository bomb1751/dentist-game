const patients = [
  { name: "兔兔", avatar: "🐰", problem: "stain", tool: "brush", message: "牙齒黃黃的，幫我刷乾淨！", done: "亮晶晶，刷乾淨了！" },
  { name: "小熊", avatar: "🐻", problem: "cavity", tool: "drill", message: "牙齒有一個小洞洞！", done: "洞洞補好了！" },
  { name: "河馬", avatar: "🦛", problem: "food", tool: "tweezers", message: "有青菜卡在牙齒上！", done: "青菜夾出來了！" },
];

const toolNames = { brush: "牙刷", drill: "補牙器", tweezers: "小夾子" };
const problemHints = { stain: "黃色污漬要用牙刷喔！", cavity: "小洞洞要用補牙器喔！", food: "青菜要用小夾子喔！" };

const teeth = document.querySelector("#teeth");
const tools = [...document.querySelectorAll(".tool")];
const instruction = document.querySelector("#instruction");
const celebration = document.querySelector("#celebration");
const soundButton = document.querySelector("#soundButton");
const sparkles = document.querySelector("#sparkles");

let currentPatient;
let selectedTool = null;
let soundOn = true;
let lastPatientIndex = -1;

function playNotes(notes) {
  if (!soundOn) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  notes.forEach(([frequency, start, length]) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.12, audio.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + start + length);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(audio.currentTime + start);
    oscillator.stop(audio.currentTime + start + length);
  });
  window.setTimeout(() => audio.close(), 800);
}

function choosePatient() {
  let index;
  do index = Math.floor(Math.random() * patients.length);
  while (patients.length > 1 && index === lastPatientIndex);
  lastPatientIndex = index;
  currentPatient = patients[index];
  selectedTool = null;

  document.querySelector("#patientAvatar").textContent = currentPatient.avatar;
  document.querySelector("#patientName").textContent = currentPatient.name;
  document.querySelector("#patientMessage").textContent = currentPatient.message;
  instruction.className = "instruction";
  instruction.innerHTML = '<span class="instruction-icon">👆</span><span>先選工具，再點牙齒</span>';
  tools.forEach((tool) => {
    tool.classList.remove("selected");
    tool.setAttribute("aria-pressed", "false");
  });
  renderTeeth();
}

function renderTeeth() {
  teeth.replaceChildren();
  const problemIndex = 1 + Math.floor(Math.random() * 6);
  for (let index = 0; index < 8; index += 1) {
    const tooth = document.createElement("button");
    tooth.type = "button";
    tooth.className = "tooth";
    tooth.setAttribute("aria-label", `第 ${index + 1} 顆牙齒`);
    if (index === problemIndex) {
      tooth.classList.add("issue");
      tooth.dataset.problem = currentPatient.problem;
      tooth.setAttribute("aria-label", `需要治療的第 ${index + 1} 顆牙齒`);
    }
    tooth.addEventListener("click", () => treatTooth(tooth));
    teeth.append(tooth);
  }
}

function treatTooth(tooth) {
  if (!tooth.classList.contains("issue")) {
    instruction.className = "instruction hint";
    instruction.innerHTML = '<span class="instruction-icon">🔎</span><span>找找看哪顆牙齒怪怪的？</span>';
    return;
  }
  if (!selectedTool) {
    instruction.className = "instruction hint";
    instruction.innerHTML = '<span class="instruction-icon">🧰</span><span>先選一個工具喔！</span>';
    playNotes([[220, 0, .18]]);
    return;
  }
  if (selectedTool !== currentPatient.tool) {
    tooth.classList.remove("wrong");
    void tooth.offsetWidth;
    tooth.classList.add("wrong");
    instruction.className = "instruction hint";
    instruction.innerHTML = `<span class="instruction-icon">💡</span><span>${problemHints[currentPatient.problem]}</span>`;
    playNotes([[260, 0, .12], [220, .13, .15]]);
    return;
  }

  tooth.classList.remove("issue");
  tooth.classList.add("healed");
  tooth.removeAttribute("data-problem");
  tooth.setAttribute("aria-label", "治療完成的健康牙齒");
  makeSparkles();
  playNotes([[523, 0, .18], [659, .14, .18], [784, .28, .3]]);
  window.setTimeout(showCelebration, 650);
}

function makeSparkles() {
  ["✨", "⭐", "✨", "💖", "⭐"].forEach((symbol, index) => {
    const sparkle = document.createElement("span");
    sparkle.className = "spark";
    sparkle.textContent = symbol;
    sparkle.style.left = `${30 + index * 10}%`;
    sparkle.style.top = `${42 + (index % 2) * 12}%`;
    sparkle.style.setProperty("--x", `${(index - 2) * 34}px`);
    sparkle.style.setProperty("--y", `${-65 - (index % 2) * 30}px`);
    sparkles.append(sparkle);
    window.setTimeout(() => sparkle.remove(), 900);
  });
}

function showCelebration() {
  document.querySelector("#celebrationEmoji").textContent = currentPatient.avatar === "🦛" ? "😄" : "😁";
  document.querySelector("#celebrationTitle").textContent = currentPatient.done;
  document.querySelector("#celebrationMessage").textContent = `${currentPatient.name}說：謝謝小醫生！`;
  celebration.showModal();
}

tools.forEach((tool) => {
  tool.addEventListener("click", () => {
    selectedTool = tool.dataset.tool;
    tools.forEach((item) => {
      const isSelected = item === tool;
      item.classList.toggle("selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    instruction.className = "instruction";
    instruction.innerHTML = `<span class="instruction-icon">${tool.querySelector(".tool-picture").textContent}</span><span>拿著${toolNames[selectedTool]}，點怪怪的牙齒</span>`;
    playNotes([[440, 0, .12], [560, .1, .14]]);
  });
});

soundButton.addEventListener("click", () => {
  soundOn = !soundOn;
  soundButton.textContent = soundOn ? "🔊" : "🔇";
  soundButton.setAttribute("aria-label", soundOn ? "關閉聲音" : "開啟聲音");
  soundButton.setAttribute("aria-pressed", String(soundOn));
  if (soundOn) playNotes([[660, 0, .16]]);
});

document.querySelector("#nextPatient").addEventListener("click", () => {
  celebration.close();
  choosePatient();
});

choosePatient();
