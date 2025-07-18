// إعداد المتغيرات
const keyboardLayout = ['جحخهعغفقثصض', 'طكمنتالبيسش', 'دظزوةىرئؤءذ'];
let currentTeam = 1;

let word1 = localStorage.getItem('word1') || '';
let word2 = localStorage.getItem('word2') || '';
let attempts = parseInt(localStorage.getItem('attempts')) || 6;

// إذا الكلمات غير موجودة، يرجع لصفحة الإعداد
if (!word1 || !word2) {
  alert('يرجى إدخال الكلمات أولاً!');
  window.location.href = 'index.html';
}

// إنشاء مصفوفات التخمين
let guesses1 = Array.from({ length: attempts }, () => Array(word1.length).fill(''));
let guesses2 = Array.from({ length: attempts }, () => Array(word2.length).fill(''));
let currentRow = [0, 0];
let currentCol = [0, 0];

// حالة ألوان لوحة الكيبورد حسب الفريق
let keyboardColors = { 1: {}, 2: {} };

// دوال إعداد اللوحة والكيبورد
function createBoard(containerId, wordLength, attempts) {
  const board = document.getElementById(containerId);
  board.innerHTML = '';
  board.style.display = 'grid';
  board.style.gridTemplateColumns = `repeat(${wordLength}, 40px)`;
  board.style.gap = '5px';

  for (let i = 0; i < attempts * wordLength; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `${containerId}-cell-${i}`;
    board.appendChild(cell);
  }
}

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

  // أزرار التحكم (إدخال وحذف)
  const controls = document.createElement('div');
  ['⏎', '⌫'].forEach(sym => {
    const btn = document.createElement('button');
    btn.textContent = sym;
    btn.className = 'key';
    btn.onclick = () => sym === '⏎' ? submitGuess() : deleteLetter();
    controls.appendChild(btn);
  });
  keyboardDiv.appendChild(controls);

  updateKeyboardColors();
}

// تلوين الكيبورد حسب الفريق
function updateKeyboardColors() {
  const map = keyboardColors[currentTeam];
  document.querySelectorAll('.key').forEach(k => {
    k.className = 'key';
    const letter = k.textContent;
    if (map[letter]) k.classList.add(map[letter]);
  });
}

// التعامل مع ضغط الحروف
function handleKey(letter) {
  const idx = currentTeam - 1;
  const word = idx === 0 ? word1 : word2;
  const guesses = idx === 0 ? guesses1 : guesses2;

  let col = currentCol[idx];
  let row = currentRow[idx];
  if (col < word.length && row < attempts) {
    guesses[row][col] = letter;
    document.getElementById(`board${currentTeam}-cell-${row * word.length + col}`).textContent = letter;
    currentCol[idx]++;
  }
}

function deleteLetter() {
  const idx = currentTeam - 1;
  let col = currentCol[idx];
  let row = currentRow[idx];
  const guesses = idx === 0 ? guesses1 : guesses2;
  const word = idx === 0 ? word1 : word2;

  if (col > 0) {
    currentCol[idx]--;
    guesses[row][col - 1] = '';
    document.getElementById(`board${currentTeam}-cell-${row * word.length + col - 1}`).textContent = '';
  }
}

function submitGuess() {
  const idx = currentTeam - 1;
  const word = idx === 0 ? word1 : word2;
  const guesses = idx === 0 ? guesses1 : guesses2;
  let row = currentRow[idx];
  const guess = guesses[row].join('');

  if (guess.length !== word.length) return;

  const colors = Array(word.length).fill('absent');
  const used = Array(word.length).fill(false);

  // ✅ أولًا تأكيد الحروف الصحيحة
  for (let i = 0; i < word.length; i++) {
    if (guess[i] === word[i]) {
      colors[i] = 'correct';
      used[i] = true;
      keyboardColors[currentTeam][guess[i]] = 'correct';
    }
  }

  // 🎯 بعدين الحروف في مكان غلط
  for (let i = 0; i < word.length; i++) {
    if (colors[i] === 'correct') continue;
    for (let j = 0; j < word.length; j++) {
      if (!used[j] && guess[i] === word[j]) {
        colors[i] = 'present';
        used[j] = true;
        if (keyboardColors[currentTeam][guess[i]] !== 'correct') {
          keyboardColors[currentTeam][guess[i]] = 'present';
        }
        break;
      }
    }
  }

  // تلوين الخانات
  colors.forEach((c, i) => {
    const cell = document.getElementById(`board${currentTeam}-cell-${row * word.length + i}`);
    cell.style.backgroundColor = c === 'correct' ? '#6aaa64' : c === 'present' ? '#c9b458' : '#787c7e';
    cell.style.color = 'white';
  });

  updateKeyboardColors();

  // إعلان الفوز أو التعادل
  if (guess === word) {
    return alert(`فريق ${currentTeam} فاز! ✅`);
  }

  currentRow[idx]++;
  currentCol[idx] = 0;

  if (currentRow[0] >= attempts && currentRow[1] >= attempts && currentRow[idx] >= attempts) {
    return alert('انتهت المحاولات! تعادل. 🤝');
  }

  toggleTurn();
}

function toggleTurn() {
  currentTeam = currentTeam === 1 ? 2 : 1;
  document.getElementById('current-turn').textContent = `دور: فريق ${currentTeam} ${currentTeam === 1 ? '🔴' : '🔵'}`;
  document.querySelector('.team1').classList.toggle('active', currentTeam === 1);
  document.querySelector('.team2').classList.toggle('active', currentTeam === 2);
  updateKeyboardColors();
}

// تشغيل اللعبة
window.onload = () => {
  createBoard('board1', word1.length, attempts);
  createBoard('board2', word2.length, attempts);
  renderKeyboard();

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitGuess();
    else if (e.key === 'Backspace') deleteLetter();
    else if (/^[\u0600-\u06FF]$/.test(e.key)) handleKey(e.key);
  });
};
