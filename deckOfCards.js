"use strict";

const CARD_API_URL = "https://deckofcardsapi.com/api/deck/";

const $drawButton = $(".draw");

let deckId; //don't use screaming snake case, not a global constant

/** Call the deck of cards api to get a deck and its id */
async function generateDeck() {
  const deck = await fetch(`${CARD_API_URL}/new/shuffle`);
  const deckData = await deck.json();
  deckId = deckData.deck_id;
}

/** Call the deck of cards api and get a card. Append the card's image
 * to the dom and update the button to reflect the amount of remaining cards
 */
async function drawACard() {
  const response = await fetch(`${CARD_API_URL}/${deckId}/draw`);
  const data = await response.json();

  const remainingCards = data.remaining;
  const cardImage = data.cards[0].image;
  const $imageElement =
    $("<img>", { src: cardImage, class: "card", alt: `${data.cards[0].code}` });

  $drawButton.text(`Draw a card (${remainingCards})`);

  if (remainingCards < 1) {
    $(".draw").hide();
  }

  $(".card-container").append($imageElement);
}

$drawButton.on("click", drawACard);

generateDeck();