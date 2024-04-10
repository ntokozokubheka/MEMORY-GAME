const selectors = {
  boardContainer: document.querySelector(".board-container"),
  board: document.querySelector(".board"),
  moves: document.querySelector(".moves"),
  timer: document.querySelector(".timer"),
  start: document.querySelector("button"),
  configure: document.getElementById("set-dimension"),
  restart: document.getElementById("restart"),
  win: document.querySelector(".win"),
  controls: document.querySelector(".controls"),
};

const state = {
  gameStarted: false,
  flippedCards: 0,
  totalFlips: 0,
  totalTime: 0,
  gamePause: true,
  clickEnabled: true,
  loop: null,
  rows: 4,
  cols: 4,
};

const attributes = {
  flipped: "flipped",
  matched: "matched",
  card: "card",
};

const errorMessages = {
  errorDimensions:
    "Please select a valid option. Choose the correct entry from the available choices.",
};

const displayMessages = {
  dimensionsHelp: "Please select a grid size below to start playing.",
};

const emojis = [
  "🍎",
  "🍌",
  "🍊",
  "🍇",
  "🍉",
  "🍓",
  "🍍",
  "🥭",
  "🥝",
  "🍑",
  "🍐",
  "🍋",
  "🥦",
  "🥕",
  "🥬",
  "🍅",
  "🥒",
  "🍈",
];

const dimensionOptions = [
  "select",
  "2x3",
  "2x4",
  "2x5",
  "2x6",
  "3x4",
  "3x6",
  "4x2",
  "4x3",
  "4x4",
  "4x5",
];

module.exports = {
  attributes,
  state,
  selectors,
  errorMessages,
  emojis,
  dimensionOptions,
  displayMessages,
};
