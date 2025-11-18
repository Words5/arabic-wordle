const wheelCanvas = document.getElementById("wheelCanvas");
const ctx = wheelCanvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const resetPlayersBtn = document.getElementById("resetPlayersBtn");
const backBtn = document.getElementById("backBtn");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const removeLastBtn = document.getElementById("removeLastBtn");
const playerInput = document.getElementById("playerInput");

const turnModal = document.getElementById("turnModal");
const turnPlayerName = document.getElementById("turnPlayerName");
const lastMention = document.getElementById("lastMention");
const rerollBtn = document.getElementById("rerollBtn");
const manualEliminateBtn = document.getElementById("manualEliminateBtn");
const eliminationHistory = document.getElementById("eliminationHistory");

const winnerModal = document.getElementById("winnerModal");
const winnerName = document.getElementById("winnerName");
const closeWinnerBtn = document.getElementById("closeWinnerBtn");

const chatBox = document.getElementById("chatBox");

let players = [];
let eliminationLog = [];

/* رسم العجلة */
function drawWheel() {
    ctx.clearRect(0,0,500,500);
    if(players.length === 0) return;
    if(players.length === 1) return;

    const arc = Math.PI * 2 / players.length;

    for(let i = 0; i < players.length; i++){
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

/* تحديث قائمة اللاعبين */
function updatePlayersList(){
    const list = document.getElementById("playersListDisplay");
    list.innerHTML = "";
    players.forEach(p=>{
        const li = document.createElement("li");
        li.textContent = p;
        list.appendChild(li);
    });
}

/* الشات */
function addChat(msg){
    const el = document.createElement("div");
    el.classList.add("chat-msg");
    el.textContent = msg;
    chatBox.appendChild(el);

    const msgs = chatBox.querySelectorAll(".chat-msg");
    if(msgs.length > 10){
        msgs[0].classList.add("removing");
        setTimeout(()=>msgs[0].remove(),350);
    }
}

/* إضافة لاعب */
addPlayerBtn.onclick = ()=>{
    let name = playerInput.value.trim();
    if(!name) return;
    if(players.includes(name)) return alert("اسم موجود مسبقاً");

    players.push(name);
    playerInput.value = "";
    drawWheel();
    updatePlayersList();
};

/* حذف آخر لاعب */
removeLastBtn.onclick = ()=>{
    players.pop();
    drawWheel();
    updatePlayersList();
};

/* دوران واقعي */
spinBtn.onclick = ()=>{
    if(players.length <= 1) return;

    let finalAngle = Math.random() * 360 + 720;
    let currentAngle = 0;
    let speed = 15;
    const friction = 0.15;

    const run = setInterval(()=>{
        currentAngle += speed;
        speed -= friction;

        if(speed <= 0){
            clearInterval(run);
            startTurn(finalAngle);
        }

        wheelCanvas.style.transform = `rotate(${currentAngle}deg)`;
    },20);
};

/* بدء نافذة الدور المنشن */
function startTurn(finalAngle){
    const arc = 360 / players.length;
    const normalized = (360 - (finalAngle % 360)) % 360;
    const index = Math.floor(normalized / arc);

    const currentPlayer = players[index];

    turnPlayerName.textContent = `الدور الآن على: ${currentPlayer}`;
    lastMention.textContent = "لا توجد منشن حتى الآن";
    turnModal.style.display = "flex";

    // استقبال منشن بالشات
    function handleMention(msg){
        const mention = msg.trim();
        if(!mention.startsWith("@")) return false;
        const mentionedName = mention.substring(1);
        if(players.includes(mentionedName)){
            lastMention.textContent = mention;
            eliminatePlayer(mentionedName);
            return true;
        }
        return false;
    }

    // محاكاة استقبال الرسائل
    const chatListener = (event) => {
        const msg = event.detail; // نفترض يتم إرسال رسالة هنا
        // فقط اللاعب الحالي يمكنه المنشن
        if(handleMention(msg)){
            document.removeEventListener("newChatMsg", chatListener);
        }
    };

    document.addEventListener("newChatMsg", chatListener);

    // أزرار الستريمر
    rerollBtn.onclick = ()=>{
        turnModal.style.display="none";
        spinBtn.click();
        document.removeEventListener("newChatMsg", chatListener);
    }
    manualEliminateBtn.onclick = ()=>{
        const name = prompt("اختر اللاعب لإقصائه من القائمة:");
        if(name && players.includes(name)){
            eliminatePlayer(name);
        }
        document.removeEventListener("newChatMsg", chatListener);
    }
}

/* إقصاء لاعب */
function eliminatePlayer(name){
    players.splice(players.indexOf(name),1);
    eliminationLog.push(name);
    updatePlayersList();
    drawWheel();

    const li = document.createElement("li");
    li.textContent = name;
    eliminationHistory.appendChild(li);

    turnModal.style.display = "none";

    if(players.length===1){
        showWinner(players[0]);
    }
}

/* نافذة الفوز */
function showWinner(name){
    winnerName.textContent = `🥇 الفائز: ${name}`;
    winnerModal.style.display = "flex";
}
closeWinnerBtn.onclick = ()=> winnerModal.style.display="none";

/* زر الرجوع */
backBtn.onclick = ()=> window.location.href="index.html";
