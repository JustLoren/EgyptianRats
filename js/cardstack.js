
// ES6: class CardStack extends BaseSprite { ... }
var CardStack = function CardStack(team, game, x, y) {
  this.team = team;

  BaseSprite.call(this, game, x, y, 'deckempty', 0);    

  this.anchor.setTo(.5, .5);

  this.cards = [];

  this.updateGraphic();
};


CardStack.preload = function preload(game) {
  
};

CardStack.prototype = Object.create(BaseSprite.prototype);

CardStack.prototype.constructor = CardStack;

CardStack.prototype.update = function update() {
  BaseSprite.prototype.update.call(this);
};

CardStack.prototype.getCardCount = function getCardCount() {
  return this.cards.length;
};

CardStack.prototype.addCards = function addCards(cards) {
  this.cards = this.cards.concat(cards);
  this.updateGraphic();
};

CardStack.prototype.removeCard = function removeCard() {
  var returnCard;
  if (this.cards.length > 0) {
    returnCard = this.cards.splice(0, 1);
  } else {
    returnCard = undefined;
  }
  this.updateGraphic();

  return returnCard;
};

CardStack.prototype.updateGraphic = function updateGraphic() {
  if (this.team > -1) {
    if (this.cards.length > 0) {
      this.loadTexture('cardback');
    } else {
      this.loadTexture('deckempty');
    }
  } else {
    if (this.cards.length > 0) {
      this.loadTexture(this.cards[this.cards.length - 1].key);
    } else {
      this.loadTexture('clear');
    }
  }
};
