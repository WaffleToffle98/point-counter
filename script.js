let teams = [
    { name: "Team 1", score: 0, colour: "#3b82f6" },
    { name: "Team 2", score: 0, colour: "#ef4444" }
];

// DOM elements
const panel = document.getElementById("settingsPanel");
const toggleBtn = document.getElementById("settingsToggleBtn");
const closeBtn = document.getElementById("closeSettingsBtn");
const s1 = document.getElementById("score1");
const s2 = document.getElementById("score2");

// Settings inputs
const team1NameInput = document.getElementById("team1NameInput");
const team2NameInput = document.getElementById("team2NameInput");
const team1ColourInput = document.getElementById("team1Colour");
const team2ColourInput = document.getElementById("team2Colour");
const sizeSlider = document.getElementById("sizeSlider");
const sizeLabel = document.getElementById("sizeLabel");

// ------------------------------------------------------------
// 1. OPEN / CLOSE SETTINGS PANEL
// ------------------------------------------------------------
function closePanel() {
    panel.classList.remove("open");
}

toggleBtn.onclick = () => {
    panel.classList.toggle("open");
};

closeBtn.onclick = closePanel;

// ------------------------------------------------------------
// 2. TEXT SIZE SLIDER
// ------------------------------------------------------------
sizeSlider.oninput = (e) => {
    const val = e.target.value;
    document.documentElement.style.setProperty("--scale", val / 100);
    sizeLabel.textContent = val + "%";
};

// ------------------------------------------------------------
// 3. SCORE CHANGE
// ------------------------------------------------------------
function change(i, val) {
    teams[i].score = Math.max(0, teams[i].score + val);
    render();

    const el = i === 0 ? s1 : s2;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");

    // pass the score element directly
    showFloatingEffect(el, val);
}

// ------------------------------------------------------------
// 4. FLOATING +1 / -1 – beside the SCORE, with dynamic spacing
// ------------------------------------------------------------
function showFloatingEffect(el, val) {
    const rect = el.getBoundingClientRect();

    // read the current scale from CSS
    const scale = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--scale").trim()
    ) || 1;

    // base gap increases with the slider to prevent clipping
    const gap = 20 * scale;
    // approximate width of the floating text ("+1" or "-1") – it scales too
    const textWidth = 28 * scale;

    const div = document.createElement("div");
    div.className = "fx " + (val > 0 ? "up" : "down");
    div.textContent = val > 0 ? "+1" : "-1";

    if (val > 0) {
        // place it to the RIGHT of the score
        div.style.left = (rect.right + gap) + "px";
    } else {
        // place it to the LEFT of the score
        div.style.left = (rect.left - gap - textWidth) + "px";
    }

    // vertically align it with the score's top edge
    div.style.top = rect.top + "px";

    document.getElementById("effects").appendChild(div);
    setTimeout(() => div.remove(), 600);
}

// ------------------------------------------------------------
// 5. RENDER – updates names, scores, and colours
// ------------------------------------------------------------
function render() {
    const name1 = document.getElementById("team1Name");
    const name2 = document.getElementById("team2Name");

    name1.textContent = teams[0].name;
    name2.textContent = teams[1].name;

    name1.style.color = teams[0].colour;
    name2.style.color = teams[1].colour;
    s1.style.color = teams[0].colour;
    s2.style.color = teams[1].colour;

    s1.textContent = teams[0].score;
    s2.textContent = teams[1].score;
}

// ------------------------------------------------------------
// 6. WIRE UP SETTINGS CONTROLS
// ------------------------------------------------------------
team1NameInput.oninput = (e) => {
    teams[0].name = e.target.value.trim() || "Team 1";
    render();
};

team2NameInput.oninput = (e) => {
    teams[1].name = e.target.value.trim() || "Team 2";
    render();
};

team1ColourInput.oninput = (e) => {
    teams[0].colour = e.target.value;
    render();
};

team2ColourInput.oninput = (e) => {
    teams[1].colour = e.target.value;
    render();
};

document.getElementById("team1Plus").onclick = () => change(0, 1);
document.getElementById("team1Minus").onclick = () => change(0, -1);
document.getElementById("team2Plus").onclick = () => change(1, 1);
document.getElementById("team2Minus").onclick = () => change(1, -1);

document.getElementById("resetBtn").onclick = () => {
    teams.forEach(t => t.score = 0);
    render();
};

// ------------------------------------------------------------
// 7. INITIALISE – pre‑fill inputs and render
// ------------------------------------------------------------
function initSettings() {
    team1NameInput.value = teams[0].name;
    team2NameInput.value = teams[1].name;
    team1ColourInput.value = teams[0].colour;
    team2ColourInput.value = teams[1].colour;
    sizeSlider.value = 100;
    sizeLabel.textContent = "100%";
    document.documentElement.style.setProperty("--scale", 1);
}

initSettings();
render();