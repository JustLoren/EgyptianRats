// jscs:disable

var DefaultState = function DefaultState() {
  Phaser.State.call(this);
};

DefaultState.prototype = Object.create(Phaser.State.prototype);

DefaultState.prototype.constructor = DefaultState;

DefaultState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);

  this.tappable = true;
  this.responseEvent;
  this.currentTurn = Math.floor(Math.random() * 2);
  this.cardsToDeal = 1;

  //this.bkg = this.game.add.image(0, 0, 'bkg');
  this.bkg = this.game.add.bitmapData(GAME_W, GAME_H);
  this.bkg.fill(128, 128, 0, 1);
  this.bkg.addToWorld();
  
  this.playArea = new CardStack(-1, this.game, GAME_W / 2, GAME_H / 2);
  this.game.add.existing(this.playArea);

  this.attackSound = this.game.add.audio('attack');
  this.attackFailedSound = this.game.add.audio('attack-failed');
  this.playCardSound = this.game.add.audio('playCard');
  
  this.teams = [];
  
  this.teams.push({
    number: 0,
    stack: new CardStack(0, this.game, 60, 120),
    healthIndicator: new HealthIndicator(0, this.game, 525, 175, 'healthindicator'),
    invalidResponse: new Phaser.Sprite(this.game, 540, 770, 'invalid-tap'),
    validResponse: new Phaser.Sprite(this.game, 540, 770, 'valid-tap'),
    turnIndicator: new Phaser.Group(this.game),
    attackButton: new PressableButton(this.triggerTap, this, 0, this.game, 900, 180, 'attack-0'),
    dealButton: new PressableButton(this.cardDrop, this, 0, this.game, 180, 180, 'deal-0'),
  });

  this.teams.push({
    number: 1,
    stack: new CardStack(1, this.game, 1000, 1800),
    healthIndicator: new HealthIndicator(1, this.game, 525, 1750, 'healthindicator'),
    //540 x 1356
    invalidResponse: new Phaser.Sprite(this.game, 540, 1150, 'invalid-tap'),
    validResponse: new Phaser.Sprite(this.game, 540, 1150, 'valid-tap'),
    turnIndicator: new Phaser.Group(this.game),
    attackButton: new PressableButton(this.triggerTap, this, 1, this.game, 180, 1750, 'attack-1'),
    dealButton: new PressableButton(this.cardDrop, this, 1, this.game, 900, 1750, 'deal-1'),
  });

  for (var idx in this.teams) {
    var team = this.teams[idx];
    if (team.stack) {
      
      this.game.add.existing(team.turnIndicator);
            

      //team.turnIndicator.x = 250;

      if (team.number == 0) {
        for (var i = 3; i > 0; i--) {
          team.turnIndicator.create(250 * i + 100, 100, 'card-play-empty');
          team.turnIndicator.children[team.turnIndicator.children.length - 1].scale.setTo(-1, -1);
        }

        team.turnIndicator.x = 0;
        team.turnIndicator.y = 425;

        team.attackButton.scale.setTo(-1, -1);
        team.dealButton.scale.setTo(-1, -1);
        
      } else if (team.number == 1) {
        for (var i = 0; i < 3; i++) {
          team.turnIndicator.create(250 * i, 0, 'card-play-empty');
        }

        team.turnIndicator.x = 250;
        team.turnIndicator.y = 1400;
      }

      this.game.add.existing(team.stack);

      team.healthIndicator.anchor.setTo(.5, .5);

      team.healthIndicator.updatePosition(.5);

      this.game.add.existing(team.healthIndicator);

      team.attackButton.anchor.setTo(.5, .5);
      this.game.add.existing(team.attackButton);

      team.dealButton.anchor.setTo(.5, .5);
      this.game.add.existing(team.dealButton);

      if (idx == 0) {
        team.invalidResponse.scale.setTo(-1, -1);
        team.validResponse.scale.setTo(-1, -1);
      }

      team.invalidResponse.anchor.setTo(.5, .5);
      team.validResponse.anchor.setTo(.5, .5);
      
      this.game.add.existing(team.invalidResponse);
      this.game.add.existing(team.validResponse);

      team.invalidResponse.visible = false;
      team.validResponse.visible = false;
    }
  }
    
  var deck = this.createDeck();
  this.teams[0].stack.addCards(deck.splice(0, deck.length / 2));
  this.teams[1].stack.addCards(deck);

  //red play area: x: 2, y: 207, width: 1080, height 726

  //blue play area: x: 2, y: 986, width: 1076, height: 726
  
  this.updateTurnDisplay();
  this.updateHealthIndicators();
};

DefaultState.prototype.triggerTap = function triggerTap(team) {  
  if (this.tappable) {    

    var responseSprite;
    var isValidTap = this.playArea.canGrab();
    if (isValidTap) {
      responseSprite = this.teams[team].validResponse;
      this.teams[team].stack.addCards(this.playArea.clearStack());
      this.attackSound.play();
    }
    else {
      this.attackFailedSound.play();
      responseSprite = this.teams[team].invalidResponse;
      if (this.teams[team].stack.getCardCount() > 0) {
        this.playArea.pushCards(this.teams[team].stack.discardCards(2));
        if (this.teams[team].stack.getCardCount() == 0 && this.currentTurn == team) {
          this.advanceTurn(1);
          this.updateTurnDisplay();
        }
      } else if (this.teams.length == 2) {
        this.teams[(team + 1) % this.teams.length].stack.addCards(this.playArea.clearStack());
      }
    }

    this.updateHealthIndicators();

    responseSprite.visible = true;
    this.tappable = false;

    this.responseEvent = game.time.events.add(Phaser.Timer.SECOND * 2, this.endTapResponse, this);
  }
};

DefaultState.prototype.endTapResponse = function endTapResponse() {  
    this.tappable = true;
    this.teams.forEach(function (team) {
      team.invalidResponse.visible = false;
      team.validResponse.visible = false;
    }, this);
};

DefaultState.prototype.updateHealthIndicators = function updateHealthIndicators() {
  var remaining = this.teams[0].stack.getCardCount();
  
  var percentage = remaining / CARDS_IN_DECK;
  this.bkg.fill(0, 0, 0, 1);

  var offset = (GAME_H - 50) * percentage;

  this.bkg.rect(10, 10, GAME_W - 20, (GAME_H - 50) * percentage, "#e400ff");

  var remaining2 = this.teams[1].stack.getCardCount();

  var percentage2 = remaining2 / CARDS_IN_DECK;

  
  var height = (GAME_H - 50) * percentage2;
  this.bkg.rect(10, GAME_H - 10 - height, GAME_W - 20, height, "#00c9ff");

  this.checkForGameEnd();
}

DefaultState.prototype.update = function update() {
  Phaser.State.prototype.update.call(this);
   
};

DefaultState.prototype.cardDrop = function cardDrop(team) {
  if (team == this.currentTurn && this.teams[team].stack.getCardCount() > 0) {
    this.endTapResponse();
    game.time.events.remove(this.responseEvent);
    var playCards = this.teams[team].stack.removeCard();    
    
    this.playCardSound.play();

    if (playCards && playCards.length > 0) {
      var playCard = playCards[0];
      this.playArea.addCards(playCards);
      this.updateHealthIndicators();

      if (--this.cardsToDeal == 0 || playCard.interrupt || this.teams[this.currentTurn].stack.getCardCount() == 0) {
        this.advanceTurn(playCard.cardsToDeal);
      }

      this.updateTurnDisplay();
    }
  }
};

DefaultState.prototype.advanceTurn = function advanceTurn(cardCount) {
  
  for (var i = 0; i < this.teams.length; i++) {
    this.currentTurn = (this.currentTurn + 1) % this.teams.length;
    if (this.teams[this.currentTurn].stack.getCardCount() != 0) {
      this.cardsToDeal = cardCount;
      return;
    }
  }

  //uh oh, couldn't find someone to make the next turn
  this.currentTurn = -1;
  this.cardsToDeal = 0;  
};

DefaultState.prototype.checkForGameEnd = function checkForGameEnd() {
  var winCondition = -1;  

  for (var i = 0; i < this.teams.length; i++) {
    if (this.teams[i].stack.getCardCount() == CARDS_IN_DECK)
    {
      winCondition = i;
      break;
    }
  }

  if (winCondition > -1) {
    game.state.start('winner' + winCondition);
  } else if (this.playArea.getCardCount() == CARDS_IN_DECK && !this.playArea.canGrab()) {
    game.state.start('draw');
  }
};

DefaultState.prototype.updateTurnDisplay = function updateTurnDisplay() {

  this.teams.forEach(function (team) {

    var isTurn = team.stack.getCardCount() > 0 && this.currentTurn == team.number;
    team.healthIndicator.toggleState(isTurn);

    for (var i = 0; i < 3; i++) {
      if (this.currentTurn != team.number) {
        team.turnIndicator.visible = false;
      } else {
        team.turnIndicator.visible = true;
        if (i + 1 <= this.cardsToDeal) {
          team.turnIndicator.children[i].loadTexture('card-play-filled');
        } else {
          team.turnIndicator.children[i].loadTexture('card-play-empty');
        }
      }
    }

  }, this);
};

var DRAW_DEBUG_BOXES = false;

DefaultState.prototype.render = function render() {
  
  Phaser.State.prototype.render.call(this);

  if (DRAW_DEBUG_BOXES) {

    //game.debug.text('Demon z-depth: ' + this.demon.z + ' ... Demon y-value: ' + this.demon.y, 10, 20);
    //game.debug.text('Torch1 z-depth: ' + this.symbol.children[0].z + ' ... y-value: ' + this.symbol.children[0].y, 10, 40);
    //game.debug.text('Torch2 z-depth: ' + this.symbol.children[1].z + ' ... y-value: ' + this.symbol.children[1].y, 10, 60);
    //game.debug.text('Torch3 z-depth: ' + this.symbol.children[2].z + ' ... y-value: ' + this.symbol.children[2].y, 10, 80);
    //game.debug.text('Monk z-depth: ' + this.testMonk.z + ' ... Monk y-value: ' + this.testMonk.y, 10, 100);
    //game.debug.text('Background z-depth: ' + this.bkg.z, 10, 40);


    //this.game.debug.body(this.demon);

  }

};

DefaultState.prototype.createDeck = function createDeck() {
  var deck = [];

  var dragons = [0, 1, 2, 3];
  var others = [4, 5, 6, 7, 8, 9, 10, 11, 12];

  while (dragons.length > 1) {
    dragons.splice(Math.floor(Math.random() * dragons.length), 1);
  }

  while (others.length > 4) {
    others.splice(Math.floor(Math.random() * others.length), 1);
  }

  for (var i = 0; i < 4; i++) {
    for (var k = 0; k < 3; k++) {
      deck.push({
        color: i,
        number: dragons[0],
        key: 'card' + i + '-' + dragons[0],
        orientation: 1,
        interrupt: true,
        cardsToDeal: 3,
      });
    }
  }

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < others.length; j++) {
      for (var k = 0; k < 3; k++) {
        deck.push({
          color: i,
          number: others[j],
          key: 'card' + i + '-' + others[j],
          orientation: 1,
          interrupt: false,
          cardsToDeal: 1,
        });
      }
    }
  }

  this.shuffle(deck);

  return deck;
};

DefaultState.prototype.shuffle = function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
