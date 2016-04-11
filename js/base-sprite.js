var BaseSprite = function BaseSprite(game, x, y, key, frame) {
  Phaser.Sprite.call(this, game, x, y, key, frame);
  
  this.setupAnimations && this.setupAnimations();
};

BaseSprite.prototype = Object.create(Phaser.Sprite.prototype);

BaseSprite.prototype.constructor = BaseSprite;
