
var PressableButton = function PressableButton(event, context, team, game, x, y, key, soundKey) {
  this.pressEvent = event;
  this.originalKey = key;
  this.down = false;
  this.team = team;
  this.eventContext = context;

  if (soundKey)
    this.sound = game.add.audio(soundKey);

  BaseSprite.call(this, game, x, y, key, 0);

  this.anchor.setTo(.5, .5);
  
  //  Input Enable the sprites
  this.inputEnabled = true;
  
  this.events.onInputDown.add(function (sprite, pointer) {
    this.loadTexture(this.originalKey + '-down')
    this.down = true;
  }, this);
  this.events.onInputUp.add(function (sprite, pointer) {
    this.loadTexture(this.originalKey)
    if (this.down && this.pressEvent) {

      if (this.sound)
        this.sound.play();

      this.pressEvent.call(this.eventContext, this.team);
    }
    this.down = false;
  }, this);
  this.events.onInputOut.add(function (sprite, pointer) {
    this.loadTexture(this.originalKey)
    this.down = false;
  }, this);
};

PressableButton.preload = function preload(game) {
  game.load.image('attack-0', 'assets/attack-0.png');
  game.load.image('attack-0-down', 'assets/attack-0-down.png');
  game.load.image('deal-0', 'assets/deal-0.png');
  game.load.image('deal-0-down', 'assets/deal-0-down.png');
  game.load.image('attack-1', 'assets/attack-1.png');
  game.load.image('attack-1-down', 'assets/attack-1-down.png');
  game.load.image('deal-1', 'assets/deal-1.png');
  game.load.image('deal-1-down', 'assets/deal-1-down.png');
  game.load.image('credits-btn', 'assets/credits-btn.png');
  game.load.image('credits-btn-down', 'assets/credits-btn-down.png');
  game.load.image('instructions-btn', 'assets/instructions-btn.png');
  game.load.image('instructions-btn-down', 'assets/instructions-btn-down.png');
  game.load.image('start-btn', 'assets/start-btn.png');
  game.load.image('start-btn-down', 'assets/start-btn-down.png');
};

PressableButton.prototype = Object.create(BaseSprite.prototype);

PressableButton.prototype.constructor = PressableButton;

PressableButton.prototype.update = function update() {
  BaseSprite.prototype.update.call(this);
};
