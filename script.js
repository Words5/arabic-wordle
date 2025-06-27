
let secretWord = "";
let currentGuess = "";
let currentRow = 0;
let board = [];
let maxTries = 6;
const colors = {
  correct: "#00cc66",  // أخضر
  repeat: "#3399ff",   // أزرق
  present: "#ffd500",  // أصفر
  wrong: "#444"        // رمادي
};

function startGame() {
  const input = document.getElementById("secretWord");
  secretWord = input.value.trim();
  if (!secretWord || secretWord.length < 2) return alert("أدخل كلمة صحيحة");

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("game").style.display = "flex";
  document.getElementById("guessInput").focus();
  currentGuess = "";
  board = [];
  currentRow = 0;
  generateBoard(secretWord.length, maxTries);
  generateKeyboard();
}

function generateBoard(length, tries) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  for (let i = 0; i < tries; i++) {
    const row = document.createElement("div");
    row.className = "board-row";
    for (let j = 0; j < length; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }
    boardDiv.appendChild(row);
  }
}

function handleGuessTyping() {
  const input = document.getElementById("guessInput");
  const value = input.value.trim();
  if (value.length <= secretWord.length) {
    currentGuess = value;
    updateBoardRow(currentGuess);
  }
  if (value.length === secretWord.length) {
    checkGuess();
    input.value = "";
  }
}

function updateBoardRow(guess) {
  const row = document.querySelectorAll(".board-row")[currentRow];
  if (!row) return;
  const cells = row.querySelectorAll(".cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = guess[i] || "";
  }
}

function generateKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  const rows = [
    "جحخهعغفقثصض",
    "طكمنتالبيسش",
    "دظزوةىرئؤءذ⌫⏎"
  ];

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    for (let char of row) {
      const btn = document.createElement("button");
      btn.textContent = char;
      btn.className = "key";
      btn.onclick = () => handleKeyPress(char);
      rowDiv.appendChild(btn);
    }
    keyboard.appendChild(rowDiv);
  });
}

function handleKeyPress(char) {
  const input = document.getElementById("guessInput");
  if (char === "⌫") {
    currentGuess = currentGuess.slice(0, -1);
  } else if (char === "⏎") {
    if (currentGuess.length === secretWord.length) {
      checkGuess();
      currentGuess = "";
    }
  } else {
    if (currentGuess.length < secretWord.length) {
      currentGuess += char;
    }
  }
  input.value = currentGuess;
  updateBoardRow(currentGuess);
}

function checkGuess() {
  const guess = currentGuess;
  const resultColors = new Array(secretWord.length).fill(colors.wrong);
  const used = new Array(secretWord.length).fill(false);

  // أخضر: صح بالمكان
  for (let i = 0; i < secretWord.length; i++) {
    if (guess[i] === secretWord[i]) {
      resultColors[i] = colors.correct;
      used[i] = true;
    }
  }

  // أزرق: تكرار غير صحيح بالمكان
  for (let i = 0; i < secretWord.length; i++) {
    if (resultColors[i] !== colors.correct) {
      for (let j = 0; j < secretWord.length; j++) {
        if (!used[j] && guess[i] === secretWord[j]) {
          resultColors[i] = colors.repeat;
          used[j] = true;
          break;
        }
      }
    }
  }

  // أصفر: صحيح لكن ظهر مسبقًا باللون الأزرق
  for (let i = 0; i < secretWord.length; i++) {
    if (resultColors[i] === colors.wrong && secretWord.includes(guess[i])) {
      resultColors[i] = colors.present;
    }
  }

  colorRow(resultColors);
  updateKeyboardColors(guess, resultColors);

  if (guess === secretWord) {
    showResult(true);
  } else {
    currentRow++;
    if (currentRow >= maxTries) {
      showResult(false);
    }
  }
}

function colorRow(colorsArray) {
  const row = document.querySelectorAll(".board-row")[currentRow];
  if (!row) return;
  const cells = row.querySelectorAll(".cell");
  cells.forEach((cell, idx) => {
    cell.style.background = colorsArray[idx];
    cell.style.border = "2px solid #fff";
  });
}

function updateKeyboardColors(guess, resultColors) {
  const keys = document.querySelectorAll(".key");
  keys.forEach(key => {
    for (let i = 0; i < guess.length; i++) {
      if (key.textContent === guess[i]) {
        key.style.background = resultColors[i];
        key.style.color = "#fff";
      }
    }
  });
}

function showResult(win) {
  const msg = document.getElementById("resultMessage");
  const restartBtn = document.getElementById("restartBtn");
  msg.innerHTML = win ? `🎉 لقد فزت! <br><span style="font-size:1.5rem;color:#00ffd5">${secretWord}</span>` :
                        `❌ انتهت المحاولات! الكلمة كانت:<br><span style="font-size:1.5rem;color:#ff6666">${secretWord}</span>`;
  restartBtn.style.display = "inline-block";

  if (win && typeof confetti === 'function') {
    confetti({ particleCount: 150, spread: 100 });
  }
}
