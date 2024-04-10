const {
  selectors,
  state,
  attributes,
  displayMessages,
  dimensionOptions,
  emojis,
  errorMessages,
} = require("./helper_objects.js");

const shuffle = (rows, columns) => {
  const dimensions = rows * columns;

  const picks = pickRandom(emojis, dimensions / 2);
  const clonedArray = [...picks, ...picks];

  for (let index = clonedArray.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const original = clonedArray[index];

    clonedArray[index] = clonedArray[randomIndex];
    clonedArray[randomIndex] = original;
  }

  return clonedArray;
};

const pickRandom = (array, items) => {
  const clonedArray = [...array];
  const randomPicks = [];

  for (let index = 0; index < items; index++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);

    randomPicks.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }

  return randomPicks;
};

const updateTimerAndMoves = () => {
  state.totalTime++;
  selectors.moves.innerText = `${state.totalFlips} Moves`;
  if (state.totalTime > 59) {
    const minutes = Math.floor(state.totalTime / 60);
    const remainingSeconds = state.totalTime % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    selectors.timer.innerText = `Time : ${formattedMinutes} Mins : ${formattedSeconds} Secs`;
  } else if (state.totalTime < 2) {
    selectors.timer.innerText = `Time : ${state.totalTime} Sec`;
  } else {
    selectors.timer.innerText = `Time : ${state.totalTime} Secs`;
  }
};

const startGame = () => {
  state.gameStarted = true;
  selectors.restart.style.display = "block";

  state.loop = setInterval(updateTimerAndMoves, 1000);
};

const resumeGame = () => {
  if (state.gamePause) {
    state.loop = setInterval(updateTimerAndMoves, 1000);
    state.gameStarted = true;
  }
};

const flipBackCards = () => {
  const cards = document.querySelectorAll(".card:not(.matched)");
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove(attributes.flipped);
  }
  state.flippedCards = 0;
};

const checkMatchedCards = () => {
  const flippedCards = document.querySelectorAll(".flipped:not(.matched)");
  if (flippedCards[0].innerText === flippedCards[1].innerText) {
    flippedCards[0].classList.add(attributes.matched);
    flippedCards[1].classList.add(attributes.matched);
  }

  setTimeout(() => {
    flipBackCards();
  }, 1000);
};

const endGame = () => {
  setTimeout(() => {
    selectors.configure.style.display = "none";
    const myTime = state.totalTime;
    const minutes = Math.floor(myTime / 60);
    const remainingSeconds = myTime % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    selectors.timer.innerText = "";
    selectors.moves.innerText = "";

    selectors.boardContainer.classList.add(attributes.flipped);
    selectors.win.innerHTML = `<span class="win-text">You won the game<br/>with<br><span class="highlight">${state.totalFlips}</span> moves<br />in<br> <span class="highlight" style="white-space: nowrap;">${formattedMinutes} Mins : ${formattedSeconds} Secs</span></span>`;

    clearInterval(state.loop);
  }, 1000);
};

const flipCard = (card) => {
  state.flippedCards++;
  state.totalFlips++;

  if (!state.gameStarted) {
    startGame();
  }

  if (state.gameStarted) {
    selectors.restart.style.display = "block";
  }
  if (state.flippedCards <= 2) {
    card.classList.add(attributes.flipped);
  }

  if (state.flippedCards === 2) {
    checkMatchedCards();
  }

  if (!document.querySelectorAll(".card:not(.flipped)").length) {
    endGame();
  }
};

const clickEventListener = (event) => {
  if (!state.clickEnabled) return;

  const eventTarget = event.target;
  const eventParent = eventTarget.parentElement;

  if (
    eventTarget.className.includes(attributes.card) &&
    !eventParent.className.includes(attributes.flipped)
  ) {
    state.clickEnabled = false;

    flipCard(eventParent);

    setTimeout(() => {
      state.clickEnabled = true;
    }, 1000);
  }
};

const createModalOverlay = () => {
  const modalOverlay = document.createElement("div");
  modalOverlay.classList.add("modal-overlay");
  return modalOverlay;
};

const createPromptBox = () => {
  const promptBox = document.createElement("div");
  promptBox.classList.add("prompt-box");

  const promptMessage = document.createElement("p");
  promptMessage.textContent = displayMessages.dimensionsHelp;
  promptMessage.classList.add("prompt-message");
  promptBox.appendChild(promptMessage);

  return promptBox;
};

const createSelectField = () => {
  const selectField = document.createElement("select");
  selectField.classList.add("select-field");
  const currentDim = `${state.rows}x${state.cols}`;
  dimensionOptions.forEach((optionText) => {
    if (optionText !== currentDim) {
      const option = document.createElement("option");
      option.value = optionText;
      option.text = optionText;
      selectField.appendChild(option);
    }
  });

  return selectField;
};

const createConfirmButton = () => {
  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.classList.add("confirm-button");

  return confirmButton;
};

const createCancelButton = (modalOverlay) => {
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button");
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(modalOverlay);
    selectors.configure.style.display = "block";
    resumeGame();
  });

  return cancelButton;
};

const assemblePromptBoxElements = (
  modalOverlay,
  promptBox,
  selectField,
  confirmButton,
  cancelButton
) => {
  promptBox.appendChild(selectField);
  promptBox.appendChild(confirmButton);
  promptBox.appendChild(cancelButton);
  modalOverlay.appendChild(promptBox);
  document.body.appendChild(modalOverlay);
};

const promptBoxElement = () => {
  const modalOverlay = createModalOverlay();
  const promptBox = createPromptBox();
  const selectField = createSelectField();
  const confirmButton = createConfirmButton();
  const cancelButton = createCancelButton(modalOverlay);

  assemblePromptBoxElements(
    modalOverlay,
    promptBox,
    selectField,
    confirmButton,
    cancelButton
  );

  return { modalOverlay, selectField, confirmButton };
};

const addRedText = (errorMessage) => {
  let redText = document.querySelector(".red-text");

  if (!redText) {
    redText = document.createElement("p");
    redText.classList.add("red-text");
    redText.style.color = "red";
    redText.style.marginTop = "5px";

    const promptBox = document.querySelector(".prompt-box");
    promptBox.appendChild(redText);
  }

  redText.textContent = errorMessage;

  if (redText.timer) {
    clearTimeout(redText.timer);
  }

  redText.timer = setTimeout(() => {
    redText.textContent = "";
  }, 3000);
};

const createCardElement = (item) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  cardBack.textContent = item;

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  return card;
};

const clearBoard = () => {
  const boardDiv = selectors.board;
  clearInterval(state.loop);
  state.gameStarted = false;
  boardDiv.innerHTML = "";
};

const validateDimensions = (rows, columns) => {
  if (
    [rows, columns].some((dim) => isNaN(dim) || dim <= 1) ||
    rows > 6 ||
    columns > 6 ||
    (rows * columns) % 2 !== 0
  ) {
    addRedText(errorMessages.errorDimensions);
    return false;
  }
  return true;
};

const stopGame = () => {
  state.gameStarted = false;
  state.totalFlips = 0;
  state.totalTime = 0;
  clearInterval(state.loop);
  state.flippedCards = 0;
  selectors.timer.innerText = "Time : 0 Secs";
  selectors.moves.innerText = "0 Moves";
};

module.exports = {
  shuffle,
  clickEventListener,
  createCardElement,
  clearBoard,
  validateDimensions,
  promptBoxElement,
  stopGame,
};
