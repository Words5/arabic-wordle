const keyboardLayout = ['جحخهعغفقثصض', 'طكمنتالبيسش', 'دظزوةىرئؤءذ'];
let currentTeam = 1;

let word1 = localStorage.getItem('word1') || '';
let word2 = localStorage.getItem('word2') || '';
let attempts = parseInt(localStorage.getItem('attempts')) || 6;

let guesses1 = Array.from({ length: attempts }, () => Array(word1.length).fill(''));
let guesses2 = Array.from({ length: attempts }, () => Array(word2.length).fill(''));
let currentRow = [0, 0];
let currentCol = [0, 0];
let keyboardColors = { 1: {}, 2: {} };

function createBoard(containerId, wordLength, attempts) {
  const board = document.getElementById(containerId);
  board.style.gridTemplateColumns = `repeat(${wordLength}, 40px)`;
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

  const controlsRow = document.createElement('div');
  ['⏎', '⌫'].forEach(symbol => {
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.textContent = symbol;
    btn.onclick = symbol === '⏎' ? submitGuess : deleteLetter;
    controlsRow.appendChild(btn);
  });
  keyboardDiv.appendChild(controlsRow);

  updateKeyboardColors();
}

function updateKeyboardColors() {
  const colorMap = keyboardColors[currentTeam];
  document.querySelectorAll('.key').forEach(key => {
    const letter = key.textContent;
    key.className = 'key';
    if (colorMap[letter]) key.classList.add(colorMap[letter]);
  });
}

function handleKey(letter) {
  const i = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;
  let row = currentRow[i], col = currentCol[i];

  if (col < word.length && row < attempts) {
    guesses[row][col] = letter;
    document.getElementById(`board${currentTeam}-cell-${row * word.length + col}`).textContent = letter;
    currentCol[i]++;
  }
}

function deleteLetter() {
  const i = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;
  let row = currentRow[i], col = currentCol[i];

  if (col > 0) {
    currentCol[i]--;
    guesses[row][currentCol[i]] = '';
    document.getElementById(`board${currentTeam}-cell-${row * word.length + currentCol[i]}`).textContent = '';
  }
}

function submitGuess() {
  const i = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;
  const row = currentRow[i];
  const guess = guesses[row].join('');

  if (guess.length !== word.length) return;

  const colors = Array(word.length).fill('absent');
  const used = Array(word.length).fill(false);

  for (let j = 0; j < word.length; j++) {
    if (guess[j] === word[j]) {
      colors[j] = 'correct';
      used[j] = true;
      keyboardColors[currentTeam][guess[j]] = 'correct';
    }
  }

  for (let j = 0; j < word.length; j++) {
    if (colors[j] !== 'correct') {
      for (let k = 0; k < word.length; k++) {
        if (!used[k] && guess[j] === word[k]) {
          colors[j] = 'present';
          used[k] = true;
          if (keyboardColors[currentTeam][guess[j]] !== 'correct') {
            keyboardColors[currentTeam][guess[j]] = 'present';
          }
          break;
        }
      }
    }
  }

  for (let j = 0; j < word.length; j++) {
    const cell = document.getElementById(`board${currentTeam}-cell-${row * word.length + j}`);
    cell.style.backgroundColor = colors[j] === 'correct' ? '#6aaa64' : colors[j] === 'present' ? '#c9b458' : '#787c7e';
    cell.style.color = 'white';
  }

  updateKeyboardColors();

  if (guess === word) {
    alert(`فريق ${currentTeam} فاز! ✅`);
    return;
  }

  currentRow[i]++;
  currentCol[i] = 0;

  if (currentRow[i] >= attempts && currentRow[0] >= attempts && currentRow[1] >= attempts) {
    alert('انتهت المحاولات! تعادل.');
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

window.onload = () => {
  createBoard('board1', word1.length, attempts);
  createBoard('board2', word2.length, attempts);
  renderKeyboard();
};
