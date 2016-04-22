var GAME_W = 1080;
var GAME_H = 1920;
var GAME_MAIN_ID = 'main';

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
      game.load.image('healthindicator', 'assets/healthindicator.png');
      game.load.image('healthindicator-flat', 'assets/healthindicator-flat.png');
      game.load.image('card-play-empty', 'assets/card-play-empty.png');
      game.load.image('card-play-filled', 'assets/card-play-filled.png');

      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 13; j++) {
          if (j > 10)
            break; //debugging purposes, we only need to load the images we have made.

          game.load.image('card' + i + '-' + j, 'assets/card' + i + '-' + j + '.png');
          
        }        
      }

      // Other assets
      game.load.image('bkg', 'assets/gameboard.png');
      game.load.image('intro', 'assets/intro.png');
      game.load.image('valid-tap', 'assets/valid-tap.png');
      game.load.image('invalid-tap', 'assets/invalid-tap.png');
      //game.load.audio('drums', '/ogg/drums.ogg');      
    },

    create: function create() {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.antialias = true;

      game.input.addPointer();
      game.input.addPointer();

      game.state.add('intro', new IntroState());
      game.state.add('default', new DefaultState());
      //game.state.add('score', new ScoreState());

      game.state.start('intro');
    },
  });
}
