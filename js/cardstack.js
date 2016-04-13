
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

  this.cards.forEach(function (card) {
    if (this.team == 0)
      card.orientation = -1;
    else if (this.team == 1)
      card.orientation = 1;
  }, this);
  this.updateGraphic();
};

CardStack.prototype.pushCards = function pushCards(cards) {
  if (cards) {
    cards.forEach(function (card) {
      if (this.team == 0)
        card.orientation = -1;
      else if (this.team == 1)
        card.orientation = 1;
    }, this);

    this.cards = cards.concat(this.cards);

    this.updateGraphic();
  }
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

CardStack.prototype.discardCards = function discardCards(count) {
  if (count <= 0) {
    alert('cant discard zero cards');
    return undefined;
  }
  var returnCards;
  if (this.cards.length >= count) {
    returnCards = this.cards.splice(-count, count);
  } else {
    returnCards = undefined;
  }
  this.updateGraphic();

  return returnCards;
};

CardStack.prototype.clearStack = function clearStack() {
  var cards = this.cards;
  this.cards = [];

  this.updateGraphic();

  return cards;
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
      this.scale.setTo(1, this.cards[this.cards.length - 1].orientation);      
    } else {
      this.loadTexture('clear');
    }
  }
};

CardStack.prototype.canGrab = function canGrab() {
  
  var lastCard = this.cards.length - 1;
  var secondToLastCard = this.cards.length - 2;
  var thirdToLastCard = this.cards.length - 3;

  //Pairs can be grabbed
  if (secondToLastCard >= 0 && this.cards[lastCard].number == this.cards[secondToLastCard].number)
    return true;

  //As can sandwiches
  else if (thirdToLastCard >= 0 && this.cards[lastCard].number == this.cards[thirdToLastCard].number)
    return true;

  //Everything else is bad
  else
    return false;
};
