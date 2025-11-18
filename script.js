// DOM elements
const spinBtn = document.getElementById("spinBtn");
const resetPlayersBtn = document.getElementById("resetPlayersBtn");
const backBtn = document.getElementById("backBtn");
const chatBox = document.getElementById("chatBox");
const playersList = document.getElementById("playersList");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

let players = [];

/* Chat message system */
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

/* Random demo chat event */
setInterval(() => addChat("📩 رسالة تجريبية"), 1600);

/* Wheel draw */
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (players.length === 0) return;

    const arc = Math.PI * 2 / players.length;

    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * 55}, 75%, 55%)`;
        ctx.moveTo(210,210);
        ctx.arc(210,210,210,arc*i,arc*(i+1));
        ctx.fill();

        ctx.save();
        ctx.translate(210,210);
        ctx.rotate(arc*i + arc/2);
        ctx.fillStyle = "#fff";
        ctx.fillText(players[i], 120, 6);
        ctx.restore();
    }
}

/* Players list update */
function updatePlayersList() {
    playersList.textContent = `اللاعبين: ${players.join(", ")}`;
}

/* Spin */
spinBtn.addEventListener("click", () => {
    if (players.length <= 1) return;
    const i = Math.floor(Math.random() * players.length);
    addChat(`🚫 تم إقصاء: ${players[i]}`);
    players.splice(i, 1);
    drawWheel();
    updatePlayersList();
});

/* Reset */
resetPlayersBtn.addEventListener("click", () => {
    players = [];
    drawWheel();
    updatePlayersList();
});

/* Back reload */
backBtn.addEventListener("click", () => window.location.reload());
