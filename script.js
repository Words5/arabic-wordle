
let wordLength = 0;
let maxAttempts = 6;
let currentAttempt = 0;
let targetWord = "";

function createRow() {
  const board = document.getElementById('board');
  const row = document.createElement('div');
  row.classList.add('row');

  for (let i = 0; i < wordLength; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    row.appendChild(cell);
  }

  board.appendChild(row);
}

function startGame() {
  const input = document.getElementById('targetWordInput');
  targetWord = input.value.trim();
  if (!targetWord) {
    alert("رجاءً أدخل الكلمة السرية.");
    return;
  }

  wordLength = targetWord.length;
  document.getElementById('board').innerHTML = '';
  currentAttempt = 0;

  for (let i = 0; i < maxAttempts; i++) {
    createRow();
  }

  document.getElementById('guessSection').style.display = 'block';
  document.getElementById('wordInputSection').style.display = 'none';
  input.value = "";
  createKeyboard();
  document.getElementById('guessInput').focus();
}

function submitGuess() {
  const input = document.getElementById('guessInput');
  const guess = input.value.trim();

  if (guess.length !== wordLength) {
    alert("عدد الحروف يجب أن يكون " + wordLength);
    return;
  }

  if (currentAttempt >= maxAttempts) {
    alert("انتهت المحاولات!");
    return;
  }

  const row = document.querySelectorAll('.row')[currentAttempt];

  for (let i = 0; i < wordLength; i++) {
    const letter = guess[i];
    const box = row.children[i];
    box.textContent = letter;

    if (targetWord[i] === letter) {
      box.classList.add('correct');
      updateKeyboardColors(letter, 'correct');
    } else if (targetWord.includes(letter)) {
      box.classList.add('present');
      updateKeyboardColors(letter, 'present');
    } else {
      box.classList.add('absent');
      updateKeyboardColors(letter, 'absent');
    }
  }

  currentAttempt++;
  input.value = "";

  if (guess === targetWord) {
    setTimeout(() => alert("أحسنت! لقد ربحت!"), 100);
  } else if (currentAttempt === maxAttempts) {
    setTimeout(() => alert("انتهت المحاولات! الكلمة كانت: " + targetWord), 100);
  }
}

const arabicKeys = [
  ['د','ج','ح','خ','ه','ع','غ','ف','ق','ث','ص','ض'],
  ['ط','ك','م','ن','ت','ا','ل','ب','ي','س','ش'],
  ['ظ','ز','و','ة','ى','لا','ر','ؤ','ء','ئ']
];

function createKeyboard() {
  const keyboard = document.getElementById('keyboard');
  keyboard.innerHTML = '';

  arabicKeys.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('keyboard-row');
    row.forEach(letter => {
      const button = document.createElement('button');
      button.textContent = letter;
      button.classList.add('key');
      button.onclick = () => {
        const input = document.getElementById('guessInput');
        input.value += letter;
        input.focus();
      };
      button.id = 'key-' + letter;
      rowDiv.appendChild(button);
    });
    keyboard.appendChild(rowDiv);
  });

  const deleteRow = document.createElement('div');
  deleteRow.classList.add('keyboard-row');

  const delBtn = document.createElement('button');
  delBtn.textContent = '⌫';
  delBtn.classList.add('key');
  delBtn.onclick = () => {
    const input = document.getElementById('guessInput');
    input.value = input.value.slice(0, -1);
    input.focus();
  };
  deleteRow.appendChild(delBtn);
  keyboard.appendChild(deleteRow);
}

function updateKeyboardColors(letter, status) {
  const key = document.getElementById('key-' + letter);
  if (!key) return;

  if (status === 'correct') {
    key.classList.remove('present', 'absent');
    key.classList.add('correct');
  } else if (status === 'present' && !key.classList.contains('correct')) {
    key.classList.remove('absent');
    key.classList.add('present');
  } else if (!key.classList.contains('correct') && !key.classList.contains('present')) {
    key.classList.add('absent');
  }
}
