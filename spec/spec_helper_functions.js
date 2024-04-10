const findCardsWithSameEmoji = () => {
  const cards = document.querySelectorAll(".card");
  const cardsWithSameEmoji = [];
  let foundCards = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (foundCards < 2) {
      cardsWithSameEmoji.push(card);
      foundCards++;
    }

    if (foundCards === 2) {
      break;
    }
  }

  return cardsWithSameEmoji;
};

const findCardsWithDifferentEmojis = () => {
  const cards = document.querySelectorAll(".card");
  const cardsWithDifferentEmojis = [];
  let foundCards = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    if (foundCards < 2) {
      cardsWithDifferentEmojis.push(card);
      foundCards++;
    }

    if (foundCards === 2) {
      break;
    }
  }

  return cardsWithDifferentEmojis;
};

const returnLastCard = () => {
  const cards = document.querySelectorAll(".card");

  for (let i = 0; i < cards.length - 1; i++) {
    cards[i].classList.add("flipped");
  }

  return cards[cards.length - 1];
};

module.exports = {
  findCardsWithSameEmoji,
  findCardsWithDifferentEmojis,
  returnLastCard,
};
