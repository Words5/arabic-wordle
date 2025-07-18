const keyboardLayout = [
  'جحخهعغفقثصض',
  'طكمنتالبيسش',
  'دظزوةىرئؤءذ'
];

let currentTeam = 1;

function renderKeyboard() {
  const keyboardDiv = document.getElementById('keyboard');
  keyboardDiv.innerHTML = '';
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    [...row].forEach(letter => {
      const key = document.createElement('button');
      key.textContent = letter;
      key.className = 'key';
      key.onclick = () => handleKey(letter);
      rowDiv.appendChild(key);
    });
    keyboardDiv.appendChild(rowDiv);
  });
}

function handleKey(letter) {
  console.log(`ضغط: ${letter}`);
  // هنا تقدر تضيف المنطق لتحديث المربعات
}

function toggleTurn() {
  currentTeam = currentTeam === 1 ? 2 : 1;
  document.getElementById('current-turn').textContent = `دور: فريق ${currentTeam} ${currentTeam === 1 ? '🔴' : '🔵'}`;
  document.querySelector('.team1').classList.toggle('active', currentTeam === 1);
  document.querySelector('.team2').classList.toggle('active', currentTeam === 2);
}

window.onload = () => {
  renderKeyboard();
  // TODO: إنشاء المربعات حسب عدد الحروف والمحاولات
};
