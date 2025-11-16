let players = [];
let ws;

// UI elements
const setupScreen = document.getElementById("setupScreen");
const gameUI = document.getElementById("gameUI");
const chatBox = document.getElementById("chatBox");
const spinBtn = document.getElementById("spinBtn");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

// Start button
document.getElementById("startBtn").onclick = () => {
    const channelName = document.getElementById("channelInput").value.trim().toLowerCase();
    if (!channelName) return alert("ادخل اسم قناة صحيح");

    startChatConnection(channelName);

    setupScreen.style.display = "none";
    gameUI.style.display = "flex";
};

// Connect to Twitch chat
function startChatConnection(channel) {
    ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    ws.onopen = () => {
        ws.send("PASS SCHMOOPIIE");
        ws.send("NICK justinfan12345");
        ws.send(`JOIN #${channel}`);
        addChatUI(`✔️ Connected to #${channel}`);
    };

    ws.onmessage = (event) => {
        const raw = event.data;
        if (raw.includes("PRIVMSG")) {
            const username = raw.split("!")[0].replace(":", "");
            const message = raw.split("PRIVMSG")[1].split(":")[1];

            addChatUI(`${username}: ${message}`);

            if (message.trim() === "!join" && !players.includes(username)) {
                players.push(username);
                drawWheel();
                updatePlayersList();
            }
        }
    };
}

// Add chat message to UI
function addChatUI(msg) {
    const el = document.createElement("div");
    el.className = "chatMessage";
    el.innerText = msg;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Draw wheel
function drawWheel() {
    const arc = Math.PI * 2 / players.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * 50}, 80%, 50%)`;
        ctx.moveTo(225, 225);
        ctx.arc(225, 225, 225, arc * i, arc * (i + 1));
        ctx.lineTo(225, 225);
        ctx.fill();

        ctx.save();
        ctx.translate(225, 225);
        ctx.rotate(arc * i + arc / 2);
        ctx.fillStyle = "#fff";
        ctx.fillText(players[i], 120, 10);
        ctx.restore();
    }
}

// Display list
function updatePlayersList() {
    document.getElementById("playersList").innerText = `Players: ${players.join(", ")}`;
}

// Spin button
spinBtn.onclick = () => {
    if (players.length <= 1) return;
    const kickedIndex = Math.floor(Math.random() * players.length);
    alert(`تم إقصاء: ${players[kickedIndex]}`);
    players.splice(kickedIndex, 1);
    drawWheel();
    updatePlayersList();
};
