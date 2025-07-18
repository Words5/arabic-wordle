let word1 = '';
let word2 = '';
let attempts = 6;
let currentTeam = 1;
let currentRow = [0, 0];
let currentCol = [0, 0];
let guesses1 = [];
let guesses2 = [];
let keyboardColors = { 1: {}, 2: {} };

const keyboardLayout = ['جحخهعغفقثصض', 'طكمنتالبيسش', 'دظزوةىرئؤءذ'];

function startGame() {
  word1 = document.getElementById('word1').value.trim();
  word2 = document.getElementById('word2').value.trim();
  attempts = parseInt(document.getElementById('attempts').value) || 6;

  if (!word1 || !word2 || word1.length !== word2.length) {
    alert('تأكد من كتابة كلمتين متساويتين في الطول');
    return;
  }

  guesses1 = Array.from({ length: attempts }, () => Array(word1.length).fill(''));
  guesses2 = Array.from({ length: attempts }, () => Array(word2.length).fill(''));
  currentRow = [0, 0];
  currentCol = [0, 0];

  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'block';

  createBoard('board1', word1.length, attempts);
  createBoard('board2', word2.length, attempts);
  renderKeyboard();
  updateTurnUI();
}

function createBoard(containerId, wordLength, attempts) {
  const board = document.getElementById(containerId);
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;
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

  const controlRow = document.createElement('div');
  const enter = document.createElement('button');
  enter.textContent = '⏎';
  enter.className = 'key';
  enter.onclick = () => submitGuess();

  const del = document.createElement('button');
  del.textContent = '⌫';
  del.className = 'key';
  del.onclick = () => deleteLetter();

  controlRow.appendChild(enter);
  controlRow.appendChild(del);
  keyboardDiv.appendChild(controlRow);

  updateKeyboardColors();
}

function handleKey(letter) {
  const teamIndex = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;

  let row = currentRow[teamIndex];
  let col = currentCol[teamIndex];

  if (col < word.length && row < attempts) {
    guesses[row][col] = letter;
    const cellId = `board${currentTeam}-cell-${row * word.length + col}`;
    document.getElementById(cellId).textContent = letter;
    currentCol[teamIndex]++;
  }
}

function deleteLetter() {
  const teamIndex = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;

  let row = currentRow[teamIndex];
  let col = currentCol[teamIndex];

  if (col > 0) {
    currentCol[teamIndex]--;
    guesses[row][currentCol[teamIndex]] = '';
    const cellId = `board${currentTeam}-cell-${row * word.length + currentCol[teamIndex]}`;
    document.getElementById(cellId).textContent = '';
  }
}

function submitGuess() {
  const teamIndex = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;
  const row = currentRow[teamIndex];
  const guess = guesses[row].join('');

  if (guess.length !== word.length) return;

  const colors = Array(word.length).fill('absent');
  const used = Array(word.length).fill(false);

  for (let i = 0; i < word.length; i++) {
    if (guess[i] === word[i]) {
      colors[i] = 'correct';
      used[i] = true;
      keyboardColors[currentTeam][guess[i]] = 'correct';
    }
  }

  for (let i = 0; i < word.length; i++) {
    if (colors[i] !== 'correct') {
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
  }

  for (let i = 0; i < word.length; i++) {
    const cellId = `board${currentTeam}-cell-${row * word.length + i}`;
    const cell = document.getElementById(cellId);
    cell.className = `cell ${colors[i]}`;
  }

  updateKeyboardColors();

  if (guess === word) {
    showPopup(`🎉 فريق ${currentTeam} فاز!`);
    return;
  }

  currentRow[teamIndex]++;
  currentCol[teamIndex] = 0;

  if (currentRow[0] >= attempts && currentRow[1] >= attempts) {
    showPopup('😢 انتهت المحاولات! تعادل 🤝');
    return;
  }

  toggleTurn();
}

function toggleTurn() {
  currentTeam = currentTeam === 1 ? 2 : 1;
  updateTurnUI();
  updateKeyboardColors();
}

function updateTurnUI() {
  document.getElementById('current-turn').textContent =
    `دور: فريق ${currentTeam} ${currentTeam === 1 ? '🔴' : '🔵'}`;
  document.querySelector('.team1').classList.toggle('active', currentTeam === 1);
  document.querySelector('.team2').classList.toggle('active', currentTeam === 2);
}

function updateKeyboardColors() {
  const colorMap = keyboardColors[currentTeam];
  document.querySelectorAll('.key').forEach(key => {
    const letter = key.textContent;
    key.className = 'key';
    if (colorMap[letter]) key.classList.add(colorMap[letter]);
  });
}

function showPopup(message) {
  document.getElementById('popup-content').innerHTML = `
    <p>${message}</p>
    <button onclick="location.reload()">🔄 لعب من جديد</button>
  `;
  document.getElementById('popup').style.display = 'flex';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitGuess();
  else if (e.key === 'Backspace') deleteLetter();
  else if (/^[؀-ۿ]$/.test(e.key)) handleKey(e.key);
});
