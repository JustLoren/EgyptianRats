var EndState = function EndState(victor) {
  Phaser.State.call(this);
  this.victor = victor;
};

EndState.prototype = Object.create(Phaser.State);

EndState.prototype.constructor = EndState;

EndState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);
  if (this.victor > -1)
    this.game.add.image(0, 0, 'winner' + this.victor);
  else
    this.game.add.image(0, 0, 'draw');

};

EndState.prototype.update = function update() {
    if (this.game.input.activePointer.isDown) {    
      this.game.state.start('intro');
    }
};
