let word1 = "", word2 = "", attempts = 6;
let turn = 1;
let currentRow1 = 0, currentRow2 = 0;
let maxLength = 6;
let board1 = [], board2 = [];

function startGame() {
  word1 = document.getElementById("word1").value.trim();
  word2 = document.getElementById("word2").value.trim();
  attempts = parseInt(document.getElementById("attempts").value);

  if (![5,6].includes(word1.length) || ![5,6].includes(word2.length)) {
    alert("الكلمات يجب أن تكون من 5 إلى 6 حروف");
    return;
  }

  maxLength = Math.max(word1.length, word2.length);
  document.querySelector(".config").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  generateBoards();
  updateTurnDisplay();
}

function generateBoards() {
  const board1El = document.getElementById("board1");
  const board2El = document.getElementById("board2");

  board1El.style.gridTemplateColumns = `repeat(${word1.length}, 50px)`;
  board2El.style.gridTemplateColumns = `repeat(${word2.length}, 50px)`;

  for (let i = 0; i < attempts; i++) {
    let row1 = [], row2 = [];
    for (let j = 0; j < word1.length; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      board1El.appendChild(cell);
      row1.push(cell);
    }
    for (let j = 0; j < word2.length; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      board2El.appendChild(cell);
      row2.push(cell);
    }
    board1.push(row1);
    board2.push(row2);
  }
}

function updateTurnDisplay() {
  document.getElementById("current-turn").textContent =
    "دور: " + (turn === 1 ? "فريق 1 🔴" : "🔵 فريق 2");
}

function submitGuess() {
  const input = document.getElementById("guessInput");
  const guess = input.value.trim();

  if (turn === 1 && guess.length !== word1.length) {
    alert(`كلمة فريق 1 يجب أن تكون ${word1.length} حروف`);
    return;
  }
  if (turn === 2 && guess.length !== word2.length) {
    alert(`كلمة فريق 2 يجب أن تكون ${word2.length} حروف`);
    return;
  }

  const word = turn === 1 ? word1 : word2;
  const board = turn === 1 ? board1 : board2;
  const row = turn === 1 ? currentRow1 : currentRow2;

  if (row >= attempts) {
    alert("انتهت المحاولات");
    return;
  }

  for (let i = 0; i < word.length; i++) {
    board[row][i].textContent = guess[i];
    if (guess[i] === word[i]) {
      board[row][i].classList.add("correct");
    } else if (word.includes(guess[i])) {
      board[row][i].classList.add("present");
    } else {
      board[row][i].classList.add("absent");
    }
  }

  if (guess === word) {
    document.getElementById("result").textContent =
      `🎉 فاز فريق ${turn === 1 ? "1 🔴" : "🔵 2"}!`;
    disableInput();
    return;
  }

  if (turn === 1) currentRow1++;
  else currentRow2++;

  if (currentRow1 >= attempts && currentRow2 >= attempts) {
    document.getElementById("result").textContent = "❌ انتهت المحاولات، لم يفز أحد.";
    disableInput();
    return;
  }

  turn = turn === 1 ? 2 : 1;
  updateTurnDisplay();
  input.value = "";
  input.focus();
}

function disableInput() {
  document.getElementById("guessInput").disabled = true;
}
