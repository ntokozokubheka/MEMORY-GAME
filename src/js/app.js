const { selectors, attributes, state } = require("./helper_objects.js");

const {
  shuffle,
  clickEventListener,
  createCardElement,
  clearBoard,
  validateDimensions,
  promptBoxElement,
  stopGame,
} = require("./helper_functions.js");

const generateGame = (rows, columns) => {
  selectors.configure.style.display = "block";
  selectors.restart.style.display = "none";

  const items = shuffle(rows, columns);

  const cardsContainer = document.createElement("div");
  cardsContainer.classList.add("board");
  cardsContainer.style.gridTemplateColumns = `repeat(${columns}, auto)`;
  cardsContainer.style.gridTemplateRows = `repeat(${rows}, auto)`;

  items.forEach((item) => {
    const card = createCardElement(item);
    cardsContainer.appendChild(card);
  });

  const currentBoard = document.querySelector(".board");
  if (currentBoard) {
    currentBoard.replaceWith(cardsContainer);
  } else {
    selectors.boardContainer.appendChild(cardsContainer);
  }
};

const restartGame = () => {
  const boardDiv = document.querySelector(".board");
  selectors.restart.style.display = "none";
  selectors.configure.style.display = "block";
  selectors.boardContainer.classList.remove(attributes.flipped);
  state.clickEnabled = true;

  stopGame();
  generateGame(state.rows, state.cols);
  boardDiv.innerHTML = "";
};

const attachEventListeners = () => {
  selectors.configure.addEventListener("click", configureDimension);
  selectors.restart.addEventListener("click", restartGame);
  document.addEventListener("click", clickEventListener);
};

const configureGameDimensions = () => {
  const { modalOverlay, selectField, confirmButton } = promptBoxElement();

  confirmButton.addEventListener("click", () => {
    const [rows, columns] = selectField.value
      .trim()
      .split("x")
      .map((dim) => parseInt(dim.trim(), 10));

    if (validateDimensions(rows, columns)) {
      stopGame();
      state.rows = rows;
      state.cols = columns;
      generateGame(rows, columns);
      document.body.removeChild(modalOverlay);
    }
  });
};

const configureDimension = () => {
  state.gamePause = state.gameStarted;
  clearBoard();
  configureGameDimensions();
};

generateGame(state.rows, state.cols);
attachEventListeners();
