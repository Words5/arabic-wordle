let players = [];
let ws;
let spinning = false;
let currentChannel = "";

const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const chatBox = document.getElementById("chatBox");
const spinBtn = document.getElementById("spinBtn");
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlayResult");

// Extract channel name even if input is a link
function extractChannel(input) {
    input = input.trim().toLowerCase();
    if (input.includes("twitch.tv/")) {
        return input.split("twitch.tv/")[1].split("/")[0];
    }
    return input;
}

document.getElementById("startBtn").onclick = () => {
    const input = document.getElementById("channelInput").value;
    currentChannel = extractChannel(input);

    if (!currentChannel) return alert("يرجى إدخال اسم قناة أو رابط صحيح");

    startChatConnection(currentChannel);

    setupScreen.classList.remove("active");
    gameScreen.classList.add("active");
};

document.getElementById("backBtn").onclick = () => {
    ws.close();
    players = [];
    chatBox.innerHTML = "";
    drawWheel();
    setupScreen.classList.add("active");
    gameScreen.classList.remove("active");
};

document.getElementById("resetPlayersBtn").onclick = () => {
    players = [];
    drawWheel();
    updatePlayersList();
};

document.getElementById("clearChatBtn").onclick = () => chatBox.innerHTML = "";

function startChatConnection(channel) {
    ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");

    ws.onopen = () => {
        ws.send("PASS SCHMOOPIIE");
        ws.send("NICK justinfan12345");
        ws.send(`JOIN #${channel}`);
        addChatUI(`✔️ تم الاتصال بـ #${channel}`);
    };

    ws.onmessage = (event) => {
        const raw = event.data;
        if (raw.includes("PRIVMSG")) {
            const username = raw.split("!")[0].replace(":", "");
            const message = raw.split("PRIVMSG")[1].split(":")[1];

            addChatUI(`${username}: ${message}`);

            if (message.trim().toLowerCase() === "!join" && !players.includes(username)) {
                players.push(username);
                drawWheel();
                updatePlayersList();
            }
        }
    };
}

function addChatUI(msg) {
    const el = document.createElement("div");
    el.className = "chatMessage";
    el.innerText = msg;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function drawWheel(rotation = 0) {
    const size = players.length;
    const arc = Math.PI * 2 / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (size === 0) return;

    for (let i = 0; i < size; i++) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${i * 50}, 85%, 55%)`;
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, arc * i + rotation, arc * (i + 1) + rotation);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(arc * i + arc / 2 + rotation);
        ctx.fillStyle = "#fff";
        ctx.font = "16px Tahoma";
        ctx.fillText(players[i], 120, 10);
        ctx.restore();
    }
}

spinBtn.onclick = () => {
    if (spinning || players.length < 2) return;
    spinning = true;

    let rotation = Math.random() * Math.PI * 6 + Math.PI * 10;
    const duration = 3000;
    const start = performance.now();

    function animate(t) {
        const progress = (t - start) / duration;
        if (progress < 1) {
            drawWheel(rotation * easeOut(progress));
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            const loserIndex = Math.floor(Math.random() * players.length);
            showResult(players[loserIndex]);
            players.splice(loserIndex, 1);
            drawWheel();
            updatePlayersList();
        }
    }
    requestAnimationFrame(animate);
};

function easeOut(x) {
    return 1 - Math.pow(1 - x, 3);
}

function updatePlayersList() {
    document.getElementById("playersList").innerText = `Players: ${players.join(", ")}`;
}

function showResult(name) {
    overlay.innerHTML = `❌ ${name} OUT!`;
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.add("hidden"), 1800);
        }
