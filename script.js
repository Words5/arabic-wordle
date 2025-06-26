
let targetWord = "";
let currentGuess = "";
let maxTries = 6;
let currentTry = 0;

function setTargetWord() {
  const input = document.getElementById("targetWordInput");
  targetWord = input.value.trim();
  if (targetWord === "") return;
  input.value = "";
  document.getElementById("wordInputSection").style.display = "none";
  document.getElementById("boardContainer").style.display = "block";
  createBoard();
  createKeyboard();
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < maxTries * targetWord.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    board.appendChild(cell);
  }
}

function createKeyboard() {
  const keys = "ضصثقفغعهخحجچشسيبلاتنمكطزرذدأءؤئوىة";
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  for (let i = 0; i < keys.length; i++) {
    const key = document.createElement("div");
    key.classList.add("key");
    key.textContent = keys[i];
    key.onclick = () => {
      const guessInput = document.getElementById("guessInput");
      guessInput.value += keys[i];
    };
    keyboard.appendChild(key);
  }
}

function checkGuess() {
  const guessInput = document.getElementById("guessInput");
  let guess = guessInput.value.trim();
  if (guess.length !== targetWord.length) return;

  const startIdx = currentTry * targetWord.length;
  for (let i = 0; i < guess.length; i++) {
    const cell = document.getElementsByClassName("cell")[startIdx + i];
    cell.textContent = guess[i];
    if (guess[i] === targetWord[i]) {
      cell.style.backgroundColor = "green";
      updateKeyColor(guess[i], "correct");
    } else if (targetWord.includes(guess[i])) {
      cell.style.backgroundColor = "goldenrod";
      updateKeyColor(guess[i], "wrong-place");
    } else {
      cell.style.backgroundColor = "darkred";
      updateKeyColor(guess[i], "wrong");
    }
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
      key.classList.remove("correct", "wrong-place", "wrong");
      key.classList.add(status);
    }
  }
}

function showResult(won) {
  const resultBox = document.getElementById('resultMessage');
  if (won) {
    resultBox.innerHTML = "🎉 لقد فزت! 🎉<br>الكلمة هي: <strong>" + targetWord + "</strong>";
    resultBox.style.color = "#0f0";
  } else {
    resultBox.innerHTML = "❌ انتهت المحاولات!<br>الكلمة هي: <strong>" + targetWord + "</strong>";
    resultBox.style.color = "#f00";
  }
  resultBox.style.display = "block";
}
