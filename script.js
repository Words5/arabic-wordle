// عناصر DOM
const setup = document.getElementById("setup");
const game = document.getElementById("game");
const startBtn = document.getElementById("startBtn");
const channelInput = document.getElementById("channelInput");
const backBtn = document.getElementById("backBtn");
const spinBtn = document.getElementById("spinBtn");
const resetPlayersBtn = document.getElementById("resetPlayersBtn");
const chatBox = document.getElementById("chatBox");
const playersList = document.getElementById("playersList");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

let players = [];

/* الانتقال بعد الضغط */
startBtn.addEventListener("click", () => {
    if (!channelInput.value.trim()) return alert("اكتب اسم قناة");
    setup.classList.add("hidden");
    game.classList.remove("hidden");
});

/* رجوع */
backBtn.addEventListener("click", () => {
    game.classList.add("hidden");
    setup.classList.remove("hidden");
    chatBox.innerHTML = "";
    players = [];
    drawWheel();
    updatePlayersList();
});

/* مثال استقبال رسائل (ليس حقيقي، للعرض فقط) */
function fakeChatMessage(msg) {
    const el = document.createElement("div");
    el.classList.add("chat-msg");
    el.textContent = msg;

    chatBox.appendChild(el);

    // حذف الرسائل بعد تجاوز 10 رسائل
    const msgs = chatBox.querySelectorAll(".chat-msg");
    if (msgs.length > 10) {
        const old = msgs[0];
        old.classList.add("removing");

        setTimeout(() => old.remove(), 350);
    }
}

/* زر الدوران */
spinBtn.addEventListener("click", () => {
    if (players.length <= 1) return;
    const kickedIndex = Math.floor(Math.random() * players.length);
    fakeChatMessage(`🛑 تم إقصاء: ${players[kickedIndex]}`);
    players.splice(kickedIndex, 1);
    drawWheel();
    updatePlayersList();
});

/* زر إعادة اللاعبين */
resetPlayersBtn.addEventListener("click", () => {
    players = [];
    drawWheel();
    updatePlayersList();
});

/* عرض اللاعبين */
function updatePlayersList() {
    playersList.textContent = `Players: ${players.join(", ")}`;
}

/* الرسم */
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (players.length === 0) return;

    const arc = Math.PI * 2 / players.length;

    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * 70}, 75%, 55%)`;
        ctx.moveTo(210,210);
        ctx.arc(210,210,210,arc*i,arc*(i+1));
        ctx.fill();

        ctx.save();
        ctx.translate(210,210);
        ctx.rotate(arc*i + arc/2);
        ctx.fillStyle = "#fff";
        ctx.fillText(players[i], 115, 5);
        ctx.restore();
    }
}

/* تجربة رسائل تلقائية */
setInterval(() => {
    fakeChatMessage("📩 رسالة تجريبية");
}, 1500);
