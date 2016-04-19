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

  this.bkg = this.game.add.image(0, 0, 'bkg');
  
  this.playArea = new CardStack(-1, this.game, GAME_W / 2, GAME_H / 2);
  this.game.add.existing(this.playArea);
  
  this.teams = [];
  
  this.teams.push({
    number: 0,
    stack: new CardStack(0, this.game, 60, 120),
    cardBack: new CardBack(0, this.game, this, 60, 120),
    healthIndicator: new HealthIndicator(0, this.game, 525, 109, 'healthindicator'),
    invalidResponse: new Phaser.Sprite(this.game, 540, 558, 'invalid-tap'),
    validResponse: new Phaser.Sprite(this.game, 540, 558, 'valid-tap'),
    turnIndicator: new Phaser.Group(this.game),
  });

  this.teams.push({
    number: 1,
    stack: new CardStack(1, this.game, 1000, 1800),
    cardBack: new CardBack(1, this.game, this, 1000, 1800),
    healthIndicator: new HealthIndicator(1, this.game, 525, 1803, 'healthindicator'),
    //540 x 1356
    invalidResponse: new Phaser.Sprite(this.game, 540, 1356, 'invalid-tap'),
    validResponse: new Phaser.Sprite(this.game, 540, 1356, 'valid-tap'),
    turnIndicator: new Phaser.Group(this.game),
  });

  for (var idx in this.teams) {
    var team = this.teams[idx];
    if (team.stack) {
      
      this.game.add.existing(team.turnIndicator);
            

      team.turnIndicator.x = 250;

      if (team.number == 0) {
        for (var i = 5; i > 0; i--) {
          team.turnIndicator.create(125 * i, 0, 'card-play-empty');
        }

        team.turnIndicator.x = 125;
        team.turnIndicator.y = 215;
        
      } else if (team.number == 1) {
        for (var i = 0; i < 5; i++) {
          team.turnIndicator.create(125 * i, 0, 'card-play-empty');
        }

        team.turnIndicator.x = 250;
        team.turnIndicator.y = 1600;
      }

      this.game.add.existing(team.stack);

      team.healthIndicator.anchor.setTo(.5, .5);

      team.healthIndicator.updatePosition(.5);

      this.game.add.existing(team.healthIndicator);

      this.game.add.existing(team.cardBack);

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

  this.game.input.onDown.add(function (pointer) {
    if (!this.tappable)
      return;

    var canGrab = this.playArea.canGrab();
    if (pointer.y > 207 && pointer.y < 933) {
      if (canGrab) {
        this.teams[0].stack.addCards(this.playArea.clearStack());
        this.triggerTap(0, true);
      } else {
        this.playArea.pushCards(this.teams[0].stack.discardCards(2));
        this.triggerTap(0, false);
      }
      this.updateHealthIndicator(0);
    } else if (pointer.y > 986 && pointer.y < 1712) {
      if (canGrab) {
        this.teams[1].stack.addCards(this.playArea.clearStack());
        this.triggerTap(1, true);
      } else {
        this.playArea.pushCards(this.teams[1].stack.discardCards(2));
        this.triggerTap(1, false);
      }
      this.updateHealthIndicator(1);
    }
  }, this);
  
  this.updateTurnDisplay();
};

DefaultState.prototype.triggerTap = function triggerTap(team, isValidTap) {
  var responseSprite;
  if (isValidTap)
    responseSprite = this.teams[team].validResponse;
  else
    responseSprite = this.teams[team].invalidResponse;

  responseSprite.visible = true;
  this.tappable = false;

  this.responseEvent = game.time.events.add(Phaser.Timer.SECOND * 2, this.endTapResponse, this);
};

DefaultState.prototype.endTapResponse = function endTapResponse() {  
    this.tappable = true;
    this.teams.forEach(function (team) {
      team.invalidResponse.visible = false;
      team.validResponse.visible = false;
    }, this);
};

DefaultState.prototype.updateHealthIndicator = function updateHealthIndicator(team) {
  var remaining = this.teams[team].stack.getCardCount();
  if (remaining == 0) {
    this.teams[team].cardBack.kill();
  }
  var percentage = remaining / 52;
  this.teams[team].healthIndicator.updatePosition(percentage);
}

DefaultState.prototype.update = function update() {
  Phaser.State.prototype.update.call(this);

  var _this = this;  
  
};

DefaultState.prototype.cardDrop = function cardDrop(team) {
  if (this.teams[team].stack.getCardCount() > 0) {
    this.endTapResponse();
    game.time.events.remove(this.responseEvent);
    var playCards = this.teams[team].stack.removeCard();    
    
    if (playCards && playCards.length > 0) {
      var playCard = playCards[0];
      this.playArea.addCards(playCards);
      this.updateHealthIndicator(team);

      if (--this.cardsToDeal == 0 || playCard.interrupt) {
        this.currentTurn = (this.currentTurn + 1) % this.teams.length;
        this.cardsToDeal = playCard.cardsToDeal;
      }

      this.updateTurnDisplay();
    }
  } else {
    alert('somehow, you could drag a card despite having no cards in your deck');
  }
};

DefaultState.prototype.updateTurnDisplay = function updateTurnDisplay() {

  this.teams.forEach(function (team) {

    team.cardBack.visible = team.stack.getCardCount() > 0 && this.currentTurn == team.number;
    team.healthIndicator.toggleState(team.cardBack.visible);

    for (var i = 0; i < 5; i++) {
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
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 13; j++) {
      deck.push({
        color: i,
        number: j,
        key: 'card' + i + '-' + (j > 7 ? 7 : j), //TODO: change this from -0 to -j
        orientation: 1,
        interrupt: j < 3 ? true : false,
        cardsToDeal: j < 3 ? j + 3 : 1,
      });
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
