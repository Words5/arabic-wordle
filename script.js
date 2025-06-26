let targetWord = "";
let currentTry = 0;
let maxTries = 6;
let currentFilledIndex = 0;

function startGame() {
  const input = document.getElementById("secretWord");
  targetWord = input.value.trim();
  if (targetWord === "") return;

  document.querySelector(".secret-input").style.display = "none";
  document.getElementById("game").style.display = "block";
  createBoard();
  createKeyboard();
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${targetWord.length}, 1fr)`;
  for (let i = 0; i < targetWord.length * maxTries; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.letter = "";
    board.appendChild(cell);
  }
  currentFilledIndex = 0;
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  const rows = [
    "جحخهعغفقثصض",
    "طكمنتالبيسش",
    "دظزوةىرئؤءذ"
  ];

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    for (let letter of row) {
      const key = document.createElement("div");
      key.className = "key";
      key.textContent = letter;
      key.onclick = () => handleKeyPress(letter);
      rowDiv.appendChild(key);
    }
    keyboard.appendChild(rowDiv);
  });

  const controlRow = document.createElement("div");

  const backspaceKey = document.createElement("div");
  backspaceKey.className = "key";
  backspaceKey.textContent = "⌫";
  backspaceKey.onclick = () => handleBackspace();
  controlRow.appendChild(backspaceKey);

  const enterKey = document.createElement("div");
  enterKey.className = "key";
  enterKey.textContent = "⏎";
  enterKey.onclick = () => checkGuess();
  controlRow.appendChild(enterKey);

  keyboard.appendChild(controlRow);
}

function handleKeyPress(letter) {
  if (currentFilledIndex >= (currentTry + 1) * targetWord.length) return;
  const cellIndex = currentTry * targetWord.length + (currentFilledIndex % targetWord.length);
  const cell = document.getElementsByClassName("cell")[cellIndex];
  cell.textContent = letter;
  cell.dataset.letter = letter;
  currentFilledIndex++;
  updateInputFromBoard();
}

function handleBackspace() {
  if (currentFilledIndex <= currentTry * targetWord.length) return;
  currentFilledIndex--;
  const cellIndex = currentTry * targetWord.length + (currentFilledIndex % targetWord.length);
  const cell = document.getElementsByClassName("cell")[cellIndex];
  cell.textContent = "";
  cell.dataset.letter = "";
  updateInputFromBoard();
}

function updateInputFromBoard() {
  let guess = "";
  for (let i = 0; i < targetWord.length; i++) {
    const cell = document.getElementsByClassName("cell")[currentTry * targetWord.length + i];
    guess += cell.dataset.letter || "";
  }
  document.getElementById("guessInput").value = guess;
}

function checkGuess(guess) {
  const colors = Array(secretWord.length).fill("");
  const tempTarget = secretWord.split("");
  const letterCount = {};

  // حساب عدد مرات كل حرف في الكلمة السرية
  for (let letter of secretWord) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
  }

  // الخطوة 1: تحديد الحروف الصحيحة (أخضر)
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secretWord[i]) {
      colors[i] = "correct";
      letterCount[guess[i]]--;
      tempTarget[i] = null; // نحذفه عشان ما نحسبه مرتين
    }
  }

  // الخطوة 2: تحديد الحروف الموجودة في مكان غلط (أصفر) أو مكررة (أزرق)
  for (let i = 0; i < guess.length; i++) {
    if (colors[i] === "") {
      if (letterCount[guess[i]] > 0) {
        colors[i] = "present"; // أصفر
        letterCount[guess[i]]--;
      } else {
        colors[i] = "repeat"; // أزرق
      }
    }

  return colors;
}
  }

  for (let i = 0; i < guess.length; i++) {
    if (colors[i] === "") {
      const index = tempTarget.indexOf(guess[i]);
      if (index !== -1) {
        colors[i] = "repeat";
        tempTarget[index] = null;
      } else {
        colors[i] = "wrong";
      }
    }
  }

  for (let i = 0; i < guess.length; i++) {
    const cell = document.getElementsByClassName("cell")[startIdx + i];
    cell.textContent = guess[i];
    cell.classList.add(colors[i]);
    updateKeyColor(guess[i], colors[i]);
  }

  currentTry++;
  guessInput.value = "";

  if (guess === targetWord) {
    setTimeout(() => showResult(true), 100);
  } else if (currentTry >= maxTries) {
    setTimeout(() => showResult(false), 100);
  }
}

function updateKeyColor(letter, status) {
  const keys = document.getElementsByClassName("key");
  for (let key of keys) {
    if (key.textContent === letter) {
      key.classList.remove("correct", "wrong-place", "wrong", "repeat");
      key.classList.add(status);
    }
  }
}

function showResult(won) {
  const resultBox = document.getElementById("resultMessage");
  if (won) {
    resultBox.innerHTML = `🎉 لقد فزت! <br> الكلمة هي: <strong>${targetWord}</strong>`;
  } else {
    resultBox.innerHTML = `❌ انتهت المحاولات. الكلمة كانت: <strong>${targetWord}</strong>`;
  }
  resultBox.style.display = "block";
  document.getElementById("restartBtn").style.display = "inline-block";
}
