// Game level goes here.
//import Phaser from 'phaser'
import Player from './player.js'
import Npc from './npc.js'
import Hud from './hud.js'

// Shows level background.  Stretch goal: scroll side to side

export default class Bout extends Phaser.Scene {
    constructor () {
        super('Bout');
    }

    preload ()
    {
        this.load.image('sky', 'assets/sprites/sky.png');

        this.load.image('syllable-do','assets/hud/syllable-do.png');
        this.load.image('syllable-wah','assets/hud/syllable-wah.png');
        this.load.image('syllable-uhuh','assets/hud/syllable-uhuh.png');
        this.load.image('syllable-katta','assets/hud/syllable-katta.png');

        this.stewie = this.load.spritesheet('stewie', 'assets/sprites/man.png', { frameWidth: 48, frameHeight: 48 });
        this.candy = this.load.spritesheet('candy', 'assets/sprites/woman.png', { frameWidth: 48, frameHeight: 48 });

        this.load.image('healthbar', 'assets/hud/healthbar.png');
        this.load.image('hudBg', 'assets/hud/hud-bg.png');

        this.load.audio('1', [ 'assets/syllables/DO_woman.wav', 'assets/syllables/DO_woman.mp3', 'assets/syllables/DO_woman.ogg' ]);
        this.load.audio('2', [ 'assets/syllables/WAH_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg' ]);
        this.load.audio('3', [ 'assets/syllables/UHUH_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg' ]);
        this.load.audio('4', [ 'assets/syllables/KATTA_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg' ]);

        this.load.audio('woman1', [ 'assets/sfx/FIGHT_woman1.wav' ]);
        this.load.audio('woman2', [ 'assets/sfx/FIGHT_woman2.wav' ]);
        this.load.audio('woman3', [ 'assets/sfx/FIGHT_woman3.wav' ]);
        this.load.audio('woman4', [ 'assets/sfx/FIGHT_woman4.wav' ]);
        this.load.audio('woman5', [ 'assets/sfx/FIGHT_woman5.wav' ]);
        this.load.audio('womanwin', [ 'assets/sfx/WIN_woman.wav' ] );
        this.load.audio('man1', [ 'assets/sfx/FIGHT_man1.wav' ]);
        this.load.audio('man2', [ 'assets/sfx/FIGHT_man2.wav' ]);
        this.load.audio('man3', [ 'assets/sfx/FIGHT_man3.wav' ]);
        this.load.audio('man4', [ 'assets/sfx/FIGHT_man4.wav' ]);
        this.load.audio('man5', [ 'assets/sfx/FIGHT_man5.wav' ]);
        this.load.audio('man6', [ 'assets/sfx/FIGHT_man6.wav' ]);
        this.load.audio('manwin', [ 'assets/sfx/WIN_man.wav' ] );
    }

    createAnim(texture)
    {
        var name = texture;
        // Animation set
        this.anims.create({
            key: name+'walk',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name+'idle',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 5, 6, 7, 8 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name+'kick',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 10, 11, 12, 13, 10 ] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 2000
        });

        this.anims.create({
            key: name+'punch',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 15, 16, 17, 18, 17, 15 ] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 2000
        });

        this.anims.create({
            key: name+'shield',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 15, 16, 17, 18, 18, 18, 18, 18, 17, 15 ] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 2000
        });

        this.anims.create({
            key: name+'jump',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 20, 21, 22, 23 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name+'jumpkick',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 20, 21, 22, 23, 25, 23, 22, 21 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: name+'win',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 30, 31 ] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 2000
        });

        this.anims.create({
            key: name+'die',
            frames: this.anims.generateFrameNumbers(name, { frames: [ 35, 36, 37 ] }),
            frameRate: 8,
        });

        const keys = [ 'walk', 'idle', 'kick', 'punch', 'jump', 'jumpkick', 'win', 'die' ];
    }

    create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0, 0);

        this.createAnim('stewie');
        this.playerSprite = this.add.sprite(200,400);
        this.playerSprite.setScale(4);
        this.playerSprite.play('stewieidle');
        this.playerSprite.flipX = true;

        var x=200;
        var y=400;
        var health=30;

        this.player = new Player({scene:this, sprite: this.playerSprite, x: x, y: y, health: health});
        x=600;
        this.npc = new Npc({scene: this, sprite: this.npcSprite, x:x, y:y, health: health});
        this.hud = new Hud({scene: this, player: this.player, npc: this.npc});
        
        if(this.npc.alive){
          this.createAnim('candy');
          this.npcSprite = this.add.sprite(600,400);
          this.npcSprite.setScale(4);
          this.npcSprite.play('candyidle');
        }

        this.createSounds();
        this.player.create();
        this.hud.create();
        this.npc.create();
    }

    createSounds() {
        this.syllable1 = this.sound.add('1');
        this.syllable2 = this.sound.add('2');
        this.syllable3 = this.sound.add('3');
        this.syllable4 = this.sound.add('4');
        console.log('Do Wa Uhuh Katta');

        this.input.keyboard.on('keydown-SPACE', function () {
            console.log("Quiet.");
            this.sound.stopAll();
        }, this);
        
        this.womanFight = [];
        this.womanFight.push(this.sound.add('woman1'));
        this.womanFight.push(this.sound.add('woman2'));
        this.womanFight.push(this.sound.add('woman3'));
        this.womanFight.push(this.sound.add('woman4'));
        this.womanFight.push(this.sound.add('woman5'));

        this.manFight = [];
        this.manFight.push(this.sound.add('man1'));
        this.manFight.push(this.sound.add('man2'));
        this.manFight.push(this.sound.add('man3'));
        this.manFight.push(this.sound.add('man4'));
        this.manFight.push(this.sound.add('man5'));
        this.manFight.push(this.sound.add('man6'));

        this.womanWin = this.sound.add('womanwin');
        this.manWin = this.sound.add('manwin');
    }

    showSyllable(syllable,pos) {
        const posArray = [{x: 150,y: 300},{x:200,y:350},{x:150,y:300},{x:200,y:350}];

        var popup = this.add.sprite(posArray[pos].x, posArray[pos].y, 'syllable-'+syllable);

        this.tweens.add({
            targets: popup,
            y: 75,
            alpha: 0.05,
            duration: 1200,
            delay: 400
        });
        this.time.addEvent({ delay: 2000, callback: function() {
            popup.destroy();
        }, callbackScope: this, loop: false });
    }

    update ()
    {
      this.player.update();
      // Use actor for the animated figures.  Each player or npc has an actor.  This updates the player + npc.
      this.hud.update();
    }

}
