const keyboardLayout = [ 'جحخهعغفقثصض', 'طكمنتالبيسش', 'دظزوةىرئؤءذ' ];

let currentTeam = 1;
let word1 = '';
let word2 = '';
let attempts = 6;

let guesses1 = [];
let guesses2 = [];
let currentRow = [0, 0];
let currentCol = [0, 0];

let keyboardColors = { 1: {}, 2: {} };

function startGame() {
  word1 = document.getElementById('word1').value.trim();
  word2 = document.getElementById('word2').value.trim();
  attempts = parseInt(document.getElementById('attempts').value);

  if (!word1 || !word2 || word1.length !== word2.length) {
    alert('الكلمتان يجب أن تكونا بنفس الطول!');
    return;
  }

  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  guesses1 = Array.from({ length: attempts }, () => Array(word1.length).fill(''));
  guesses2 = Array.from({ length: attempts }, () => Array(word2.length).fill(''));

  createBoard('board1', word1.length, attempts);
  createBoard('board2', word2.length, attempts);
  renderKeyboard();
}

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
  const enterBtn = document.createElement('button');
  enterBtn.textContent = '⏎';
  enterBtn.className = 'key';
  enterBtn.onclick = () => submitGuess();

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '⌫';
  deleteBtn.className = 'key';
  deleteBtn.onclick = () => deleteLetter();

  controlsRow.appendChild(enterBtn);
  controlsRow.appendChild(deleteBtn);
  keyboardDiv.appendChild(controlsRow);

  updateKeyboardColors();
}

function updateKeyboardColors() {
  const colorMap = keyboardColors[currentTeam];
  document.querySelectorAll('.key').forEach(key => {
    const letter = key.textContent;
    key.className = 'key';
    if (colorMap[letter]) {
      key.classList.add(colorMap[letter]);
    }
  });
}

function handleKey(letter) {
  let row = currentRow[currentTeam - 1];
  let col = currentCol[currentTeam - 1];
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;

  if (col < word.length && row < attempts) {
    guesses[row][col] = letter;
    const cellId = `board${currentTeam}-cell-${row * word.length + col}`;
    document.getElementById(cellId).textContent = letter;
    currentCol[currentTeam - 1]++;
  }
}

function deleteLetter() {
  let row = currentRow[currentTeam - 1];
  let col = currentCol[currentTeam - 1];
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;

  if (col > 0) {
    currentCol[currentTeam - 1]--;
    guesses[row][currentCol[currentTeam - 1]] = '';
    const cellId = `board${currentTeam}-cell-${row * word.length + currentCol[currentTeam - 1]}`;
    document.getElementById(cellId).textContent = '';
  }
}

function submitGuess() {
  const row = currentRow[currentTeam - 1];
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;
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
    cell.style.backgroundColor = colors[i] === 'correct' ? '#6aaa64' : colors[i] === 'present' ? '#c9b458' : '#787c7e';
    cell.style.color = 'white';
  }

  updateKeyboardColors();

  if (guess === word) {
    alert(`فريق ${currentTeam} فاز! ✅`);
    return;
  }

  currentRow[currentTeam - 1]++;
  currentCol[currentTeam - 1] = 0;

  if (currentRow[0] >= attempts && currentRow[1] >= attempts) {
    alert('انتهت المحاولات! تعادل 🤝');
    return;
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

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    submitGuess();
  } else if (e.key === 'Backspace') {
    deleteLetter();
  } else if (/^[؀-ۿ]$/.test(e.key)) {
    handleKey(e.key);
  }
});
