/* Pro HUD Edition - script.js
   - يدعم إدخال اسم أو رابط القناة
   - نافذة شات HUD على اليمين
   - دوران واقعي للعجلة (easeOut)
   - بدون أصوات
*/

/* State */
let players = [];
let ws = null;
let spinning = false;
let currentChannel = "";

/* DOM */
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

/* Canvas */
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const CX = W/2, CY = H/2;
const R = Math.min(W,H)/2 - 8;

/* Helpers */
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

function addChatUI(text, user){
  const el = document.createElement("div");
  el.className = "chatMessage";
  if(user){
    el.innerHTML = `<span class="user">${user}</span><span>${escapeHtml(text)}</span>`;
  } else {
    el.textContent = text;
  }
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(str){
  return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

/* DRAW WHEEL */
function drawWheel(rotation = 0){
  ctx.clearRect(0,0,W,H);
  const n = Math.max(1, players.length);
  const arc = (Math.PI*2) / n;

  // rim glow
  const g = ctx.createRadialGradient(CX, CY, R*0.3, CX, CY, R);
  g.addColorStop(0, "rgba(255,255,255,0.02)");
  g.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(CX,CY,R+6,0,Math.PI*2);ctx.fill();

  for(let i=0;i<n;i++){
    const start = arc*i + rotation;
    const end = arc*(i+1) + rotation;
    // color band
    ctx.beginPath();
    ctx.moveTo(CX,CY);
    ctx.arc(CX,CY,R,start,end);
    ctx.closePath();
    ctx.fillStyle = `hsl(${(i*360/n)+10} 80% 50%)`;
    ctx.fill();

    // labels
    ctx.save();
    ctx.translate(CX,CY);
    ctx.rotate(start + arc/2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px Tahoma";
    ctx.textAlign = "center";
    ctx.fillText(players[i] ? players[i] : "-", R*0.58, 8);
    ctx.restore();
  }

  // center disk
  ctx.beginPath();
  ctx.arc(CX,CY, R*0.18, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.stroke();
}

/* Twitch IRC (قراءة الشات فقط باستخدام anonymous) */
function startChatConnection(channel){
  if(ws){
    try{ ws.close(); } catch(e){}
    ws = null;
  }
  addChatUI(`✔️ جاري الاتصال بـ ${channel}`);
  ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
  ws.addEventListener("open", ()=>{
    ws.send("PASS SCHMOOPIIE");
    ws.send("NICK justinfan12345");
    ws.send(`JOIN #${channel}`);
    addChatUI("✔️ متصل بنجاح");
  });

  ws.addEventListener("message", (evt)=>{
    const raw = evt.data;
    if(typeof raw !== "string") return;
    if(raw.startsWith("PING")){
      ws.send("PONG :tmi.twitch.tv");
      return;
    }
    if(raw.includes("PRIVMSG")){
      try{
        const username = raw.split("!")[0].replace(":","");
        const message = raw.split("PRIVMSG")[1].split(":")[1];
        addChatUI(message, username);
        // handle !join
        if(message.trim().toLowerCase() === "!join"){
          if(!players.includes(username)){
            players.push(username);
            updatePlayersList();
            drawWheel();
          }
        }
      }catch(e){}
    }
  });

  ws.addEventListener("close", ()=>{
    addChatUI("⚠️ اتصال الشات انقطع");
  });
}

/* UI Actions */
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

examplesBtn.addEventListener("click", ()=>{
  channelInput.value = "xqc"; // مثال
});

backBtn.addEventListener("click", ()=>{
  if(ws){ try{ ws.close(); } catch(e){} ws = null; }
  players = []; chatBox.innerHTML=""; updatePlayersList(); drawWheel();
  setupScreen.classList.add("active");
  gameScreen.classList.remove("active");
  channelInput.value = "";
  channelNameUI.textContent = "---";
  channelNameAside.textContent = "-";
});

resetPlayersBtn.addEventListener("click", ()=>{
  players = []; updatePlayersList(); drawWheel();
});

clearChatBtn.addEventListener("click", ()=>{
  chatBox.innerHTML = "";
});

/* spin logic: realistic ease out + pick loser by pointer index */
function spinWheel(long = true){
  if(spinning || players.length < 2) return;
  spinning = true;

  // total rotation (randomized)
  const rounds = long ? randRange(8,12) : randRange(4,8);
  const extra = Math.random() * Math.PI*2;
  const startRot = 0;
  const endRot = rounds * Math.PI*2 + extra;
  const dur = long ? 4200 : 2200;
  const start = performance.now();

  function frame(now){
    const t = Math.min(1, (now - start)/dur);
    const eased = easeOutCubic(t);
    const cur = startRot + (endRot - startRot) * eased;
    drawWheel(cur);

    if(t < 1){
      requestAnimationFrame(frame);
    } else {
      // determine index at pointer (pointer at angle -PI/2 relative canvas)
      // we map rotation to a sector index:
      const normalized = (cur % (Math.PI*2) + (Math.PI*2)) % (Math.PI*2);
      // pointer points at top (angle = -PI/2). The sector index = floor((angleOffset)/arc)
      const pointerAngle = (Math.PI*2) - (Math.PI/2) - normalized; // angle from 0 to 2pi
      const arc = (Math.PI*2) / players.length;
      let idx = Math.floor((pointerAngle % (Math.PI*2)) / arc);
      idx = ((idx % players.length) + players.length) % players.length;
      const loser = players[idx];
      showResult(loser);
      // remove loser
      players.splice(idx,1);
      updatePlayersList();
      drawWheel(0);
      spinning = false;
    }
  }
  requestAnimationFrame(frame);
}

spinBtn.addEventListener("click", ()=>spinWheel(true));
fastSpinBtn.addEventListener("click", ()=>spinWheel(false));

/* utilities */
function randRange(a,b){ return a + Math.random()*(b-a); }
function easeOutCubic(x){ return 1 - Math.pow(1-x,3); }

function updatePlayersList(){
  playersList.textContent = players.length? `Players: ${players.join(", ")}` : "Players: —";
}

/* result overlay */
function showResult(name){
  resultCard.textContent = `${name} OUT!`;
  overlay.classList.remove("hidden");
  setTimeout(()=> overlay.classList.add("hidden"), 1700);
}

/* manual send (ظهوري فقط داخل الـ HUD) */
document.getElementById("sendManual").addEventListener("click", ()=>{
  const txt = document.getElementById("manualMsg").value.trim();
  if(!txt) return;
  addChatUI(txt, "Streamer");
  document.getElementById("manualMsg").value = "";
});

/* initial draw */
drawWheel(0);

/* fallback: keyboard shortcut J => add test user (for easy demo) */
window.addEventListener("keydown", (e)=>{
  if(e.key.toLowerCase() === "j"){
    const fake = "user" + Math.floor(Math.random()*999);
    if(!players.includes(fake)){ players.push(fake); updatePlayersList(); drawWheel(); addChatUI("!join", fake); }
  }
});
