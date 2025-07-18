// Arabic letters used in the keyboard
const arabicKeys = [
  'ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش',
  'ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'
];

// Game state
let turn = 1; // 1 = team1, 2 = team2
const keyColorsTeam1 = {};
const keyColorsTeam2 = {};

function handleKeyPress(char) {
  // Add character to current row or input (to be implemented)
  console.log(`Key pressed: ${char}`);
}

function colorKey(letter, status) {
  const teamColors = turn === 1 ? keyColorsTeam1 : keyColorsTeam2;
  const priority = { correct: 3, present: 2, absent: 1 };
  if (!teamColors[letter] || priority[status] > priority[teamColors[letter]]) {
    teamColors[letter] = status;
  }
  renderKeyboard();
}

function renderKeyboard() {
  const container = document.getElementById("keyboard");
  container.innerHTML = "";
  const teamColors = turn === 1 ? keyColorsTeam1 : keyColorsTeam2;

  arabicKeys.forEach(char => {
    const btn = document.createElement("button");
    btn.textContent = char;
    btn.className = "key";

    if (teamColors[char]) {
      btn.classList.add(teamColors[char]);
    }

    btn.onclick = () => handleKeyPress(char);
    container.appendChild(btn);
  });
}

function updateTurnDisplay() {
  document.getElementById("current-turn").textContent =
    "دور: " + (turn === 1 ? "فريق 1 🔴" : "🔵 فريق 2");

  document.querySelector(".team1").classList.toggle("active", turn === 1);
  document.querySelector(".team2").classList.toggle("active", turn === 2);

  renderKeyboard();
  updateCurrentRowDisplay();
}

function updateCurrentRowDisplay() {
  // to be implemented depending on how rows are shown
}

renderKeyboard();
updateTurnDisplay();
