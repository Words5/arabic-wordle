function startGame() {
  const word1 = document.getElementById('word1').value.trim();
  const word2 = document.getElementById('word2').value.trim();
  const attempts = parseInt(document.getElementById('attempts').value);

  if (!word1 || !word2 || word1.length !== word2.length) {
    alert('تأكد من إدخال كلمتين متساويتين في الطول!');
    return;
  }

  localStorage.setItem('word1', word1);
  localStorage.setItem('word2', word2);
  localStorage.setItem('attempts', attempts);

  window.location.href = 'game.html';
}
