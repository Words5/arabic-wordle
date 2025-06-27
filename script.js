let targetWord = "";
let currentTry = 0;
let maxTries = 6;
let currentFilledIndex = 0;

function startGame() {
  const input = document.getElementById("secretWord");
  targetWord = input.value.trim();
  if (targetWord === "" || /[^ء-ي]/.test(targetWord)) return;

  document.querySelector(".special-input").style.display = "none";
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
    rowDiv.style.display = "flex";
    rowDiv.style.justifyContent = "center";
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
  controlRow.style.display = "flex";
  controlRow.style.justifyContent = "center";

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
  if (currentTry >= maxTries) return;
  const limit = (currentTry + 1) * targetWord.length;
  if (currentFilledIndex >= limit) return;

  const cellIndex = currentTry * targetWord.length + (currentFilledIndex % targetWord.length);
  const cell = document.getElementsByClassName("cell")[cellIndex];
  cell.textContent = letter;
  cell.dataset.letter = letter;
  currentFilledIndex++;
}

function handleBackspace() {
  if (currentFilledIndex <= currentTry * targetWord.length) return;
  currentFilledIndex--;
  const cellIndex = currentTry * targetWord.length + (currentFilledIndex % targetWord.length);
  const cell = document.getElementsByClassName("cell")[cellIndex];
  cell.textContent = "";
  cell.dataset.letter = "";
}

function getGuessFromBoard() {
  let guess = "";
  for (let i = 0; i < targetWord.length; i++) {
    const cell = document.getElementsByClassName("cell")[currentTry * targetWord.length + i];
    guess += cell.dataset.letter || "";
  }
  return guess;
}

function checkGuess() {
  const guess = getGuessFromBoard();
  if (guess.length !== targetWord.length) return;

  const startIdx = currentTry * targetWord.length;
  const tempTarget = targetWord.split("");
  const guessLetters = guess.split("");
  const colors = Array(guess.length).fill("");

  // صح في المكان
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === tempTarget[i]) {
      colors[i] = "correct";
      tempTarget[i] = null;
    }
  }

  // موجود لكن بمكان خطأ
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

  // تلوين الخانات
  for (let i = 0; i < guess.length; i++) {
    const cell = document.getElementsByClassName("cell")[startIdx + i];
    cell.classList.add(colors[i]);
    updateKeyColor(guess[i], colors[i]);
  }

  currentTry++;

  if (guess === targetWord) {
    setTimeout(() => showResult(true), 300);
  } else if (currentTry >= maxTries) {
    setTimeout(() => showResult(false), 300);
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
