// ----- STATE -----
let players = [
  { id: 0, name: "Player 1", score: 0, colour: "#3b82f6" },
  { id: 1, name: "Player 2", score: 0, colour: "#ef4444" }
];
let nextId = 2;

// ----- DOM REFS -----
const panel = document.getElementById("settingsPanel");
const toggleBtn = document.getElementById("settingsToggleBtn");
const closeBtn = document.getElementById("closeSettingsBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const board = document.getElementById("board");
const playersSettings = document.getElementById("playersSettings");
const addBtn = document.getElementById("addPlayerBtn");
const resetBtn = document.getElementById("resetBtn");
const sizeSlider = document.getElementById("sizeSlider");
const sizeLabel = document.getElementById("sizeLabel");
const effects = document.getElementById("effects");

// ----- SETTINGS PANEL TOGGLE -----
function closePanel() { panel.classList.remove("open"); }
toggleBtn.onclick = () => panel.classList.toggle("open");
closeBtn.onclick = closePanel;

// ----- FULLSCREEN -----
fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen?.();
  }
};

// ----- TEXT SIZE -----
sizeSlider.oninput = (e) => {
  const val = e.target.value;
  document.documentElement.style.setProperty("--scale", val / 100);
  sizeLabel.textContent = val + "%";
};

// ----- RENDER BOARD (only the scoreboard) -----
function renderBoard() {
  if (players.length === 0) {
    board.innerHTML = `<div id="emptyMsg">No players – add one!</div>`;
    return;
  }
  let html = "";
  players.forEach(p => {
    html += `
      <div class="player-board" data-id="${p.id}">
        <h1 style="color:${p.colour}">${p.name}</h1>
        <div class="score" style="color:${p.colour}">${p.score}</div>
      </div>
    `;
  });
  board.innerHTML = html;
}

// ----- RENDER SETTINGS (panel) -----
function renderSettings() {
  if (players.length === 0) {
    playersSettings.innerHTML = `<p style="opacity:0.5; margin:8px 0;">No players yet.</p>`;
    return;
  }
  let html = "";
  players.forEach(p => {
    html += `
      <div class="player-setting" data-id="${p.id}">
        <div class="row">
          <input type="text" class="pname" value="${p.name}" placeholder="Name" />
          <input type="color" class="pcolour" value="${p.colour}" />
          <button class="remove-btn" data-id="${p.id}">✕</button>
        </div>
        <div class="row">
          <button class="minus-btn" data-id="${p.id}">−1</button>
          <button class="plus-btn" data-id="${p.id}">+1</button>
        </div>
      </div>
    `;
  });
  playersSettings.innerHTML = html;

  // Attach event listeners to the newly created controls
  document.querySelectorAll('.player-setting').forEach(card => {
    const id = parseInt(card.dataset.id);
    const p = players.find(p => p.id === id);
    if (!p) return;

    const nameInput = card.querySelector('.pname');
    const colourInput = card.querySelector('.pcolour');
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    const removeBtn = card.querySelector('.remove-btn');

    nameInput.oninput = () => {
      p.name = nameInput.value.trim() || "Player";
      renderBoard(); // only board, keep settings intact
    };
    colourInput.oninput = () => {
      p.colour = colourInput.value;
      renderBoard(); // only board, keep settings intact
    };
    minusBtn.onclick = () => changeScore(p.id, -1);
    plusBtn.onclick = () => changeScore(p.id, 1);
    removeBtn.onclick = () => removePlayer(p.id);
  });
}

// ----- RENDER BOTH -----
function renderAll() {
  renderBoard();
  renderSettings();
}

// ----- SCORE CHANGE -----
function changeScore(id, delta) {
  const p = players.find(p => p.id === id);
  if (!p) return;
  p.score += delta;

  renderBoard();

  const scoreEl = document.querySelector(`.player-board[data-id="${id}"] .score`);
  if (scoreEl) {
    scoreEl.classList.remove('pop');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('pop');
  }

  const boardEl = document.querySelector(`.player-board[data-id="${id}"]`);
  if (boardEl) {
    const scoreRect = boardEl.querySelector('.score').getBoundingClientRect();
    showFloatingEffect(scoreRect, delta);
  }
}

// ----- FLOATING EFFECT -----
function showFloatingEffect(rect, delta) {
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale')) || 1;
  const gap = 20 * scale;
  const textWidth = 28 * scale;

  const div = document.createElement('div');
  div.className = 'fx ' + (delta > 0 ? 'up' : 'down');
  div.textContent = delta > 0 ? '+1' : '-1';

  if (delta > 0) {
    div.style.left = (rect.right + gap) + 'px';
  } else {
    div.style.left = (rect.left - gap - textWidth) + 'px';
  }
  div.style.top = rect.top + 'px';

  effects.appendChild(div);
  setTimeout(() => div.remove(), 600);
}

// ----- ADD / REMOVE PLAYERS -----
function addPlayer() {
  const newPlayer = {
    id: nextId++,
    name: `Player ${nextId - 1}`,
    score: 0,
    colour: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`
  };
  players.push(newPlayer);
  renderAll();
  panel.classList.add('open');
}

function removePlayer(id) {
  if (players.length <= 1) {
    if (!confirm("Remove the last player? Board will be empty.")) return;
  }
  players = players.filter(p => p.id !== id);
  renderAll();
}

addBtn.onclick = addPlayer;

// ----- RESET SCORES -----
resetBtn.onclick = () => {
  players.forEach(p => p.score = 0);
  renderBoard();
};

// ----- INIT -----
renderAll();
sizeSlider.value = 100;
sizeLabel.textContent = "100%";
document.documentElement.style.setProperty("--scale", 1);