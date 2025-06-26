function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";

  const rows = [
    "ضصثقفغعهخحج",
    "شسيبلاتنمكط",
    "زرذدأءؤئوىة"
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

  // زر الحذف
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
}function handleKeyPress(letter) {
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
