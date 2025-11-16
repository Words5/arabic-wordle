let players = [];
let ws;
let currentChannel = "";

// UI elements
const setupScreen = document.getElementById("setupScreen");
const gameUI = document.getElementById("gameUI");
const chatBox = document.getElementById("chatBox");
const spinBtn = document.getElementById("spinBtn");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

// Extract channel from URL or direct name
function extractChannel(input) {
    input = input.trim().toLowerCase();
    
    if (input.startsWith("https://") || input.startsWith("http://")) {
        const parts = input.split("/");
        return parts[parts.length - 1];   // last section in link
    }
    
    return input;
}

// Start button
document.getElementById("startBtn").onclick = () => {
    const input = document.getElementById("channelInput").value;
    currentChannel = extractChannel(input);

    if (!currentChannel) return alert("❗ الرجاء إدخال اسم أو رابط قناة صحيح");

    startChatConnection(currentChannel);

    setupScreen.style.display = "none";
    gameUI.style.display = "flex";
};

// Return to setup screen
document.getElementById("backBtn").onclick = () => {
    if (ws) ws.close();
    players = [];
    chatBox.innerHTML = "";
    document.getElementById("playersList").innerText = "";
    setupScreen.style.display = "block";
    gameUI.style.display = "none";
};

// Reset players only
document.getElementById("resetPlayersBtn").onclick = () => {
    players = [];
    drawWheel();
    updatePlayersList();
};

// Clear chat only
document.getElementById("clearChatBtn").onclick = () => {
    chatBox.innerHTML = "";
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

// Draw wheel visualization
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
    alert(`❌ تم إقصاء: ${players[kickedIndex]}`);
    players.splice(kickedIndex, 1);
    drawWheel();
    updatePlayersList();
};
