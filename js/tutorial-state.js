var TutorialState = function TutorialState() {
  Phaser.State.call(this);
    
};

TutorialState.prototype = Object.create(Phaser.State);

TutorialState.prototype.constructor = TutorialState;

TutorialState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);

  this.step = 1;

  this.image = this.game.add.image(0, 0, 'instructions');

  this.image.inputEnabled = true;
  this.image.events.onInputDown.add(function () {
    if (++this.step > 2)
      this.game.state.start('intro');
    else
      this.image.loadTexture('instructions2');
  }, this);

};

TutorialState.prototype.update = function update() {    
    
};
