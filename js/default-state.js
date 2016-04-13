// jscs:disable

var DefaultState = function DefaultState() {
  Phaser.State.call(this);
};

DefaultState.prototype = Object.create(Phaser.State.prototype);

DefaultState.prototype.constructor = DefaultState;

DefaultState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);

  this.bkg = this.game.add.image(0, 0, 'bkg');

  this.playArea = new CardStack(-1, this.game, GAME_W / 2, GAME_H / 2);
  this.game.add.existing(this.playArea);
  
  this.teams = [];
  
  this.teams.push({
    stack: new CardStack(0, this.game, 60, 120),
    cardBack: new CardBack(0, this.game, this, 60, 120),
    healthIndicator: new HealthIndicator(0, this.game, 525, 109, 'healthindicator'),
  });

  this.teams.push({
    stack: new CardStack(1, this.game, 1000, 1800),
    cardBack: new CardBack(1, this.game, this, 1000, 1800),
    healthIndicator: new HealthIndicator(1, this.game, 525, 1803, 'healthindicator'),
  });

  for (var idx in this.teams) {
    if (this.teams[idx].stack) {
      
      this.game.add.existing(this.teams[idx].stack);

      this.teams[idx].healthIndicator.anchor.setTo(.5, .5);

      this.teams[idx].healthIndicator.updatePosition(.5);

      this.game.add.existing(this.teams[idx].healthIndicator);

      this.game.add.existing(this.teams[idx].cardBack);
      
    }
  }
    
  var deck = this.createDeck();
  this.teams[0].stack.addCards(deck.splice(0, deck.length / 2));
  this.teams[1].stack.addCards(deck);

  //red play area: x: 2, y: 207, width: 1080, height 726

  //blue play area: x: 2, y: 986, width: 1076, height: 726

  this.game.input.onDown.add(function (pointer) {
    var canGrab = this.playArea.canGrab();
    if (pointer.y > 207 && pointer.y < 933) {
      if (canGrab) {
        this.teams[0].stack.addCards(this.playArea.clearStack());        
      } else {
        this.playArea.pushCards(this.teams[0].stack.discardCards(2));
      }
      this.updateHealthIndicator(0);
    } else if (pointer.y > 986 && pointer.y < 1712) {
      if (canGrab) {
        this.teams[1].stack.addCards(this.playArea.clearStack());        
      } else {
        this.playArea.pushCards(this.teams[1].stack.discardCards(2));
      }
      this.updateHealthIndicator(1);
    }
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
  this.playArea.addCards(this.teams[team].stack.removeCard());
  this.updateHealthIndicator(team);
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
        key: 'card' + i + '-' + (j > 3 ? 3 : j), //TODO: change this from -0 to -j
        orientation: 1,
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
