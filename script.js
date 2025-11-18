// Demo mode script - no real Twitch connection
let players = [];
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
const manualMsgInput = document.getElementById("manualMsg");
const sendManualBtn = document.getElementById("sendManual");

/* Canvas */
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;
const CX = W/2, CY = H/2;
const R = Math.min(W,H)/2 - 8;

/* helpers */
function escapeHtml(str){
  return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}
function addChatUI(text, user){
  const el = document.createElement("div");
  el.className = "chatMessage";
  if(user){
    el.innerHTML = `<span class="user">${escapeHtml(user)}</span><span>${escapeHtml(text)}</span>`;
  } else {
    el.textContent = text;
  }
  // prepend because chatBox is column-reverse; newest at bottom visually but DOM top
  chatBox.prepend(el);

  // keep only 10 messages
  const msgs = chatBox.querySelectorAll(".chatMessage");
  if(msgs.length > 10){
    msgs[msgs.length - 1].remove();
  }
}

/* wheel drawing */
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

  // center disk
  ctx.beginPath();
  ctx.arc(CX,CY, R*0.18, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.stroke();
}

/* UI actions (demo start — no websocket) */
function extractChannel(input){
  if(!input) return "";
  input = input.trim();
  try {
    if(input.includes("twitch.tv/")){
      return input.split("twitch.tv/")[1].split(/[/?#]/)[0].toLowerCase();
    }
  } catch(e){}
  return input.toLowerCase();
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

  addChatUI("⚠️ وضع العرض التوضيحي (Demo) — اكتب رسائل في أسفل الشات أو اضغط J لإضافة مستخدم.", "SYSTEM");
});

examplesBtn.addEventListener("click", ()=>{ channelInput.value = "xqc"; });

backBtn.addEventListener("click", ()=>{
  // reset demo state
  players = [];
  chatBox.innerHTML = "";
  updatePlayersList();
  drawWheel();
  setupScreen.classList.add("active");
  gameScreen.classList.remove("active");
  channelInput.value = "";
  channelNameUI.textContent = "---";
  channelNameAside.textContent = "-";
});

resetPlayersBtn.addEventListener("click", ()=>{
  players = [];
  updatePlayersList();
  drawWheel();
});

clearChatBtn.addEventListener("click", ()=> chatBox.innerHTML = "");

/* manual send: if message is !join -> add player */
sendManualBtn.addEventListener("click", ()=>{
  const txt = manualMsgInput.value.trim();
  if(!txt) return;
  // treat send as from "Viewer" (يمكن تعديل الاسم)
  addChatUI(txt, "Viewer");
  manualMsgInput.value = "";

  if(txt.toLowerCase() === "!join"){
    // create simple unique name from counter
    const name = "viewer" + Math.floor(Math.random()*9000 + 100);
    if(!players.includes(name)){
      players.push(name);
      updatePlayersList();
      drawWheel();
    }
  }
});

/* keyboard J => add fake join (quick demo) */
window.addEventListener("keydown", (e)=>{
  if(e.key.toLowerCase() === "j"){
    const fake = "user" + Math.floor(Math.random()*999);
    if(!players.includes(fake)){
      players.push(fake);
      updatePlayersList();
      drawWheel();
      addChatUI("!join", fake);
    }
  }
});

/* spin logic with ease-out and pointer mapping */
function spinWheel(long = true){
  if(spinning || players.length < 2) return;
  spinning = true;

  const rounds = long ? randRange(8,12) : randRange(4,8);
  const extra = Math.random() * Math.PI * 2;
  const startRot = 0;
  const endRot = rounds * Math.PI * 2 + extra;
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
      const normalized = (cur % (Math.PI*2) + (Math.PI*2)) % (Math.PI*2);
      // pointer at top (-PI/2). compute angle relative to sector start
      const pointerAngle = (Math.PI*2) - (Math.PI/2) - normalized;
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

spinBtn.addEventListener("click", ()=> spinWheel(true));
fastSpinBtn.addEventListener("click", ()=> spinWheel(false));

/* util */
function randRange(a,b){ return a + Math.random()*(b-a); }
function easeOutCubic(x){ return 1 - Math.pow(1-x,3); }

function updatePlayersList(){
  playersList.textContent = players.length ? `Players: ${players.join(", ")}` : "Players: —";
}

function showResult(name){
  resultCard.textContent = `${name} OUT!`;
  overlay.classList.remove("hidden");
  setTimeout(()=> overlay.classList.add("hidden"), 1700);
}

/* initial render */
drawWheel(0);
updatePlayersList();
