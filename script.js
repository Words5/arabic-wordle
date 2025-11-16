// Twitch Chat Connection
const channelName = "اكتب_اسم_تشات_قناتك_هنا"; 

let players = [];

const ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

ws.onopen = () => {
    ws.send("PASS SCHMOOPIIE");
    ws.send("NICK justinfan12345");
    ws.send(`JOIN #${channelName}`);
};

ws.onmessage = (event) => {
    const msg = event.data;
    if (msg.includes("PRIVMSG")) {
        const username = msg.split("!")[0].replace(":", "");
        const text = msg.split("PRIVMSG")[1].split(":")[1];

        if (text.trim() === "!join" && !players.includes(username)) {
            players.push(username);
            updatePlayerList();
            drawWheel();
        }
    }
};

// UI
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

function drawWheel() {
    const arc = Math.PI * 2 / players.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < players.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * 50}, 80%, 50%)`;
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, arc * i, arc * (i + 1));
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(arc * i + arc / 2);
        ctx.fillStyle = "#fff";
        ctx.fillText(players[i], 120, 10);
        ctx.restore();
    }
}

function updatePlayerList() {
    document.getElementById("playersList").innerText = `Players: ${players.join(", ")}`;
}

// Spin button
document.getElementById("spinBtn").onclick = () => {
    if (players.length <= 1) return;
    const loserIndex = Math.floor(Math.random() * players.length);
    alert(`تم إقصاء: ${players[loserIndex]}`);
    players.splice(loserIndex, 1);
    drawWheel();
    updatePlayerList();
};
