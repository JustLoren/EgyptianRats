
// ES6: class HealthIndicator extends BaseSprite { ... }
var HealthIndicator = function HealthIndicator(team, game, x, y) {  

  BaseSprite.call(this, game, x, y, 'healthindicator', 0);

  this.anchor.setTo(.5, .5);

  if (team == 0) {
    this.scale.setTo(-1, -1);
    this.updatePosition = function(percentage) {
      this.x = 899 - ((899 - 206) * percentage);      
    }
  } else if (team == 1) {
    this.updatePosition = function (percentage) {
      this.x = 179 + ((869 - 177) * percentage);
    }
  } else {
    alert('Invalid team: ' + team);
  }
  
};

HealthIndicator.preload = function preload(game) {
  
};

HealthIndicator.prototype = Object.create(BaseSprite.prototype);

HealthIndicator.prototype.constructor = HealthIndicator;

HealthIndicator.prototype.update = function update() {
  BaseSprite.prototype.update.call(this);
};

HealthIndicator.prototype.toggleState = function toggleState(state) {
  if (state)
    this.loadTexture('healthindicator');
  else
    this.loadTexture('healthindicator-flat');
};