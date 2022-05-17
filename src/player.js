// Player character.
import Actor from './actor.js'
// Listens for actions and movement

export default class Player extends Actor {
    constructor ({ scene, sprite, x, y, health }) {
        super({ scene, sprite, x, y, health });
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.playerText = [];
        this.addFancyText1(300,300);
    }

    create()
    {
      this.comboCount = 0;
      this.comboString = "";
      this.damage = 0;
      this.nextSfx = 0;
      this.path = this.scene.getPath();

      this.scene.input.keyboard.on('keydown-W', k => this.patternMove(-this.scene.tileWidthHalf,-this.scene.tileHeightHalf), this);
      this.scene.input.keyboard.on('keydown-S', k => this.patternMove(this.scene.tileWidthHalf,this.scene.tileHeightHalf), this);
      this.scene.input.keyboard.on('keydown-A', k => this.patternMove(-this.scene.tileWidthHalf,this.scene.tileHeightHalf), this);
      this.scene.input.keyboard.on('keydown-D', k => this.patternMove(this.scene.tileWidthHalf,-this.scene.tileHeightHalf), this);

      this.enemy = this.scene.npc;
      this.scene.input.setPollAlways();
      var screenPoint;
      var playerPt = new Phaser.Geom.Point(this.x,this.y);
      var playerTilePt = new Phaser.Geom.Point(15,9);
      this.playerPt = playerPt;
      this.playerTilePt = playerTilePt;
      this.scene.input.on('pointerdown', function(){
        var screenPt = new Phaser.Geom.Point();
        var posX = this.scene.input.mousePointer.worldX;
        var posY = this.scene.input.mousePointer.worldY;
        screenPt.x = posX;
        screenPt.y = posY;
        console.log(posX + ", " + posY);
       //this.scene.worldToTileXY({x: posX, y: posY});*/
        console.log(this.scene.getTileCoordinatesFromCart(this.scene.isometricToCartesian(screenPt, 32)));
        this.scene.getTileXYType(this.scene.getTileCoordinatesFromCart(this.scene.isometricToCartesian(screenPt, 32)));
        this.scene.findPath(this.scene.getTileCoordinatesFromCart(this.scene.isometricToCartesian(playerPt, 32)));
        console.log(this.path);
        console.log(this.scene.destination);
      }, this);
      //console.log(this.scene.input.mousePointer.x);
      //console.log(this.scene.input.mousePointer.y);
      //this.scene.bout.worldToTileXY(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);


      this.createPaternHint();
    }
    aiWalk(){
      var stepsTillTurn = 19;
      var stepsTaken = 0;
      var dX;
      var dY;
      //console.log(this.scene.destination.x);
      //console.log(this.scene.path.length);
      if(this.scene.path.length == 0){
        if(this.playerTilePt.x == this.scene.destination.x && this.playerTilePt.y == this.scene.destination.y){
          dX = 0;
          dY = 0;
          this.scene.isWalking = false;
          //console.log(this.scene.isWalking);
          return;
        }
      }
      this.scene.isWalking = true;
      if(this.playerTilePt.x == this.scene.destination.x && this.playerTilePt.y == this.scene.destination.y){
        stepsTaken++;
        if(stepTaken < stepsTillTurn){
          return;
        }

        stepsTaken = 0;
        this.scene.destination = this.scene.path.pop();
        if(this.playerTilePt.x < this.scene.destination.x){
          dX = 1;
          console.log(dX);
        } else if (this.playerTilePt.x > this.scene.destination.x){
          dX = -1;
          console.log(dX);
        } else {
          dX = 0;
          console.log(dX);
        }
        if(this.playerTilePt.y < this.scene.destination.y){
          dY = 1;
          console.log(dY);
        } else if(this.playerTilePt.y > this.scene.destination.y){
          dY = -1;
          console.log(dY);
        } else {
          dY = 0;
          console.log(dY);
        }
        if(this.playerTilePt.x == this.scene.destination.x){
          dX = 0;
          console.log(dX);
        } else if (this.playerTilePt.y == this.scene.destination.y){
          dY = 0;
          console.log(dY);
        }
      }
    }

    createAnim(texture)
    {
        var name = texture;
        // Animation set
        this.scene.anims.create({
            key: name+'walk',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 1, 2, 3, 4, 5, 6, 7, 8 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'idle',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 0,0,0,0,0,0,0,0,4 ] }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'attack',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 0, 9, 9, 0 ] }),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 2000
        });


        this.scene.anims.create({
            key: name+'die',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 0 ] }),
            frameRate: 8,
        });

        const keys = [ 'walk', 'idle', 'attack', 'die' ];
    }

    dealDamage(amount)
    {
        console.log('hit');
        this.damage = amount;
        this.enemy.health -= this.damage;
        console.log(this.scene.npc.health);
    }

    patternMove(dx,dy)
    {
        console.log('move');
        this.sprite.play('stewiewalk');
        this.sprite.flipX = false;
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + dx,
			y: this.sprite.y + dy,
            duration: 1000,
            delay: 0,
        });
        this.x += dx;
		this.y += dy;
        this.scene.time.addEvent({ delay: 1000, callback: function() {
            this.sprite.play('stewieidle');
        }, callbackScope: this, loop: false });
        this.comboString = "";
    }

    patternStab()
    {
        console.log('stab');
        this.sprite.play('stewiestab');
        this.sprite.flipX = false;
        this.scene.manFight[(this.nextSfx++)%5].play();
        this.comboString = "";
        this.scene.time.addEvent({ delay: 1000, callback: function() {
            this.sprite.play('stewieidle');
        }, callbackScope: this, loop: false });
    }

    update ()
    {
		this.updatePatternHint();
    this.aiWalk();
    }

    createPaternHint()
    {
        this.scene.hintText = [];
        for(var i=0; i<6; i++) {
            this.addFancyText(550,100+i*24);
        }
    }

    addFancyText(x,y) {
        var text = this.scene.add.text(x,y,'',{font: "20px Arial Black", fill: "#fff"});
		text.depth = 10000;
        text.setStroke('#00f', 5);
        text.setShadow(2,2,'#333333',2,true,true);
        this.scene.hintText.push(text);
    }

    addFancyText1(x,y) {
        var text = this.scene.add.text(x,y,'',{font: "20px Arial Black", fill: "#fff"});
		text.depth = 10000;
        text.setStroke('#00f', 5);
        text.setShadow(2,2,'#333333',2,true,true);
        this.scene.playerText.push(text);
    }

    updatePatternHint()
    {
        this.scene.hintText[0].text = 'Choose Action';

		var i=1;
		this.scene.hintText[i++].text='[1] attack with knives';
		this.scene.hintText[i++].text='[2] uncurse with holy water';
		this.scene.hintText[i++].text='[3] gain 3HP with holy water';
		this.scene.hintText[i++].text='[4] AoE freeze undead with holy water';
		this.scene.hintText[i++].text='[5] stake undead with 2HP or less';

        while(i<6) {
            this.scene.hintText[i++].text='';
        }
    }
}
