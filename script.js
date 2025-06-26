let currentFilledIndex = 0;

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
  currentFilledIndex = 0;
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
    if (currentFilledIndex >= maxTries * targetWord.length) return;
    const row = currentTry * targetWord.length;
    const cell = document.getElementsByClassName("cell")[row + (currentFilledIndex % targetWord.length)];
    cell.textContent = keys[i];
    cell.dataset.letter = keys[i];
    currentFilledIndex++;
    updateInputFromBoard();
  };
  keyboard.appendChild(key);
}

};
    keyboard.appendChild(key);
  }
}


function checkGuess() {
  const guessInput = document.getElementById("guessInput");
  let guess = guessInput.value.trim();
  if (guess.length !== targetWord.length) return;

  const startIdx = currentTry * targetWord.length;
  const tempTarget = targetWord.split("");
  const guessLetters = guess.split("");
  const colors = Array(guess.length).fill("");

  // مرحلة 1: تحديد التطابق الصحيح
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === tempTarget[i]) {
      colors[i] = "correct";
      tempTarget[i] = null;
    }
  }

  // مرحلة 2: تحديد تكرار الحرف
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
  document.getElementById('restartBtn').style.display = 'inline-block';
}


function updateInputFromBoard() {
  let guess = "";
  for (let i = 0; i < targetWord.length; i++) {
    const cell = document.getElementsByClassName("cell")[currentTry * targetWord.length + i];
    guess += cell.dataset.letter || "";
  }
  document.getElementById("guessInput").value = guess;
}



function restartGame() {
  location.reload();
}

// تحديث نهاية اللعبة لتظهر زر إعادة اللعب
function endGame(message) {
  setTimeout(() => {
    alert(message);
    document.getElementById("restartSection").style.display = "block";
  }, 100);
}

// إعادة تنسيق الكيبورد لثلاث صفوف مثل الجوال
function createKeyboard(keys) {
  const keyboardContainer = document.getElementById("keyboard");
  keyboardContainer.innerHTML = "";

  const rows = [
    keys.slice(0, 10),
    keys.slice(10, 19),
    keys.slice(19)
  ];

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    row.forEach(key => {
      const button = document.createElement("button");
      button.textContent = key;
      button.onclick = () => handleKeyPress(key);
      rowDiv.appendChild(button);
    });
    keyboardContainer.appendChild(rowDiv);
  });
}
