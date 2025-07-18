let word1 = "", word2 = "", attempts = 6;
let turn = 1;
let currentRow1 = 0, currentRow2 = 0;
let board1 = [], board2 = [];
let currentInput = "";

const arabicKeys = [
  'ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج',
  'د','ش','س','ي','ب','ل','ا','ت','ن','م',
  'ك','ط','ئ','ء','ؤ','ر','ى','ة','و','ز','ظ',
  'حذف','إرسال'
];

function startGame() {
  word1 = document.getElementById("word1").value.trim();
  word2 = document.getElementById("word2").value.trim();
  attempts = parseInt(document.getElementById("attempts").value);

  if (![5,6].includes(word1.length) || ![5,6].includes(word2.length)) {
    alert("الكلمات يجب أن تكون من 5 إلى 6 حروف");
    return;
  }

  document.querySelector(".config").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  createBoards();
  renderKeyboard();
  updateTurnDisplay();
}

function createBoards() {
  const b1 = document.getElementById("board1");
  const b2 = document.getElementById("board2");
  b1.style.gridTemplateColumns = `repeat(${word1.length}, 50px)`;
  b2.style.gridTemplateColumns = `repeat(${word2.length}, 50px)`;

  for (let i = 0; i < attempts; i++) {
    let row1 = [], row2 = [];
    for (let j = 0; j < word1.length; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      b1.appendChild(cell);
      row1.push(cell);
    }
    for (let j = 0; j < word2.length; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      b2.appendChild(cell);
      row2.push(cell);
    }
    board1.push(row1);
    board2.push(row2);
  }
}

function renderKeyboard() {
  const container = document.getElementById("keyboard");
  container.innerHTML = "";
  arabicKeys.forEach(char => {
    const btn = document.createElement("button");
    btn.textContent = char;
    btn.className = "key";
    btn.onclick = () => handleKeyPress(char);
    container.appendChild(btn);
  });
}

function handleKeyPress(key) {
  if (key === "حذف") {
    currentInput = currentInput.slice(0, -1);
  } else if (key === "إرسال") {
    submitGuess();
    return;
  } else {
    const targetWord = turn === 1 ? word1 : word2;
    if (currentInput.length < targetWord.length) {
      currentInput += key;
    }
  }
  updateCurrentRowDisplay();
}

function updateCurrentRowDisplay() {
  const board = turn === 1 ? board1 : board2;
  const row = turn === 1 ? currentRow1 : currentRow2;
  const targetWord = turn === 1 ? word1 : word2;
  for (let i = 0; i < targetWord.length; i++) {
    board[row][i].textContent = currentInput[i] || "";
  }
}

function submitGuess() {
  const targetWord = turn === 1 ? word1 : word2;
  const board = turn === 1 ? board1 : board2;
  const row = turn === 1 ? currentRow1 : currentRow2;

  if (currentInput.length !== targetWord.length) return;

  for (let i = 0; i < targetWord.length; i++) {
    const cell = board[row][i];
    const letter = currentInput[i];
    cell.textContent = letter;
    if (letter === targetWord[i]) {
      cell.classList.add("correct");
      colorKey(letter, "correct");
    } else if (targetWord.includes(letter)) {
      cell.classList.add("present");
      colorKey(letter, "present");
    } else {
      cell.classList.add("absent");
      colorKey(letter, "absent");
    }
  }

  if (currentInput === targetWord) {
    document.getElementById("result").textContent =
      `🎉 فاز فريق ${turn === 1 ? "1 🔴" : "🔵 2"}!`;
    disableKeyboard();
    return;
  }

  if (turn === 1) currentRow1++;
  else currentRow2++;

  if (currentRow1 >= attempts && currentRow2 >= attempts) {
    document.getElementById("result").textContent = "❌ انتهت المحاولات، لم يفز أحد.";
    disableKeyboard();
    return;
  }

  currentInput = "";
  turn = turn === 1 ? 2 : 1;
  updateTurnDisplay();
}

function colorKey(letter, status) {
  const keys = document.querySelectorAll(".key");
  keys.forEach(k => {
    if (k.textContent === letter) {
      if (status === "correct") k.className = "key correct";
      else if (status === "present" && !k.classList.contains("correct")) k.className = "key present";
      else if (!k.classList.contains("correct") && !k.classList.contains("present")) k.className = "key absent";
    }
  });
}

function updateTurnDisplay() {
  document.getElementById("current-turn").textContent =
    "دور: " + (turn === 1 ? "فريق 1 🔴" : "🔵 فريق 2");

  document.querySelector(".team1").classList.toggle("active", turn === 1);
  document.querySelector(".team2").classList.toggle("active", turn === 2);
  updateCurrentRowDisplay();
}

function disableKeyboard() {
  document.querySelectorAll(".key").forEach(k => k.disabled = true);
      }
