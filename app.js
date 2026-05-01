const canvas = document.querySelector("#circuitCanvas");
const ctx = canvas.getContext("2d");
const moveCountEl = document.querySelector("#moveCount");
const currentLevelStatus = document.querySelector("#currentLevelStatus");
const timeCountEl = document.querySelector("#timeCount");
const timeCard = document.querySelector("#timeCard");
const lampStateEl = document.querySelector("#lampState");
const lampMeter = document.querySelector(".lamp-meter");
const benchWire = document.querySelector("#benchWire");
const benchBulb = document.querySelector("#benchBulb");
const winOverlay = document.querySelector("#winOverlay");
const failOverlay = document.querySelector("#failOverlay");
const scoreText = document.querySelector("#scoreText");
const failText = document.querySelector("#failText");
const resetButton = document.querySelector("#resetButton");
const hintButton = document.querySelector("#hintButton");
const nextButton = document.querySelector("#nextButton");
const retryButton = document.querySelector("#retryButton");
const menuButton = document.querySelector("#menuButton");
const menuOverlay = document.querySelector("#menuOverlay");
const playButton = document.querySelector("#playButton");
const continueButton = document.querySelector("#continueButton");
const soundToggle = document.querySelector("#soundToggle");
const menuLevelsButton = document.querySelector("#menuLevelsButton");
const difficultyTabs = document.querySelector("#difficultyTabs");
const levelEyebrow = document.querySelector("#levelEyebrow");
const levelTitle = document.querySelector("#levelTitle");
const levelGrid = document.querySelector("#levelGrid");
const labPanel = document.querySelector(".lab-panel");
const levelCardHead = document.querySelector(".level-card-head");
const levelStatusCard = document.querySelector(".level-meter");
const recordText = document.querySelector("#recordText");
const progressText = document.querySelector("#progressText");
const levelSelectOverlay = document.querySelector("#levelSelectOverlay");
const levelSelectCloseButton = document.querySelector("#levelSelectCloseButton");
const episodeGrid = document.querySelector("#episodeGrid");
const legalOverlay = document.querySelector("#legalOverlay");
const legalCloseButton = document.querySelector("#legalCloseButton");
const privacyPanel = document.querySelector("#privacyPanel");
const termsPanel = document.querySelector("#termsPanel");
const paywallOverlay = document.querySelector("#paywallOverlay");
const paywallCloseButton = document.querySelector("#paywallCloseButton");
const unlockButton = document.querySelector("#unlockButton");
const restorePurchaseButton = document.querySelector("#restorePurchaseButton");
const paywallMessage = document.querySelector("#paywallMessage");

const PREMIUM_PRODUCT_ID = "voltloop_full_unlock";
const RECORD_KEY = "circuitGlowRecords.v1";
const PURCHASE_KEY = "voltLoopPremiumUnlocked.v2";
const UNLOCK_KEY = "voltLoopHighestUnlocked.v1";
const CURRENT_LEVEL_KEY = "voltLoopCurrentLevel.v1";
const FREE_LEVELS = 10;
const DIFFICULTIES = {
  easy: { label: "Easy", shortLabel: "Easy", count: 10, size: 6, decoy: 0.26, minPath: 8 },
  medium: { label: "Medium", shortLabel: "Med.", count: 20, size: 7, decoy: 0.38, minPath: 11 },
  hard: { label: "Hard", shortLabel: "Hard", count: 30, size: 8, decoy: 0.5, minPath: 15 },
  impossible: { label: "Impossible", shortLabel: "Imp.", count: 20, size: 9, decoy: 0.62, minPath: 19 },
  edison: { label: "Edison", shortLabel: "Edison", count: 20, size: 9, decoy: 0.68, minPath: 21 },
};

const EPISODE_NAMES = {
  easy: "Earth Launchpad",
  medium: "Moon Base",
  hard: "Orbital Lab",
  impossible: "Storm Grid",
  edison: "Edison Workshop",
};

const THEMES = [
  {
    key: "neon-lab",
    label: "Neon Lab",
    board: "#111b2b",
    tileA: "#263752",
    tileB: "#1a263b",
    emptyA: "#1b273a",
    emptyB: "#111a29",
    glow: "rgba(95, 244, 255, 0.08)",
    grid: "rgba(110, 167, 206, 0.16)",
  },
  {
    key: "mars-grid",
    label: "Mars Grid",
    board: "#211821",
    tileA: "#433149",
    tileB: "#241b2f",
    emptyA: "#302638",
    emptyB: "#171423",
    glow: "rgba(255, 129, 85, 0.12)",
    grid: "rgba(255, 172, 114, 0.16)",
  },
  {
    key: "city-power",
    label: "City Power",
    board: "#0f1d25",
    tileA: "#243f4a",
    tileB: "#162832",
    emptyA: "#1a3039",
    emptyB: "#0d1a22",
    glow: "rgba(255, 216, 78, 0.1)",
    grid: "rgba(255, 233, 141, 0.16)",
  },
  {
    key: "storm-core",
    label: "Storm Core",
    board: "#141827",
    tileA: "#2a3352",
    tileB: "#171c33",
    emptyA: "#1f2941",
    emptyB: "#101524",
    glow: "rgba(141, 125, 255, 0.12)",
    grid: "rgba(171, 166, 255, 0.16)",
  },
  {
    key: "edison-shop",
    label: "Edison Shop",
    board: "#1b1711",
    tileA: "#3d3223",
    tileB: "#221d15",
    emptyA: "#2c251c",
    emptyB: "#17140f",
    glow: "rgba(255, 202, 112, 0.12)",
    grid: "rgba(255, 214, 148, 0.17)",
  },
];

let size = 7;
let cells = [];
let moves = 0;
let startedAt = Date.now();
let timerId = null;
let spinnerId = null;
let winRevealTimer = null;
let solved = false;
let failed = false;
let hintedCell = null;
let currentDifficulty = "easy";
let currentLevel = 1;
let currentSpec = null;
let selectedMenuDifficulty = "easy";
let soundEnabled = true;
let audioContext = null;
let currentTheme = THEMES[0];
let currentRules = null;
let timeLimitMs = 0;
let lastTouchEnd = 0;

document.addEventListener(
  "touchend",
  (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 350) event.preventDefault();
    lastTouchEnd = now;
  },
  { passive: false },
);

document.addEventListener(
  "dblclick",
  (event) => {
    event.preventDefault();
  },
  { passive: false },
);

const DIRS = {
  n: { dr: -1, dc: 0, opposite: "s" },
  e: { dr: 0, dc: 1, opposite: "w" },
  s: { dr: 1, dc: 0, opposite: "n" },
  w: { dr: 0, dc: -1, opposite: "e" },
};

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function hashSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffle(list, random) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function ensureAudio() {
  if (!soundEnabled) return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioContext) audioContext = new AudioCtor();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone({ frequency = 440, endFrequency = frequency, duration = 0.12, type = "sine", gain = 0.08 }) {
  const audio = ensureAudio();
  if (!audio) return;
  const now = audio.currentTime;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(volume);
  volume.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playClickSound() {
  playTone({ frequency: 180, endFrequency: 720, duration: 0.08, type: "square", gain: 0.045 });
  setTimeout(() => playTone({ frequency: 760, endFrequency: 420, duration: 0.06, type: "sawtooth", gain: 0.025 }), 30);
}

function playWinSound() {
  [220, 330, 440, 660, 880].forEach((frequency, index) => {
    setTimeout(() => playTone({ frequency, endFrequency: frequency * 1.4, duration: 0.18, type: "triangle", gain: 0.07 }), index * 70);
  });
}

function playMenuSound() {
  playTone({ frequency: 360, endFrequency: 520, duration: 0.09, type: "triangle", gain: 0.04 });
}

function playFailSound() {
  playTone({ frequency: 220, endFrequency: 80, duration: 0.22, type: "sawtooth", gain: 0.06 });
}

function basePorts(type) {
  if (type === "wire") return ["n", "s"];
  if (type === "corner") return ["n", "e"];
  if (type === "tee") return ["n", "e", "w"];
  if (type === "splitter") return ["n", "e", "w"];
  if (type === "cross") return ["n", "e", "s", "w"];
  if (type === "switch") return ["e", "w"];
  if (type === "battery") return ["e"];
  if (type === "lamp") return ["w"];
  return [];
}

function rotateDir(dir, rotation) {
  const order = ["n", "e", "s", "w"];
  return order[(order.indexOf(dir) + rotation) % 4];
}

function portsForType(type, rotation) {
  return basePorts(type).map((dir) => rotateDir(dir, rotation)).sort().join("");
}

function portsFor(cell) {
  return basePorts(cell.type).map((dir) => rotateDir(dir, cell.rotation));
}

function pieceFromPorts(ports) {
  const signature = [...ports].sort().join("");
  const candidates = ports.length === 4 ? ["cross"] : ports.length === 3 ? ["splitter", "tee"] : ["wire", "corner", "switch"];
  for (const type of candidates) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      if (portsForType(type, rotation) === signature) {
        return { type, rotation };
      }
    }
  }
  return { type: "wire", rotation: 0 };
}

function inBounds(row, col) {
  return row >= 0 && row < size && col >= 0 && col < size;
}

function createPath(random, config) {
  const startRow = 1 + Math.floor(random() * (config.size - 2));
  const endRow = 1 + Math.floor(random() * (config.size - 2));
  const start = { row: startRow, col: 1 };
  const goal = { row: endRow, col: config.size - 2 };
  const path = [start];
  let row = start.row;
  let col = start.col;

  while (col < goal.col) {
    const targetRow = random() < 0.72 ? Math.floor(random() * config.size) : row;
    while (row !== targetRow) {
      row += row < targetRow ? 1 : -1;
      path.push({ row, col });
    }
    col += 1;
    path.push({ row, col });
  }

  while (row !== goal.row) {
    row += row < goal.row ? 1 : -1;
    path.push({ row, col });
  }

  return { path, startRow, endRow };
}

function generateLevel(difficulty, levelNumber) {
  const config = DIFFICULTIES[difficulty];
  const random = seededRandom(hashSeed(`${difficulty}-${levelNumber}`));
  const rules = rulesForLevel(difficulty, levelNumber);
  const { path, startRow, endRow } = createPath(random, config);
  const board = Array.from({ length: config.size }, () =>
    Array.from({ length: config.size }, () => ({ type: "empty", rotation: 0, solution: 0, powered: false, path: false })),
  );
  const portMap = new Map();
  const lampRows = [endRow];

  function addPort(row, col, port) {
    const key = `${row},${col}`;
    const list = portMap.get(key) || [];
    if (!list.includes(port)) list.push(port);
    portMap.set(key, list);
  }

  board[startRow][0] = { type: "battery", rotation: 0, solution: 0, powered: false, path: true };
  addPort(startRow, 0, "e");
  addLamp(endRow);

  const fullPath = [{ row: startRow, col: 0 }, ...path, { row: endRow, col: config.size - 1 }];
  connectPoints(fullPath);

  while (lampRows.length < rules.lamps) {
    const lampRow = Math.floor(random() * config.size);
    if (lampRows.includes(lampRow)) continue;
    lampRows.push(lampRow);
    addLamp(lampRow);
    const anchor = path[Math.floor(random() * path.length)];
    const branch = [{ ...anchor }];
    let row = anchor.row;
    let col = anchor.col;
    while (row !== lampRow) {
      row += row < lampRow ? 1 : -1;
      branch.push({ row, col });
    }
    while (col < config.size - 1) {
      col += 1;
      branch.push({ row, col });
    }
    connectPoints(branch);
  }

  function addLamp(row) {
    board[row][config.size - 1] = { type: "lamp", rotation: 0, solution: 0, powered: false, path: true };
    addPort(row, config.size - 1, "w");
  }

  function connectPoints(points) {
    for (let index = 0; index < points.length - 1; index += 1) {
      const a = points[index];
      const b = points[index + 1];
      const dir = Object.entries(DIRS).find(([, value]) => a.row + value.dr === b.row && a.col + value.dc === b.col);
      if (!dir) continue;
      addPort(a.row, a.col, dir[0]);
      addPort(b.row, b.col, dir[1].opposite);
    }
  }

  for (const [key, ports] of portMap.entries()) {
    const [row, col] = key.split(",").map(Number);
    if (board[row][col].type === "battery" || board[row][col].type === "lamp") continue;
    const piece = pieceFromPorts(ports);
    const variant = rules.yellow && random() < 0.18 ? "yellow" : "";
    board[row][col] = { ...piece, solution: piece.rotation, powered: false, path: true, variant };
  }

  const decoys = ["wire", "corner", "tee", "switch", "splitter", "cross"];
  for (let row = 0; row < config.size; row += 1) {
    for (let col = 0; col < config.size; col += 1) {
      if (board[row][col].type !== "empty" || random() > config.decoy) continue;
      const type = decoys[Math.floor(random() * decoys.length)];
      const rotation = Math.floor(random() * 4);
      let variant = "";
      if (rules.shortCircuit && random() < 0.16) variant = "short";
      if (!variant && rules.red && random() < 0.12) variant = "red";
      if (!variant && rules.yellow && random() < 0.14) variant = "yellow";
      board[row][col] = { type, rotation, solution: rotation, powered: false, path: false, variant };
    }
  }

  if (rules.spinners) {
    const candidates = board.flat().filter((cell) => cell.path && !["battery", "lamp", "empty"].includes(cell.type));
    shuffle(candidates, random).slice(0, 2).forEach((cell) => {
      cell.variant = "spinner";
    });
  }

  return { difficulty, levelNumber, config, board, rules };
}

function rulesForLevel(difficulty, levelNumber) {
  const rank = Object.keys(DIFFICULTIES).indexOf(difficulty);
  return {
    lamps: difficulty === "edison" ? 3 : difficulty === "hard" || difficulty === "impossible" ? 2 + (levelNumber % 5 === 0 ? 1 : 0) : 1,
    timed: difficulty !== "easy" && levelNumber % 4 === 0,
    timeLimit: Math.max(90, 125 - rank * 5 - Math.floor(levelNumber / 4)),
    shortCircuit: rank >= 1,
    yellow: rank >= 1,
    red: rank >= 2,
    spinners: difficulty === "edison" && levelNumber % 3 === 0,
  };
}

function themeForLevel(difficulty, levelNumber) {
  if (difficulty === "edison") return THEMES.find((theme) => theme.key === "edison-shop") || THEMES[0];
  const offset = Object.keys(DIFFICULTIES).indexOf(difficulty);
  return THEMES[(levelNumber + offset) % (THEMES.length - 1)];
}

function makeCell(source, row, col, random) {
  const fixed = source.type === "empty" || source.type === "battery" || source.type === "lamp";
  let rotation = source.solution;
  if (!fixed) {
    const offset = source.type === "wire" || source.type === "switch" ? 1 : 1 + Math.floor(random() * 3);
    rotation = (source.solution + offset) % 4;
  }
  return { ...source, row, col, rotation, powered: false };
}

function buildBoard() {
  currentSpec = generateLevel(currentDifficulty, currentLevel);
  currentRules = currentSpec.rules;
  currentTheme = themeForLevel(currentDifficulty, currentLevel);
  document.body.dataset.theme = currentTheme.key;
  document.body.classList.toggle("is-timed-level", currentRules.timed);
  size = currentSpec.config.size;
  const random = seededRandom(hashSeed(`${currentDifficulty}-${currentLevel}-scramble`));
  cells = currentSpec.board.map((row, rowIndex) => row.map((cell, colIndex) => makeCell(cell, rowIndex, colIndex, random)));
  if (circuitReachesLamp()) {
    const firstPathPiece = cells.flat().find((cell) => cell.path && !["battery", "lamp", "empty"].includes(cell.type));
    if (firstPathPiece) firstPathPiece.rotation = (firstPathPiece.rotation + 1) % 4;
  }
  moves = 0;
  solved = false;
  failed = false;
  clearTimeout(winRevealTimer);
  hintedCell = null;
  timeLimitMs = currentRules.timed ? currentRules.timeLimit * 1000 : 0;
  startedAt = Date.now();
  winOverlay.hidden = true;
  failOverlay.hidden = true;
  saveCurrentLevel();
  renderLevelUI();
  startTimer();
  startSpinners();
  updateCircuit(false);
}

function circuitReachesLamp() {
  cells.flat().forEach((cell) => {
    cell.powered = false;
  });
  const battery = cells.flat().find((cell) => cell.type === "battery");
  const queue = [battery];
  battery.powered = true;
  while (queue.length) {
    const cell = queue.shift();
    for (const port of portsFor(cell)) {
      const dir = DIRS[port];
      const nextRow = cell.row + dir.dr;
      const nextCol = cell.col + dir.dc;
      if (!inBounds(nextRow, nextCol)) continue;
      const next = cells[nextRow][nextCol];
      if (!portsFor(next).includes(dir.opposite) || next.powered) continue;
      next.powered = true;
      queue.push(next);
    }
  }
  const lamps = cells.flat().filter((cell) => cell.type === "lamp");
  return lamps.length > 0 && lamps.every((cell) => cell.powered);
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(renderStats, 1000);
}

function startSpinners() {
  clearInterval(spinnerId);
  if (!currentRules?.spinners) return;
  spinnerId = setInterval(() => {
    if (solved || failed) return;
    cells.flat().forEach((cell) => {
      if (cell.variant === "spinner") cell.rotation = (cell.rotation + 1) % 4;
    });
    updateCircuit(true);
  }, 1900);
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getRecords() {
  try {
    return JSON.parse(localStorage.getItem(RECORD_KEY)) || {};
  } catch {
    return {};
  }
}

function isPremiumUnlocked() {
  return localStorage.getItem(PURCHASE_KEY) === "true";
}

function setPremiumUnlocked() {
  localStorage.setItem(PURCHASE_KEY, "true");
  renderLevelUI();
}

function saveCurrentLevel() {
  localStorage.setItem(CURRENT_LEVEL_KEY, JSON.stringify({ difficulty: currentDifficulty, level: currentLevel }));
}

function globalLevelIndex(difficulty, level) {
  let index = 0;
  for (const [key, config] of Object.entries(DIFFICULTIES)) {
    if (key === difficulty) return index + level;
    index += config.count;
  }
  return level;
}

function levelFromGlobalIndex(globalIndex) {
  let remaining = globalIndex;
  for (const [difficulty, config] of Object.entries(DIFFICULTIES)) {
    if (remaining <= config.count) return { difficulty, level: remaining };
    remaining -= config.count;
  }
  return { difficulty: "easy", level: 1 };
}

function getSavedCurrentLevel() {
  try {
    const saved = JSON.parse(localStorage.getItem(CURRENT_LEVEL_KEY));
    if (!saved || !DIFFICULTIES[saved.difficulty]) return null;
    const level = Number(saved.level);
    if (!Number.isInteger(level) || level < 1 || level > DIFFICULTIES[saved.difficulty].count) return null;
    return { difficulty: saved.difficulty, level };
  } catch {
    return null;
  }
}

function getHighestUnlocked() {
  const stored = Number(localStorage.getItem(UNLOCK_KEY)) || 1;
  const completedMax = Object.keys(getRecords()).reduce((max, key) => {
    const [difficulty, level] = key.split("-");
    if (!DIFFICULTIES[difficulty]) return max;
    return Math.max(max, globalLevelIndex(difficulty, Number(level)) + 1);
  }, 1);
  const total = Object.values(DIFFICULTIES).reduce((sum, config) => sum + config.count, 0);
  return Math.min(total, Math.max(stored, completedMax));
}

function unlockNextLevel() {
  const nextIndex = globalLevelIndex(currentDifficulty, currentLevel) + 1;
  if (nextIndex > getHighestUnlocked()) localStorage.setItem(UNLOCK_KEY, String(nextIndex));
}

function canOpenLevel(difficulty, level) {
  const index = globalLevelIndex(difficulty, level);
  if (index > getHighestUnlocked()) return false;
  return index <= FREE_LEVELS || isPremiumUnlocked();
}

function getLastPlayableLevelForDifficulty(difficulty) {
  const config = DIFFICULTIES[difficulty];
  if (!config) return 1;
  let lastPlayable = 1;
  for (let level = 1; level <= config.count; level += 1) {
    if (canOpenLevel(difficulty, level)) lastPlayable = level;
  }
  return lastPlayable;
}

function getNextLevelAfter(difficulty, level) {
  const config = DIFFICULTIES[difficulty];
  if (!config) return null;
  if (level < config.count) return { difficulty, level: level + 1 };

  const keys = Object.keys(DIFFICULTIES);
  const nextDifficulty = keys[keys.indexOf(difficulty) + 1];
  return nextDifficulty ? { difficulty: nextDifficulty, level: 1 } : null;
}

function getResumeTarget(levelInfo, { allowLockedPremium = false } = {}) {
  if (!levelInfo) return null;
  const completed = Boolean(recordFor(levelInfo.difficulty, levelInfo.level));
  const next = completed ? getNextLevelAfter(levelInfo.difficulty, levelInfo.level) : null;
  const target = next || levelInfo;
  if (canOpenLevel(target.difficulty, target.level)) return target;
  if (allowLockedPremium && globalLevelIndex(target.difficulty, target.level) > FREE_LEVELS && !isPremiumUnlocked()) return target;
  return levelInfo;
}

function getContinueLevel({ allowLockedPremium = false } = {}) {
  const saved = getSavedCurrentLevel();
  const resume = getResumeTarget(saved, { allowLockedPremium });
  if (resume && (allowLockedPremium || canOpenLevel(resume.difficulty, resume.level))) return resume;

  const highest = isPremiumUnlocked() ? getHighestUnlocked() : Math.min(getHighestUnlocked(), FREE_LEVELS);
  return levelFromGlobalIndex(Math.max(1, highest));
}

function startLevel(difficulty, level, { hideMenu = false, sound = true } = {}) {
  if (!canOpenLevel(difficulty, level)) {
    const targetIndex = globalLevelIndex(difficulty, level);
    openPaywall(
      targetIndex > FREE_LEVELS && !isPremiumUnlocked()
        ? "Unlock VoltLoop Premium for $2.99 to play levels beyond the free pack."
        : "Complete the previous level first.",
    );
    renderLevelUI();
    return false;
  }

  currentDifficulty = difficulty;
  currentLevel = level;
  selectedMenuDifficulty = difficulty;
  if (sound) playMenuSound();
  buildBoard();
  if (hideMenu) menuOverlay.classList.add("is-hidden");
  return true;
}

function openPaywall(message = "Unlock VoltLoop Premium to continue beyond the free levels. Levels still open one by one as you progress.") {
  paywallMessage.textContent = message;
  paywallOverlay.classList.remove("is-hidden");
}

let purchaseSetupPromise = null;
let purchaseInFlightResolver = null;

function waitForPurchaseRuntime() {
  if (window.CdvPurchase) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("Purchase plugin did not load.")), 9000);
    document.addEventListener(
      "deviceready",
      () => {
        window.clearTimeout(timeout);
        if (window.CdvPurchase) resolve();
        else reject(new Error("Purchase plugin is unavailable."));
      },
      { once: true },
    );
  });
}

function transactionIncludesPremium(transaction) {
  return transaction?.products?.some((product) => product.id === PREMIUM_PRODUCT_ID) ?? false;
}

async function setupPurchases() {
  if (purchaseSetupPromise) return purchaseSetupPromise;

  purchaseSetupPromise = (async () => {
    await waitForPurchaseRuntime();
    const { store, ProductType, Platform } = window.CdvPurchase;

    store.register([
      {
        id: PREMIUM_PRODUCT_ID,
        type: ProductType.NON_CONSUMABLE,
        platform: Platform.APPLE_APPSTORE,
      },
    ]);

    store.when()
      .approved(async (transaction) => {
        if (!transactionIncludesPremium(transaction)) return;
        setPremiumUnlocked();
        await transaction.finish();
        if (purchaseInFlightResolver) {
          purchaseInFlightResolver({ success: true });
          purchaseInFlightResolver = null;
        }
      })
      .productUpdated((product) => {
        if (product.id === PREMIUM_PRODUCT_ID && product.owned) {
          setPremiumUnlocked();
        }
      });

    store.error((error) => {
      paywallMessage.textContent = error?.message || "Purchase could not be completed. Please try again.";
      if (purchaseInFlightResolver) {
        purchaseInFlightResolver({ success: false, error });
        purchaseInFlightResolver = null;
      }
    });

    await store.initialize([
      {
        platform: Platform.APPLE_APPSTORE,
        options: { needAppReceipt: true },
      },
    ]);
  })();

  return purchaseSetupPromise;
}

window.VoltLoopPurchases = {
  async purchasePremium(productId = PREMIUM_PRODUCT_ID) {
    await setupPurchases();
    const { store, Platform } = window.CdvPurchase;

    if (store.owned(productId)) return { success: true };

    const product = store.get(productId, Platform.APPLE_APPSTORE) || store.get(productId);
    const offer = product?.getOffer?.();
    if (!offer) throw new Error("Premium product is not available from the App Store yet.");

    paywallMessage.textContent = "Opening App Store purchase sheet...";

    return new Promise(async (resolve) => {
      purchaseInFlightResolver = resolve;
      const error = await offer.order();
      if (error) {
        purchaseInFlightResolver = null;
        const cancelled = error.code === window.CdvPurchase.ErrorCode.PAYMENT_CANCELLED;
        resolve({ success: false, cancelled, error });
      }
    });
  },

  async restorePremium() {
    await setupPurchases();
    const { store } = window.CdvPurchase;
    paywallMessage.textContent = "Checking your App Store purchases...";
    await store.restorePurchases();
    if (store.owned(PREMIUM_PRODUCT_ID) || isPremiumUnlocked()) {
      setPremiumUnlocked();
      return { success: true };
    }
    return { success: false };
  },
};

function saveRecord(result) {
  const key = `${currentDifficulty}-${currentLevel}`;
  const records = getRecords();
  const previous = records[key];
  if (!previous || result.score < previous.score) {
    records[key] = result;
    localStorage.setItem(RECORD_KEY, JSON.stringify(records));
    return true;
  }
  return false;
}

function recordFor(difficulty = currentDifficulty, level = currentLevel) {
  return getRecords()[`${difficulty}-${level}`];
}

function updateCircuit(showWin = true) {
  cells.flat().forEach((cell) => {
    cell.powered = false;
  });

  const battery = cells.flat().find((cell) => cell.type === "battery");
  const queue = [battery];
  battery.powered = true;

  while (queue.length) {
    const cell = queue.shift();
    for (const port of portsFor(cell)) {
      const dir = DIRS[port];
      const nextRow = cell.row + dir.dr;
      const nextCol = cell.col + dir.dc;
      if (!inBounds(nextRow, nextCol)) continue;

      const next = cells[nextRow][nextCol];
      if (!portsFor(next).includes(dir.opposite) || next.powered) continue;

      next.powered = true;
      queue.push(next);
    }
  }

  const lamps = cells.flat().filter((cell) => cell.type === "lamp");
  const shorted = cells.flat().some((cell) => cell.variant === "short" && cell.powered);
  const overloaded = cells.flat().some((cell) => {
    if (cell.variant !== "red" || !cell.powered) return false;
    return portsFor(cell).some((port) => {
      const dir = DIRS[port];
      const nextRow = cell.row + dir.dr;
      const nextCol = cell.col + dir.dc;
      if (!inBounds(nextRow, nextCol)) return false;
      const next = cells[nextRow][nextCol];
      return next.variant === "red" && next.powered && portsFor(next).includes(dir.opposite);
    });
  });

  if (showWin && shorted) failLevel("A short-circuit cable received current.");
  if (showWin && overloaded) failLevel("Two red high-voltage cables overloaded.");

  solved = !failed && lamps.length > 0 && lamps.every((cell) => cell.powered);
  renderStats();
  drawBoard();
  setLampState(solved);

  if (solved && showWin) {
    clearInterval(timerId);
    clearInterval(spinnerId);
    playWinSound();
    const elapsedMs = Date.now() - startedAt;
    const score = Math.floor(elapsedMs / 1000) + moves * 100;
    const isRecord = saveRecord({ elapsedMs, moves, score, completedAt: new Date().toISOString() });
    unlockNextLevel();
    scoreText.textContent = `${formatTime(elapsedMs)} time, ${moves} moves, ${score} score.${isRecord ? " New best!" : ""}`;
    winRevealTimer = setTimeout(() => {
      winOverlay.hidden = false;
    }, 1500);
    renderLevelUI();
  }
}

function failLevel(message) {
  if (failed || solved) return;
  failed = true;
  clearTimeout(winRevealTimer);
  clearInterval(timerId);
  clearInterval(spinnerId);
  playFailSound();
  failText.textContent = message;
  failOverlay.hidden = false;
  drawBoard();
}

function setLampState(isOn) {
  const lamps = cells.flat().filter((cell) => cell.type === "lamp");
  const lit = lamps.filter((cell) => cell.powered).length;
  lampStateEl.textContent = lamps.length > 1 ? `${lit}/${lamps.length}` : isOn ? "On" : "Off";
  lampMeter.classList.toggle("is-on", isOn);
  benchWire.classList.toggle("is-on", isOn);
  benchBulb.classList.toggle("is-on", isOn);
}

function renderStats() {
  moveCountEl.textContent = moves;
  const elapsed = Date.now() - startedAt;
  if (timeLimitMs) {
    const remaining = Math.max(0, timeLimitMs - elapsed);
    timeCountEl.textContent = formatTime(remaining);
    timeCard.style.setProperty("--time-left", `${(remaining / timeLimitMs) * 100}%`);
    if (remaining <= 0 && !solved && !failed) failLevel("The power window closed before the circuit was complete.");
    return;
  }
  timeCard.style.removeProperty("--time-left");
  timeCountEl.textContent = formatTime(elapsed);
}

function renderLevelUI() {
  const config = DIFFICULTIES[currentDifficulty];
  levelEyebrow.textContent = `${config.label} ${currentLevel} - ${currentTheme.label}`;
  levelTitle.textContent = `${config.label} ${currentLevel}`;
  currentLevelStatus.textContent = `${config.shortLabel} ${currentLevel}`;
  difficultyTabs.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.difficulty === currentDifficulty);
  });
  menuOverlay.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.difficulty === selectedMenuDifficulty);
  });

  const record = recordFor();
  recordText.textContent = record ? `${formatTime(record.elapsedMs)} · ${record.moves} moves · ${record.score}` : "No record yet";
  renderProgress();
  renderEpisodeGrid();

  levelGrid.innerHTML = Array.from({ length: config.count }, (_, index) => {
    const level = index + 1;
    const hasRecord = Boolean(recordFor(currentDifficulty, level));
    const locked = !canOpenLevel(currentDifficulty, level);
    const premium = globalLevelIndex(currentDifficulty, level) > FREE_LEVELS && !isPremiumUnlocked();
    const active = level === currentLevel ? " is-active" : "";
    const done = hasRecord ? " is-done" : "";
    const lockClass = locked ? " is-locked" : "";
    const label = locked ? premium ? "$" : "lock" : level;
    return `<button class="level-pill${active}${done}${lockClass}" type="button" data-level="${level}" aria-label="${config.label} ${level}${locked ? " locked" : ""}">${label}</button>`;
  }).join("");
}

function renderEpisodeGrid() {
  const difficultyEntries = Object.entries(DIFFICULTIES);
  let start = 1;
  episodeGrid.innerHTML = difficultyEntries
    .map(([difficulty, config]) => {
      const end = start + config.count - 1;
      const rows = Array.from({ length: config.count }, (_, index) => {
        const level = index + 1;
        const globalIndex = globalLevelIndex(difficulty, level);
        const locked = !canOpenLevel(difficulty, level);
        const premiumLocked = globalIndex > FREE_LEVELS && !isPremiumUnlocked();
        const done = Boolean(recordFor(difficulty, level));
        const active = difficulty === currentDifficulty && level === currentLevel;
        const label = locked ? "lock" : level;
        return `<button class="episode-level${locked ? " is-locked" : ""}${done ? " is-done" : ""}${active ? " is-active" : ""}" type="button" data-difficulty="${difficulty}" data-level="${level}" aria-label="${config.label} ${level}${locked ? " locked" : ""}">${label}${premiumLocked ? "<span>$</span>" : ""}</button>`;
      }).join("");
      const premiumBadge = start > FREE_LEVELS ? '<span class="episode-badge">Pro</span>' : "";
      const card = `<section class="episode-card" data-difficulty="${difficulty}">
        <div class="episode-head">
          <div>
            <h3>${EPISODE_NAMES[difficulty]}</h3>
            <p>${config.label} · ${config.count} levels</p>
          </div>
          <div class="episode-range">L${start}-${end}</div>
          ${premiumBadge}
        </div>
        <div class="episode-level-grid">${rows}</div>
      </section>`;
      start = end + 1;
      return card;
    })
    .join("");
}

function openLevelSelect() {
  renderEpisodeGrid();
  levelSelectOverlay.classList.remove("is-hidden");
}

function closeLevelSelect() {
  levelSelectOverlay.classList.add("is-hidden");
}

function renderProgress() {
  const records = getRecords();
  const completed = Object.keys(records).length;
  const total = Object.values(DIFFICULTIES).reduce((sum, config) => sum + config.count, 0);
  progressText.textContent = `${completed} of ${total} levels completed.`;
}

function nextLevel() {
  const config = DIFFICULTIES[currentDifficulty];
  let nextDifficulty = currentDifficulty;
  let nextLevelNumber = currentLevel;
  if (currentLevel < config.count) {
    nextLevelNumber += 1;
  } else {
    const keys = Object.keys(DIFFICULTIES);
    nextDifficulty = keys[keys.indexOf(currentDifficulty) + 1] || "easy";
    nextLevelNumber = 1;
  }

  if (!canOpenLevel(nextDifficulty, nextLevelNumber)) {
    const nextIndex = globalLevelIndex(nextDifficulty, nextLevelNumber);
    if (nextIndex > FREE_LEVELS && !isPremiumUnlocked()) {
      openPaywall("You finished the free pack. Unlock premium access for $2.99, then keep opening levels one by one.");
    }
    return;
  }
  currentDifficulty = nextDifficulty;
  currentLevel = nextLevelNumber;
  selectedMenuDifficulty = nextDifficulty;
  buildBoard();
}

function drawBoard() {
  const tile = canvas.width / size;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = currentTheme.board;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.48, 80, canvas.width * 0.5, canvas.height * 0.5, 520);
  gradient.addColorStop(0, currentTheme.glow);
  gradient.addColorStop(0.65, "rgba(42, 61, 91, 0.1)");
  gradient.addColorStop(1, "rgba(5, 9, 16, 0.34)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const cell of cells.flat()) {
    drawCell(cell, tile);
  }
}

function drawCell(cell, tile) {
  const x = cell.col * tile;
  const y = cell.row * tile;
  const cx = x + tile / 2;
  const cy = y + tile / 2;
  const radius = tile * 0.34;
  const gap = tile * 0.045;
  const tileGradient = ctx.createLinearGradient(x, y, x + tile, y + tile);
  tileGradient.addColorStop(0, cell.type === "empty" ? currentTheme.emptyA : currentTheme.tileA);
  tileGradient.addColorStop(1, cell.type === "empty" ? currentTheme.emptyB : currentTheme.tileB);
  ctx.fillStyle = tileGradient;
  roundRect(x + gap, y + gap, tile - gap * 2, tile - gap * 2, tile * 0.095);
  ctx.fill();
  ctx.strokeStyle = currentTheme.grid;
  ctx.lineWidth = 2;
  ctx.stroke();

  if (hintedCell === cell) {
    ctx.fillStyle = "rgba(102, 244, 255, 0.16)";
    roundRect(x + gap * 1.5, y + gap * 1.5, tile - gap * 3, tile - gap * 3, tile * 0.09);
    ctx.fill();
  }

  if (cell.type === "empty") return;
  if (cell.type === "battery") return drawBattery(cx, cy, tile);
  if (cell.type === "lamp") return drawLamp(cx, cy, tile, cell.powered);
  drawWire(cell, cx, cy, radius);
}

function drawWire(cell, cx, cy, length) {
  const powered = cell.powered;
  const ports = portsFor(cell);
  const palette = wirePalette(cell);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "#05070a";
  ctx.lineWidth = Math.max(12, length * 0.32);
  drawSegments(cx, cy, ports, length);

  const cableGradient = ctx.createLinearGradient(cx - length, cy - length, cx + length, cy + length);
  cableGradient.addColorStop(0, palette.a);
  cableGradient.addColorStop(0.42, palette.b);
  cableGradient.addColorStop(1, palette.c);
  ctx.strokeStyle = cableGradient;
  ctx.lineWidth = Math.max(9, length * 0.25);
  drawSegments(cx, cy, ports, length);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = Math.max(2, length * 0.06);
  drawSegments(cx - 1, cy - 4, ports, length * 0.86);
  drawCopperEnds(cx, cy, ports, length);
  drawSpecialMarker(cell, cx, cy, length);

  if (powered) {
    ctx.shadowColor = palette.glow;
    ctx.shadowBlur = 26;
    ctx.strokeStyle = palette.hot;
    ctx.lineWidth = Math.max(5, length * 0.15);
    drawElectricSegments(cx, cy, ports, length * 0.96);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#f2ffff";
    ctx.lineWidth = Math.max(2, length * 0.045);
    drawElectricSegments(cx, cy, ports, length * 0.92);
  }
}

function wirePalette(cell) {
  if (cell.variant === "yellow") {
    return { a: "#7b5f10", b: "#15100a", c: "#ffd84e", hot: "#ffe66d", glow: "rgba(255, 216, 78, 0.95)" };
  }
  if (cell.variant === "red" || cell.variant === "short") {
    return { a: "#471019", b: "#140608", c: "#ff5b7a", hot: "#ff7890", glow: "rgba(255, 91, 122, 0.95)" };
  }
  if (cell.variant === "spinner") {
    return { a: "#312359", b: "#0d0a18", c: "#8d7dff", hot: "#9ef7ff", glow: "rgba(141, 125, 255, 0.95)" };
  }
  return { a: "#202020", b: "#0d0d0f", c: "#313236", hot: "#5ffff6", glow: "rgba(82, 255, 246, 0.95)" };
}

function drawSpecialMarker(cell, cx, cy, length) {
  if (cell.type === "splitter") {
    ctx.fillStyle = cell.powered ? "#dfffff" : "#5ffff6";
    ctx.shadowColor = "rgba(82, 255, 246, 0.65)";
    ctx.shadowBlur = cell.powered ? 18 : 5;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(5, length * 0.14), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (cell.variant === "short") {
    ctx.fillStyle = "#ffd6df";
    ctx.font = `900 ${Math.max(12, length * 0.28)}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", cx, cy);
  }

  if (cell.variant === "spinner") {
    ctx.strokeStyle = "#d9d2ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(8, length * 0.2), 0.4, Math.PI * 1.6);
    ctx.stroke();
  }
}

function drawSegments(cx, cy, ports, length) {
  for (const port of ports) {
    const { dx, dy } = portVector(port);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + dx * length, cy + dy * length);
    ctx.stroke();
  }
}

function drawElectricSegments(cx, cy, ports, length) {
  for (const port of ports) {
    const { dx, dy } = portVector(port);
    const side = dx === 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let i = 1; i <= 9; i += 1) {
      const t = i / 9;
      const wiggle = Math.sin(t * Math.PI * 5) * 2.6;
      ctx.lineTo(cx + dx * length * t + Math.abs(dy) * wiggle * side, cy + dy * length * t + Math.abs(dx) * wiggle * side);
    }
    ctx.stroke();
  }
}

function drawCopperEnds(cx, cy, ports, length) {
  for (const port of ports) {
    const { dx, dy } = portVector(port);
    const ex = cx + dx * length;
    const ey = cy + dy * length;
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(dx !== 0 ? 0 : Math.PI / 2);
    const copper = ctx.createLinearGradient(-12, -8, 12, 8);
    copper.addColorStop(0, "#ffd6c5");
    copper.addColorStop(0.48, "#ff8e70");
    copper.addColorStop(1, "#ffd9c9");
    ctx.fillStyle = copper;
    ctx.strokeStyle = "#3a1510";
    ctx.lineWidth = 1.5;
    roundRect(-14, -8, 28, 16, 4);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(110, 37, 28, 0.55)";
    ctx.lineWidth = 1.2;
    for (let i = -9; i <= 9; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i - 5, -7);
      ctx.lineTo(i + 5, 7);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function portVector(port) {
  if (port === "n") return { dx: 0, dy: -1 };
  if (port === "e") return { dx: 1, dy: 0 };
  if (port === "s") return { dx: 0, dy: 1 };
  return { dx: -1, dy: 0 };
}

function drawBattery(cx, cy, tile) {
  const w = tile * 0.55;
  const h = tile * 0.68;
  ctx.shadowColor = "rgba(82, 255, 246, 0.55)";
  ctx.shadowBlur = 24;
  const batteryGradient = ctx.createLinearGradient(cx - w / 2, cy, cx + w / 2, cy);
  batteryGradient.addColorStop(0, "#0d8993");
  batteryGradient.addColorStop(0.45, "#23e1df");
  batteryGradient.addColorStop(1, "#08818c");
  ctx.fillStyle = batteryGradient;
  ctx.strokeStyle = "#05070a";
  ctx.lineWidth = 4;
  roundRect(cx - w / 2, cy - h / 2, w, h, 11);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${tile * 0.24}px Inter, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("+", cx, cy - h * 0.18);
  ctx.fillText("−", cx, cy + h * 0.25);
  ctx.shadowColor = "rgba(82, 255, 246, 0.8)";
  ctx.shadowBlur = 18;
  ctx.strokeStyle = "#5ffff6";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx + w / 2, cy);
  ctx.lineTo(cx + tile * 0.43, cy);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawLamp(cx, cy, tile, on) {
  if (on) {
    const glow = ctx.createRadialGradient(cx, cy - tile * 0.04, tile * 0.08, cx, cy - tile * 0.04, tile * 0.58);
    glow.addColorStop(0, "rgba(255, 239, 128, 0.76)");
    glow.addColorStop(0.45, "rgba(255, 216, 78, 0.22)");
    glow.addColorStop(1, "rgba(255, 216, 78, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy - tile * 0.04, tile * 0.58, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#06080c";
  ctx.lineWidth = 4;
  ctx.fillStyle = on ? "#ffe36e" : "#243048";
  ctx.shadowColor = on ? "rgba(255, 216, 78, 0.98)" : "rgba(102, 244, 255, 0.08)";
  ctx.shadowBlur = on ? 40 : 8;
  ctx.beginPath();
  ctx.arc(cx, cy - tile * 0.04, tile * 0.29, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = on ? "#fff7b0" : "#7d8895";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - tile * 0.13, cy + tile * 0.02);
  ctx.lineTo(cx, cy - tile * 0.11);
  ctx.lineTo(cx + tile * 0.13, cy + tile * 0.02);
  ctx.stroke();
  ctx.fillStyle = "#8c94a0";
  ctx.strokeStyle = "#06080c";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    roundRect(cx - tile * 0.16, cy + tile * (0.2 + i * 0.045), tile * 0.32, tile * 0.035, 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.strokeStyle = on ? "#5ffff6" : "#111";
  ctx.lineWidth = on ? 9 : 17;
  ctx.lineCap = "round";
  ctx.shadowColor = on ? "rgba(82, 255, 246, 0.85)" : "transparent";
  ctx.shadowBlur = on ? 18 : 0;
  ctx.beginPath();
  ctx.moveTo(cx - tile * 0.43, cy);
  ctx.lineTo(cx - tile * 0.28, cy);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function cellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const col = Math.floor(((event.clientX - rect.left) / rect.width) * size);
  const row = Math.floor(((event.clientY - rect.top) / rect.height) * size);
  if (!inBounds(row, col)) return null;
  return cells[row][col];
}

canvas.addEventListener("click", (event) => {
  if (solved || failed) return;
  const cell = cellFromEvent(event);
  if (!cell || ["empty", "battery", "lamp"].includes(cell.type)) return;
  playClickSound();
  cell.rotation = (cell.rotation + 1) % 4;
  moves += 1;
  hintedCell = null;
  updateCircuit(true);
});

hintButton.addEventListener("click", () => {
  playMenuSound();
  hintedCell = cells.flat().find((cell) => !["empty", "battery", "lamp"].includes(cell.type) && cell.path && cell.rotation !== cell.solution);
  drawBoard();
});

function chooseDifficulty(difficulty, { hideMenu = false } = {}) {
  if (!DIFFICULTIES[difficulty]) return;
  const targetLevel = getLastPlayableLevelForDifficulty(difficulty);
  if (!canOpenLevel(difficulty, targetLevel)) {
    const firstIndex = globalLevelIndex(difficulty, 1);
    const message =
      firstIndex > FREE_LEVELS && !isPremiumUnlocked()
        ? "Unlock VoltLoop Premium for $2.99 to play this episode."
        : "Complete earlier levels to unlock this episode.";
    openPaywall(message);
    renderLevelUI();
    return;
  }
  startLevel(difficulty, targetLevel, { hideMenu });
}

resetButton.addEventListener("click", () => {
  playMenuSound();
  buildBoard();
});
retryButton.addEventListener("click", () => {
  playMenuSound();
  buildBoard();
});
nextButton.addEventListener("click", () => {
  playMenuSound();
  nextLevel();
});
difficultyTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-difficulty]");
  if (!button) return;
  chooseDifficulty(button.dataset.difficulty);
});
levelGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-level]");
  if (!button) return;
  playMenuSound();
  const targetLevel = Number(button.dataset.level);
  if (!canOpenLevel(currentDifficulty, targetLevel)) {
    const targetIndex = globalLevelIndex(currentDifficulty, targetLevel);
    const message =
      targetIndex > FREE_LEVELS && !isPremiumUnlocked()
        ? "Unlock VoltLoop Premium for $2.99 to play levels beyond the free pack."
        : "Complete the previous level first.";
    openPaywall(message);
    return;
  }
  startLevel(currentDifficulty, targetLevel);
});

levelCardHead.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 760px)").matches) {
    openLevelSelect();
    return;
  }
  labPanel.classList.toggle("is-expanded");
});

levelStatusCard.addEventListener("click", openLevelSelect);

menuLevelsButton.addEventListener("click", () => {
  playMenuSound();
  openLevelSelect();
});

levelSelectCloseButton.addEventListener("click", closeLevelSelect);

levelSelectOverlay.addEventListener("click", (event) => {
  if (event.target === levelSelectOverlay) closeLevelSelect();
});

episodeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-level]");
  if (!button) return;
  playMenuSound();
  const difficulty = button.dataset.difficulty;
  const targetLevel = Number(button.dataset.level);
  if (startLevel(difficulty, targetLevel, { hideMenu: true, sound: false })) closeLevelSelect();
});

menuOverlay.addEventListener("click", (event) => {
  const difficultyButton = event.target.closest(".menu-difficulty");
  if (!difficultyButton) return;
  selectedMenuDifficulty = difficultyButton.dataset.difficulty;
  playMenuSound();
  renderLevelUI();
});

playButton.addEventListener("click", () => {
  chooseDifficulty(selectedMenuDifficulty, { hideMenu: true });
});

continueButton.addEventListener("click", () => {
  const next = getContinueLevel({ allowLockedPremium: true });
  startLevel(next.difficulty, next.level, { hideMenu: true });
});

menuButton.addEventListener("click", () => {
  playMenuSound();
  menuOverlay.classList.remove("is-hidden");
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle("is-on", soundEnabled);
  soundToggle.textContent = soundEnabled ? "Sound On" : "Sound Off";
  soundToggle.setAttribute("aria-pressed", soundEnabled.toString());
  if (soundEnabled) playMenuSound();
});

function openLegal(panel) {
  privacyPanel.hidden = panel !== "privacy";
  termsPanel.hidden = panel !== "terms";
  legalOverlay.classList.remove("is-hidden");
}

menuOverlay.addEventListener("click", (event) => {
  const legalButton = event.target.closest("[data-legal]");
  if (!legalButton) return;
  openLegal(legalButton.dataset.legal);
});

legalCloseButton.addEventListener("click", () => {
  legalOverlay.classList.add("is-hidden");
});

legalOverlay.addEventListener("click", (event) => {
  if (event.target === legalOverlay) legalOverlay.classList.add("is-hidden");
});

paywallCloseButton.addEventListener("click", () => {
  paywallOverlay.classList.add("is-hidden");
});

paywallOverlay.addEventListener("click", (event) => {
  if (event.target === paywallOverlay) paywallOverlay.classList.add("is-hidden");
});

unlockButton.addEventListener("click", async () => {
  playMenuSound();

  try {
    const result = await window.VoltLoopPurchases.purchasePremium();
    if (!result?.success) {
      paywallMessage.textContent = result?.cancelled
        ? "Purchase cancelled."
        : "Purchase could not be completed. Please try again.";
      return;
    }
  } catch {
    paywallMessage.textContent = "In-App Purchase is not available yet. Check the App Store product setup, then try again from TestFlight.";
    return;
  }

  setPremiumUnlocked();
  paywallOverlay.classList.add("is-hidden");
  paywallMessage.textContent = "Premium unlocked on this device.";
});

restorePurchaseButton.addEventListener("click", async () => {
  playMenuSound();
  try {
    const result = await window.VoltLoopPurchases.restorePremium();
    if (!result?.success) {
      paywallMessage.textContent = "No previous premium purchase was found for this Apple ID.";
      return;
    }
  } catch {
    paywallMessage.textContent = "Purchases could not be restored right now.";
    return;
  }

  paywallOverlay.classList.add("is-hidden");
  paywallMessage.textContent = "Premium restored on this device.";
});

const [previewMode, previewQuery = ""] = window.location.hash.slice(1).split("?");
const previewParams = new URLSearchParams(previewQuery);
const savedStart = getContinueLevel();
currentDifficulty = savedStart.difficulty;
currentLevel = savedStart.level;
selectedMenuDifficulty = savedStart.difficulty;

if (previewMode === "game-preview") {
  document.body.classList.add("is-appstore-shot");
  const previewDifficulty = previewParams.get("difficulty");
  const previewLevel = Number(previewParams.get("level")) || 1;
  if (DIFFICULTIES[previewDifficulty]) {
    currentDifficulty = previewDifficulty;
    currentLevel = Math.min(Math.max(previewLevel, 1), DIFFICULTIES[previewDifficulty].count);
    selectedMenuDifficulty = previewDifficulty;
  }
}

renderLevelUI();
buildBoard();
if (previewMode === "paywall-preview") {
  document.body.classList.add("is-appstore-shot");
  openPaywall("You finished the free pack. Unlock premium access for $2.99, then keep opening levels one by one.");
}
if (previewMode === "game-preview") {
  menuOverlay.classList.add("is-hidden");
}
if (previewMode === "levels-preview") {
  menuOverlay.classList.add("is-hidden");
  openLevelSelect();
}
