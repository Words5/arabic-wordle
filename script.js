let players = [];
let ws = null;
let spinning = false;
let currentChannel = "";

const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const channelInput = document.getElementById("channelInput");
const startBtn = document.getElementById("startBtn");
const examplesBtn = document.getElementById("examplesBtn");
const backBtn = document.getElementById("backBtn");
const resetPlayersBtn = document.getElementById("resetPlayersBtn");
const clearChatBtn = document.getElementById("clearChatBtn");
const channelNameUI = document.getElementById("channelNameUI");
const channelNameAside = document.getElementById("channelNameAside");

const chatBox = document.getElementById("chatBox");
const playersList = document.getElementById("playersList");
const spinBtn = document.getElementById("spinBtn");
const fastSpinBtn = document.getElementById("fastSpinBtn");
const overlay = document.getElementById("overlayResult");
const resultCard = document.getElementById("resultCard");

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const CX = W/2, CY = H/2;
const R = Math.min(W,H)/2 - 8;

function extractChannel(input){
  if(!input) return "";
  input = input.trim();
  try {
    if(input.includes("twitch.tv/")){
      const u = input.split("twitch.tv/")[1].split(/[/?#]/)[0];
      return u.toLowerCase();
    }
  } catch(e){}
  return input.toLowerCase();
}

function escapeHtml(str){
  return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

function addChatUI(text, user){
  const el = document.createElement("div");
  el.className = "chatMessage";
  if(user){
    el.innerHTML = `<span class="user">${user}</span><span>${escapeHtml(text)}</span>`;
  } else {
    el.textContent = text;
  }
  chatBox.prepend(el);

  const msgs = chatBox.querySelectorAll(".chatMessage");
  if(msgs.length > 10){ msgs[msgs.length-1].remove(); }
}

function drawWheel(rotation = 0){
  ctx.clearRect(0,0,W,H);
  const n = Math.max(1, players.length);
  const arc = (Math.PI*2) / n;

  const g = ctx.createRadialGradient(CX, CY, R*0.3, CX, CY, R);
  g.addColorStop(0, "rgba(255,255,255,0.02)");
  g.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(CX,CY,R+6,0,Math.PI*2);ctx.fill();

  for(let i=0;i<n;i++){
    const start = arc*i + rotation;
    const end = arc*(i+1) + rotation;
    ctx.beginPath();
    ctx.moveTo(CX,CY);
    ctx.arc(CX,CY,R,start,end);
    ctx.closePath();
    ctx.fillStyle = `hsl(${(i*360/n)+10} 80% 50%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(CX,CY);
    ctx.rotate(start + arc/2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Tahoma";
    ctx.textAlign = "center";
    ctx.fillText(players[i] ? players[i] : "-", R*0.58, 8);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(CX,CY, R*0.18, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.stroke();
}

function startChatConnection(channel){
  if(ws){ try{ ws.close(); }catch(e){} ws=null; }
  addChatUI(`✔️ جاري الاتصال بـ ${channel}`);
  ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
  ws.addEventListener("open", ()=>{
    ws.send("PASS SCHMOOPIIE");
    ws.send("NICK justinfan12345");
    ws.send(`JOIN #${channel}`);
    addChatUI("✔️ متصل بنجاح");
  });

  ws.addEventListener("message",(evt)=>{
    const raw = evt.data;
    if(typeof raw!=="string") return;
    if(raw.startsWith("PING")){ ws.send("PONG :tmi.twitch.tv"); return; }
    if(raw.includes("PRIVMSG")){
      try{
        const username = raw.split("!")[0].replace(":","");
        const message = raw.split("PRIVMSG")[1].split(":")[1];
        addChatUI(message, username);
        if(message.trim().toLowerCase()==="!join" && !players.includes(username)){
          players.push(username);
          updatePlayersList();
          drawWheel();
        }
      }catch(e){}
    }
  });
  ws.addEventListener("close",()=>{ addChatUI("⚠️ اتصال الشات انقطع"); });
}

startBtn.addEventListener("click", ()=>{
  const val = channelInput.value;
  const ch = extractChannel(val);
  if(!ch){ alert("ادخل اسم القناة أو رابطها"); return; }
  currentChannel = ch;
  channelNameUI.textContent = ch;
  channelNameAside.textContent = ch;
  setupScreen.classList.remove("active");
  gameScreen.classList.add("active");
  startChatConnection(ch);
});

examplesBtn.addEventListener("click", ()=>{ channelInput.value="xqc"; });

backBtn.addEventListener("click", ()=>{
  if(ws){ try{ ws.close(); }catch(e){} ws=null; }
  players=[]; chatBox.innerHTML=""; updatePlayersList(); drawWheel();
  setupScreen.classList.add("active");
  gameScreen.classList.remove("active");
  channelInput.value="";
  channelNameUI.textContent="---"; channelNameAside.textContent="-";
});

resetPlayersBtn.addEventListener("click", ()=>{
  players=[]; updatePlayersList(); drawWheel();
});

clearChatBtn.addEventListener("click", ()=>chatBox.innerHTML="");

function spinWheel(long=true){
  if(spinning || players.length<2) return;
  spinning=true;
  const rounds = long ? Math.random()*4+8 : Math.random()*4+4;
  const extra = Math.random()*Math.PI*2;
  const startRot=0;
