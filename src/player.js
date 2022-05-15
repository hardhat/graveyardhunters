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

      this.scene.input.keyboard.on('keydown-W', k => this.patternMove(-this.scene.tileWidthHalf,-this.scene.tileHeightHalf), this);
      this.scene.input.keyboard.on('keydown-S', k => this.patternMove(this.scene.tileWidthHalf,this.scene.tileHeightHalf), this);
      this.scene.input.keyboard.on('keydown-A', k => this.patternMove(-this.scene.tileWidthHalf,this.scene.tileHeightHalf), this);
      this.scene.input.keyboard.on('keydown-D', k => this.patternMove(this.scene.tileWidthHalf,-this.scene.tileHeightHalf), this);

      this.enemy = this.scene.npc;
      this.scene.input.setPollAlways();
      var screenPoint;
      this.scene.input.on('pointerdown', function(){
        var posX = this.scene.input.mousePointer.worldX;
        var posY = this.scene.input.mousePointer.worldY;
        //screenPoint.x = posX;
        //screenPoint.y = posY;
        console.log(posX + ", " + posY);
        //this.scene.worldToTileXY({x: posX, y: posY});*/
        console.log(this.scene.getTileCoordinate(this.scene.isometericToCartesian(this.scene.screenPoint(posX, posY), 64)));
      }, this);
      //console.log(this.scene.input.mousePointer.x);
      //console.log(this.scene.input.mousePointer.y);
      //this.scene.bout.worldToTileXY(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);


      this.createPaternHint();
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
		this.updatePatternHint()
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
