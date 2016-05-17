var IntroState = function IntroState() {
  Phaser.State.call(this);
};

IntroState.prototype = Object.create(Phaser.State);

IntroState.prototype.constructor = IntroState;

IntroState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);

  this.game.add.image(0, 0, 'intro');

};

IntroState.prototype.update = function update() {
    if (this.game.input.activePointer.isDown) {
      if (this.game.input.activePointer.x > 72 && this.game.input.activePointer.x < 315 &&
          this.game.input.activePointer.y > 1703 && this.game.input.activePointer.y < 1850) {
        //72, 1703
        // 315, 1850
        this.game.state.start('tutorial');
      } else if (this.game.input.activePointer.x > 296 && this.game.input.activePointer.x < 1028 &&
          this.game.input.activePointer.y > 867 && this.game.input.activePointer.y < 1014) {
        this.game.state.start('default');
      }
  }
};
