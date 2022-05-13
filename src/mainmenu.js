// Main menu goes here.

// Options from main menu: play, about (shows credits) as buttons.

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');

        this.gamemode = false;
    }

	preload () {
        this.load.image('menu','assets/menu/menu.png');
        this.load.image('about', 'assets/menu/Button_About.png');
        this.load.image('rules', 'assets/menu/Button_Rules.png');
        this.load.image('new', 'assets/menu/Button_New.png');
        this.load.image('history', 'assets/menu/Button_History.png');
        this.load.image('dog', 'assets/menu/dog.png');
        this.load.image('polegoat', 'assets/menu/goatonapole.jpg');
        this.load.image('back', 'assets/menu/Button_Back.png');
        this.load.image('jamWindow', 'assets/menu/jamWindow.png');
        this.load.image('goat', 'assets/menu/Button_GOAT.png');
        this.load.image('tojam', 'assets/menu/Button_ToJam.png');
        this.load.image('credits', 'assets/menu/credits.png');
        this.load.image('rulesWindow', 'assets/menu/rulesScreen.png');

        this.load.audio('1', [ 'assets/syllables/DO_woman.wav', 'assets/syllables/DO_woman.mp3', 'assets/syllables/DO_woman.ogg' ]);
        this.load.audio('2', [ 'assets/syllables/WAH_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg' ]);
        this.load.audio('3', [ 'assets/syllables/UHUH_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg' ]);
        this.load.audio('4', [ 'assets/syllables/KATTA_woman.wav', 'assets/syllables/WAH_woman.mp3', 'assets/syllables/WAH_woman.ogg' ]);
    }

    create ()  {
        this.normalButtonList = [];
        /* create list of buttons */
        this.add.image(0, 0, 'menu').setOrigin(0, 0); /* sets upper left corner of image to UL of game */
        var newGameButton = this.add.image(400,300,'new');
        newGameButton.setInteractive(); /* makes button clickable */
        newGameButton.on('clicked', function(item) {
            this.scene.start('Bout'); /* actually starts battle */
        },this);
        this.normalButtonList.push(newGameButton); /* puts button in list of buttons */
        
        var aboutButton = this.add.image(100,475,'about'); /* adds button to lower left */
        aboutButton.setInteractive();
        aboutButton.on('clicked', function(item) {
            this.hideNormalButtons();

            var aboutWindow = this.add.image(400,300,'credits'); /* shows the fox. Anchor is center of image. in center of screen. */
            aboutWindow.setInteractive();
            aboutWindow.on('clicked',this.deleteItem,this);
        },this); /* end of .on('clicked') */
        this.normalButtonList.push(aboutButton);

        var jamButton = this.add.image(700,475,'tojam'); // adds button to lower right. 
        jamButton.setInteractive();
        jamButton.on('clicked', function(item) {
            this.hideNormalButtons();

            var jamWindow = this.add.image(400,300,'jamWindow'); // shows the wolverine.
            jamWindow.setInteractive();
            jamWindow.on('clicked',this.deleteItem,this);
        },this); /* end of .on('clicked') */
        this.normalButtonList.push(jamButton);

        var rulesButton = this.add.image(700,125,'rules'); /* adds button to upper right */
        rulesButton.setInteractive();
        rulesButton.on('clicked', function(item) {
            this.hideNormalButtons();

            var rulesWindow = this.add.image(400,300,'rulesWindow'); // shows the wolverine.
            rulesWindow.setInteractive();
            rulesWindow.on('clicked',this.deleteItem,this);
        },this); /* end of .on('clicked') */
        this.normalButtonList.push(rulesButton);

        var goatButton = this.add.image(100,125,'goat'); /* adds button to upper right */
        goatButton.setInteractive();
        goatButton.on('clicked', function(item) {
            this.hideNormalButtons();

            var goatWindow = this.add.image(400,300,'polegoat'); // shows the wolverine.
            goatWindow.setInteractive();
            goatWindow.on('clicked',this.deleteItem,this);
        },this); /* end of .on('clicked') */
        this.normalButtonList.push(goatButton);

        //  If a Game Object is clicked on, this event is fired.
        //  We can use it to emit the 'clicked' event on the game object itself.
        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this); 

        this.createSounds();
    }

    hideNormalButtons() { /* hides and deactivates normal buttons */
        this.normalButtonList.forEach(button => {
            this.syllable3.play();
            button.setVisible(false);
            button.input.enabled = false;
        });
    }

    showNormalButtons() { /* resets normal buttons */
        this.normalButtonList.forEach(button => {
            button.setVisible(true);
            button.input.enabled = true;
        });
    }

    deleteItem(item) { /* deletes passed in object and resets to normal */
        item.off('clicked',this.deleteItem);
        item.input.enabled = false;
        item.setVisible(false);
        this.syllable4.play();
        this.showNormalButtons();
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
    
        this.input.keyboard.on('keydown-A', function () {
            console.log("Do");
            this.syllable1.play();
        }, this);
    
        this.input.keyboard.on('keydown-W', function () {
            console.log("Wa");
            this.syllable2.play();
        }, this);
    
        this.input.keyboard.on('keydown-S', function () {
            console.log("Uhuh");
            this.syllable3.play();
        }, this);
    
        this.input.keyboard.on('keydown-D', function () {
            console.log("Katta");
            this.syllable4.play();
        }, this);

        this.time.addEvent({ delay: 1000, callback: function() {
            this.syllable1.play();
        }, callbackScope: this, loop: false });
        this.time.addEvent({ delay: 2000, callback: function() {
            this.syllable2.play();
        }, callbackScope: this, loop: false });
    }

    update () {
        return;
    }

}
