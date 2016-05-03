
// ES6: class HealthIndicator extends BaseSprite { ... }
var HealthIndicator = function HealthIndicator(team, game, x, y) {  

  BaseSprite.call(this, game, x, y, 'healthindicator' + team, 0);

  this.anchor.setTo(.5, .5);
  this.team = team;
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
  game.load.image('healthindicator0', 'assets/crest_0.png');
  game.load.image('healthindicator0-active', 'assets/crest_0_glowing.png');
  game.load.image('healthindicator1', 'assets/crest_1.png');
  game.load.image('healthindicator1-active', 'assets/crest_1_glowing.png');
};

HealthIndicator.prototype = Object.create(BaseSprite.prototype);

HealthIndicator.prototype.constructor = HealthIndicator;

HealthIndicator.prototype.update = function update() {
  BaseSprite.prototype.update.call(this);
};

HealthIndicator.prototype.toggleState = function toggleState(state) {
  if (state)
    this.loadTexture('healthindicator' + this.team + '-active');
  else
    this.loadTexture('healthindicator' + this.team);
};