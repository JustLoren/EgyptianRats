var GAME_W = 1080;
var GAME_H = 1920;
var GAME_MAIN_ID = 'main';
var CARDS_IN_DECK = 60;

/**
 * Global containing the Phaser.Game object
 */
var game;

/**
 * Entry point
 */
function main() {
  game = new Phaser.Game(GAME_W, GAME_H, Phaser.AUTO, GAME_MAIN_ID, {
    preload: function preload() {

      // Object-specific assets
      //CardBack.preload(game);
      game.load.image('cardback', 'assets/cardback.png');
      game.load.image('clear', 'assets/clear.png');
      game.load.image('deckempty', 'assets/deckempty.png');
      
      HealthIndicator.preload(this);
      PressableButton.preload(this);

      game.load.image('card-play-empty', 'assets/card-play-empty.png');
      game.load.image('card-play-filled', 'assets/card-play-filled.png');

      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 13; j++) {
          game.load.image('card' + i + '-' + j, 'assets/card' + i + '-' + j + '.png');          
        }        
      }

      // Other assets
      //game.load.image('bkg', 'assets/gameboard.png');
      game.load.image('intro', 'assets/intro.png');
      game.load.image('credits', 'assets/credits.png');
      game.load.image('instructions', 'assets/instructions.jpg');
      game.load.image('instructions2', 'assets/instructions_page 2.jpg');
      game.load.image('valid-tap', 'assets/valid-tap.png');
      game.load.image('invalid-tap', 'assets/invalid-tap.png');

      game.load.image('winner0', 'assets/winner0.png');
      game.load.image('winner1', 'assets/winner1.png');
      game.load.image('draw', 'assets/draw.png');
      game.load.audio('attack', ['assets/sounds/attack.ogg', 'assets/sounds/attack.m4a']);
      game.load.audio('attack-failed', ['assets/sounds/attack-failed.ogg']);
      game.load.audio('playCard', ['assets/sounds/playCard.ogg']);
      game.load.audio('buttonPress', ['assets/sounds/buttonPress.ogg']);
    },

    create: function create() {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.antialias = true;

      game.input.addPointer();
      game.input.addPointer();

      game.state.add('intro', new IntroState());
      game.state.add('tutorial', new TutorialState());
      game.state.add('credits', new CreditsState());
      game.state.add('default', new DefaultState());
      game.state.add('draw', new EndState(-1));
      game.state.add('winner0', new EndState(0));
      game.state.add('winner1', new EndState(1));

      game.state.start('intro');
    },
  });
}
