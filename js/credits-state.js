var CreditsState = function CreditsState() {
  Phaser.State.call(this);
};

CreditsState.prototype = Object.create(Phaser.State);

CreditsState.prototype.constructor = CreditsState;

CreditsState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);
  
  this.game.add.image(0, 0, 'credits');
  

};

CreditsState.prototype.update = function update() {
    if (this.game.input.activePointer.isDown) {    
      this.game.state.start('intro');
    }
};
