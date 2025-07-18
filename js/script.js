// كيبورد عربي مرتب حسب كيبورد الجوال
const arabicKeyRows = [
  ['ج','ح','خ','هـ','ع','غ','ف','ق','ث','ص','ض'],
  ['ط','ك','م','ن','ت','ا','ل','ب','ي','س','ش'],
  ['د','ظ','ز','و','ة','ى','ر','ئ','ؤ','ء','ذ']
];

let turn = 1;
const keyColorsTeam1 = {};
const keyColorsTeam2 = {};

function handleKeyPress(char) {
  console.log(`ضغط: ${char}`);
  // هنا يتم التعامل مع إدخال الحرف داخل المربعات
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

  arabicKeyRows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.justifyContent = "center";

    [...row].reverse().forEach(char => {
      const btn = document.createElement("button");
      btn.textContent = char;
      btn.className = "key";

      if (teamColors[char]) {
        btn.classList.add(teamColors[char]);
      }

      btn.onclick = () => handleKeyPress(char);
      rowDiv.appendChild(btn);
    });

    container.appendChild(rowDiv);
  });
}

function updateTurnDisplay() {
  document.getElementById("current-turn").textContent =
    "دور: " + (turn === 1 ? "فريق 1 🔴" : "🔵 فريق 2");

  document.querySelector(".team1").classList.toggle("active", turn === 1);
  document.querySelector(".team2").classList.toggle("active", turn === 2);

  renderKeyboard();
}

renderKeyboard();
updateTurnDisplay();
