targetWord = input.toLowerCase();
  wordLength = targetWord.length;
  document.getElementById("wordInputSection").style.display = "none";
  document.getElementById("boardContainer").style.display = "block";
  createBoard();
  createKeyboard("ضصثقفغعهخحجدشسيبلاتنمكطئءؤرﻻىةوزظ".split(""));
}

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < maxGuesses * wordLength; i++) {
    const box = document.createElement("div");
    box.className = "box";
    board.appendChild(box);
  }
}

function handleKeyPress(key) {
  if (currentGuess.length < wordLength) {
    currentGuess += key;
    updateBoard();
  }
}

function updateBoard() {
  const boxes = document.querySelectorAll(".box");
  for (let i = 0; i < currentGuess.length; i++) {
    boxes[currentRow * wordLength + i].textContent = currentGuess[i];
  }
}

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

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "⌫";
  deleteBtn.onclick = deleteLetter;

  const enterBtn = document.createElement("button");
  enterBtn.textContent = "⏎";
  enterBtn.onclick = submitGuess;

  const rowDiv = document.createElement("div");
  rowDiv.className = "keyboard-row";
  rowDiv.appendChild(deleteBtn);
  rowDiv.appendChild(enterBtn);
  keyboardContainer.appendChild(rowDiv);
}

function deleteLetter() {
  if (currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
    const boxes = document.querySelectorAll(".box");
    boxes[currentRow * wordLength + currentGuess.length].textContent = "";
  }
}

function submitGuess() {
  if (currentGuess.length !== wordLength) {
    alert("الكلمة غير مكتملة.");
    return;
  }

  const boxes = document.querySelectorAll(".box");
  for (let i = 0; i < wordLength; i++) {
    const box = boxes[currentRow * wordLength + i];
    if (currentGuess[i] === targetWord[i]) {
      box.classList.add("correct");
    } else if (targetWord.includes(currentGuess[i])) {
      box.classList.add("close");
    } else {
      box.classList.add("wrong");
    }
