const spinBtn = document.getElementById("spinBtn");
const resetPlayersBtn = document.getElementById("resetPlayersBtn");
const backBtn = document.getElementById("backBtn");
const chatBox = document.getElementById("chatBox");
const playersList = document.getElementById("playersList");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

let players = [];

function addChat(msg) {
    const el = document.createElement("div");
    el.classList.add("chat-msg");
    el.textContent = msg;
    chatBox.appendChild(el);

    const msgs = chatBox.querySelectorAll(".chat-msg");
    if (msgs.length > 10) {
        msgs[0].classList.add("removing");
        setTimeout(() => msgs[0].remove(), 350);
    }
}

setInterval(() => addChat("📩 رسالة تجريبية"), 1600);

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (players.length === 0) return;

    const arc = Math.PI * 2 / players.length;
    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * 55}, 75%, 55%)`;
        ctx.moveTo(250,250);
        ctx.arc(250,250,250,arc*i,arc*(i+1));
        ctx.fill();

        ctx.save();
        ctx.translate(250,250);
        ctx.rotate(arc*i + arc/2);
        ctx.fillStyle = "#fff";
        ctx.fillText(players[i], 120, 6);
        ctx.restore();
    }
}
function updatePlayersList() {
    playersList.textContent = `اللاعبين: ${players.join("، ")}`;
}
spinBtn.addEventListener("click", () => {
    if (players.length <= 1) return;
    const i = Math.floor(Math.random() * players.length);
    addChat(`🚫 إقصاء: ${players[i]}`);
    players.splice(i, 1);
    drawWheel();
    updatePlayersList();
});
resetPlayersBtn.addEventListener("click", () => {
    players = [];
    drawWheel();
    updatePlayersList();
});
backBtn.addEventListener("click", () => window.location.href = "index.html");
