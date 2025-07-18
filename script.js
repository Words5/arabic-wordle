const keyboardLayout = ['جحخهعغفقثصض', 'طكمنتالبيسش', 'دظزوةىرئؤءذ'];
let currentTeam = 1;
let word1 = '', word2 = '', attempts = 6;
let guesses1 = [], guesses2 = [];
let currentRow = [0, 0], currentCol = [0, 0];
let keyboardColors = { 1: {}, 2: {} };

function startGame() {
  word1 = document.getElementById('word1').value.trim();
  word2 = document.getElementById('word2').value.trim();
  attempts = parseInt(document.getElementById('attempts').value);

  if (!word1 || !word2 || word1.length !== word2.length) {
    alert("كلمتين متساوية الطول مطلوبة.");
    return;
  }

  guesses1 = Array.from({ length: attempts }, () => Array(word1.length).fill(''));
  guesses2 = Array.from({ length: attempts }, () => Array(word2.length).fill(''));

  document.getElementById('page1').style.display = 'none';
  document.getElementById('page2').style.display = 'block';

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
  const container = document.getElementById('keyboard');
  container.innerHTML = '';
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    [...row].forEach(letter => {
      const key = document.createElement('button');
      key.textContent = letter;
      key.className = 'key';
      key.onclick = () => handleKey(letter);
      rowDiv.appendChild(key);
    });
    container.appendChild(rowDiv);
  });

  const ctrlRow = document.createElement('div');
  const enter = document.createElement('button');
  enter.textContent = '⏎';
  enter.className = 'key';
  enter.onclick = () => submitGuess();
  const del = document.createElement('button');
  del.textContent = '⌫';
  del.className = 'key';
  del.onclick = () => deleteLetter();
  ctrlRow.appendChild(enter);
  ctrlRow.appendChild(del);
  container.appendChild(ctrlRow);

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
  const i = currentTeam - 1;
  const word = currentTeam === 1 ? word1 : word2;
  const guesses = currentTeam === 1 ? guesses1 : guesses2;
  let row = currentRow[i], col = currentCol[i];
  if (col < word.length && row < attempts) {
    guesses[row][col] = letter;
    const cellId = `board${currentTeam}-cell-${row * word.length + col}`;
    document.getElementById(cellId).textContent = letter;
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
    const cellId = `board${currentTeam}-cell-${row * word.length + currentCol[i]}`;
    document.getElementById(cellId).textContent = '';
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
    const cellId = `board${currentTeam}-cell-${row * word.length + j}`;
    const cell = document.getElementById(cellId);
    cell.style.backgroundColor =
      colors[j] === 'correct' ? '#6aaa64' :
      colors[j] === 'present' ? '#c9b458' :
      '#787c7e';
    cell.style.color = 'white';
  }

  updateKeyboardColors();

  if (guess === word) {
    alert(`فريق ${currentTeam} فاز! 🎉`);
    return;
  }

  currentRow[i]++;
  currentCol[i] = 0;

  if (currentRow[0] >= attempts && currentRow[1] >= attempts) {
    alert("انتهت المحاولات! تعادل.");
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

document.addEventListener('keydown', (e) => {
  if (document.getElementById('page2').style.display !== 'block') return;
  if (e.key === 'Enter') {
    submitGuess();
  } else if (e.key === 'Backspace') {
    deleteLetter();
  } else if (/^[؀-ۿ]$/.test(e.key)) {
    handleKey(e.key);
  }
});
