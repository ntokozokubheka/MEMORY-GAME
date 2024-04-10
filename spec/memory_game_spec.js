const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const index = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");
const bundle = fs.readFileSync(
  path.join(__dirname, "../dist/bundle.js"),
  "utf-8"
);

const {
  findCardsWithSameEmoji,
  findCardsWithDifferentEmojis,
  returnLastCard,
} = require("./spec_helper_functions.js");

const { expectedHTML } = require("./spec_helper_variable.js");

describe("Memory Game", () => {
  let jsdom, restartButton, configureButton, cardFront, cardElement;

  beforeEach(() => {
    jsdom = new JSDOM(index, {
      runScripts: "dangerously",
      resources: "usable",
    });

    global.document = jsdom.window.document;
    const script = document.createElement("script");
    script.textContent = bundle;
    document.head.appendChild(script);
    jasmine.clock().install();
    restartButton = document.getElementById("restart");
    configureButton = document.getElementById("set-dimension");
    cardFront = document.querySelector(".card-front");
    cardElement = document.querySelector(".card");
    movesElement = document.querySelector(".moves");
    timerElement = document.querySelector(".timer");
    timerElement.innerText = "100 seconds";
    movesElement.innerText = "15 Moves";
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should have the reset button hidden before the game starts", () => {
    expect(restartButton.style.display).toBe("none");
  });

  it("should display the reset button when the game starts", () => {
    cardFront.click();

    expect(restartButton.style.display).toBe("block");
  });

  it("should flip a card on click", () => {
    cardFront.click();

    expect(cardElement.classList.contains("flipped")).toBe(true);
  });

  it("should update moves after clicking on a card", () => {
    cardElement.click();

    jasmine.clock().tick(1001);

    expect(movesElement.innerText).toBe("1 Moves");
  });

  it("should update time to 1 second after clicking a card and starting the game", () => {
    cardElement.click();

    jasmine.clock().tick(1001);

    expect(timerElement.innerText).toBe("Time : 1 Sec");
  });

  it("should reset game after clicking the restart button", () => {
    restartButton.click();

    expect(timerElement.innerText).toBe("Time : 0 Secs");
    expect(movesElement.innerText).toBe("0 Moves");
  });

  it("should flip cards back after two cards that are not the same are chosen", () => {
    const cardsWithDifferentEmojis = findCardsWithDifferentEmojis();

    cardsWithDifferentEmojis[0].innerText = "not the same card.";

    cardsWithDifferentEmojis[0].querySelector(".card-front").click();

    jasmine.clock().tick(1001);

    expect(cardsWithDifferentEmojis[0].classList.contains("flipped")).toBe(
      true
    );

    cardsWithDifferentEmojis[1].querySelector(".card-front").click();

    jasmine.clock().tick(1001);

    expect(cardsWithDifferentEmojis[0].classList.contains("flipped")).toBe(
      false
    );
  });

  it("should flip over cards and match them when they are the same", () => {
    const cardsWithSameEmoji = findCardsWithSameEmoji();

    cardsWithSameEmoji[0].querySelector(".card-front").click();
    jasmine.clock().tick(1001);
    cardsWithSameEmoji[1].querySelector(".card-front").click();
    jasmine.clock().tick(1001);
    expect(cardsWithSameEmoji[0].classList.contains("matched")).toBe(true);
  });

  it("should display win text after game is completed", () => {
    const lastCard = returnLastCard();

    const cardFront = lastCard.querySelector(".card-front");
    cardFront.click();

    jasmine.clock().tick(1001);

    const winText = document.querySelector(".win-text");

    expect(winText.innerHTML.toString()).toContain(expectedHTML);
  });

  it("should allow configuration for a board with dimensions of 2 by 2", () => {
    configureButton.click();
    const selectField = document.querySelector(".select-field");
    selectField.value = "2x3";

    const confirmButton = document.querySelector(".confirm-button");

    confirmButton.click();

    expect(document.querySelectorAll(".card").length).toBe(6);
  });

  it("should display error message for invalid dimension entry", () => {
    configureButton.click();
    const selectField = document.querySelector(".select-field");
    selectField.value = "2x#";

    const confirmButton = document.querySelector(".confirm-button");

    confirmButton.click();

    expect(document.querySelector(".red-text").innerHTML.toString()).toBe(
      "Please select a valid option. Choose the correct entry from the available choices."
    );
  });

  it("should hide the configure button after the game is completed", () => {
    const lastCard = returnLastCard();

    const cardFront = lastCard.querySelector(".card-front");
    cardFront.click();

    jasmine.clock().tick(1001);

    expect(configureButton.style.display).toBe("none");
  });
});
