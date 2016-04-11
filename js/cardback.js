
// ES6: class CardBack extends BaseSprite { ... }
var CardBack = function CardBack(team, game, state, x, y) {
  this.team = team;
  this.state = state;

  BaseSprite.call(this, game, x, y, 'cardback', 0);

  this.anchor.setTo(.5, .5);
  
  //  Input Enable the sprites
  this.inputEnabled = true;

  //  Allow dragging - the 'true' parameter will make the sprite snap to the center
  this.input.enableDrag();

  this.events.onDragStart.add(function (sprite, pointer) {
    var bounds = this.getBounds();
    this.stackBounds = new Phaser.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
    this.origin = { x: this.x, y: this.y };
  }, this);

  this.events.onDragStop.add(function (sprite, pointer) {
    var boundsA = sprite.getBounds();
    var boundsB = sprite.stackBounds;

    if (!Phaser.Rectangle.intersects(boundsA, boundsB)) {
      this.state.cardDrop(this.team);
    }

    this.x = this.origin.x;
    this.y = this.origin.y;
  }, this);
};

CardBack.preload = function preload(game) {
  
};

CardBack.prototype = Object.create(BaseSprite.prototype);

CardBack.prototype.constructor = CardBack;

CardBack.prototype.update = function update() {
  BaseSprite.prototype.update.call(this);
};
