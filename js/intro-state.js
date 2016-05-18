var IntroState = function IntroState() {
  Phaser.State.call(this);
};

IntroState.prototype = Object.create(Phaser.State);

IntroState.prototype.constructor = IntroState;

IntroState.prototype.create = function create() {
  Phaser.State.prototype.create.call(this);

  this.game.add.image(0, 0, 'intro');
  var _game = this.game;
  this.game.add.existing(new PressableButton(function () { _game.state.start('credits'); }, this, 0, this.game, 225, 150, 'credits-btn', 'buttonPress'));
  this.game.add.existing(new PressableButton(function () { _game.state.start('tutorial'); }, this, 0, this.game, 225, 1715, 'instructions-btn', 'buttonPress'));
  this.game.add.existing(new PressableButton(function () { _game.state.start('default'); }, this, 0, this.game, 663, 971, 'start-btn', 'buttonPress'));

};

IntroState.prototype.update = function update() {

  
};
