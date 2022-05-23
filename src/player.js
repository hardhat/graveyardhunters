// Player character.
import Actor from './actor.js'
// Listens for actions and movement

export default class Player extends Actor {
    constructor ({ scene, sprite, x, y, health }) {
        super({ scene, sprite, x, y, health });
        this.sprite = sprite;	// In iso coords
        this.scene = scene;
        this.x = x;	// in cartesian coords
        this.y = y;
        this.scene.playerText = [];
        this.addFancyText1(300,300);
        this.activityPoints=1;
        this.walkingPath=false;
        this.walkActive=false;
    }

    create()
    {
      this.comboCount = 0;
      this.comboString = "";
      this.damage = 0;
      this.nextSfx = 0;
      this.path = this.scene.getPath();

      this.scene.input.keyboard.on('keydown-W', k => this.playerMove(0,-1), this);
      this.scene.input.keyboard.on('keydown-S', k => this.playerMove(0,1), this);
      this.scene.input.keyboard.on('keydown-A', k => this.playerMove(-1,0), this);
      this.scene.input.keyboard.on('keydown-D', k => this.playerMove(1,0), this);

      this.enemy = this.scene.npc;
      this.scene.input.setPollAlways();

      this.scene.input.on('pointerdown', function(){
        const h = this.scene.tileHeight;
      	const startTilePt = this.scene.cartesianToTile(new Phaser.Geom.Point(this.x, this.y));
        
        const posX = this.scene.input.mousePointer.worldX;
        const posY = this.scene.input.mousePointer.worldY;
        const screenPt = new Phaser.Geom.Point(posX,posY);
        var tilePt = this.scene.cartesianToTile(this.scene.isometricToCartesian(screenPt)) 
        console.log("Clicked at "+posX + ", " + posY + " which is tile "+tilePt.x+","+tilePt.y);
        
        //this.scene.getTileXYType(tilePt);
        this.scene.findTilePath(startTilePt,tilePt);
        console.log(this.path);
        console.log(this.scene.destination);
        this.activityPoints=1;
        this.walkingPath=true;
      }, this);
      //console.log(this.scene.input.mousePointer.x);
      //console.log(this.scene.input.mousePointer.y);
      //this.scene.bout.worldToTileXY(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);


      this.createPaternHint();
    }
    aiWalk(){
      const tilePt = this.scene.cartesianToTile(new Phaser.Geom.Point(this.x, this.y));
      
      if(this.scene.path.length == 0){
        if(tilePt.x == this.scene.destination.x && tilePt.y == this.scene.destination.y){
          this.walkingPath = false;
          return;
        }
      }
      if(!this.walkingPath) return;
      if(this.activityPoints==0) return;	// waiting for current action.

      console.log("AI Walk with "+scene.path.length+" nodes to walk to still.");
      this.activityPoints=0;
      
      if(tilePt.x == this.scene.destination.x && tilePt.y == this.scene.destination.y){
        this.scene.destination = this.scene.path.pop();
	    console.log("AI Walk with "+scene.path.length+" nodes to walk to still.");
      }
      const dx = this.scene.destination.x - tilePt.x;
      const dy = this.scene.destination.y - tilePt.y;
      this.playerMove(dx,dy);
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
        var i=0;	// Should point to the correct enemy.
        this.enemy[i].health -= this.damage;
        console.log(this.scene.npc[i].health);
    }

//     playerMove(dx,dy)
//     {
//         console.log('move');
//         this.sprite.play('stewiewalk');
//         this.sprite.flipX = false;
//         this.scene.tweens.add({
//             targets: this.sprite,
//             x: this.sprite.x + dx,
// 			y: this.sprite.y + dy,
//             duration: 1000,
//             delay: 0,
//         });
//         this.x += dx;
//         this.y += dy;
//         this.scene.time.addEvent({ delay: 1000, callback: function() {
//             this.sprite.play('stewieidle');
//         }, callbackScope: this, loop: false });
//         this.comboString = "";
//     }

    playerMove(dx,dy)
    {
	const h = this.scene.tileHeight;
	if(this.walkActive) return;
	this.walkActive=true;

	// What step have we settled on
	let stepX = dx==0?0:dx<0?-1:1;
	let stepY = dy==0?0:dy<0?-1:1;
	// if dx is 0, then stepX <- 0 else if dx<0 then stepX <- -1 else stepX <- 1

	if(stepX!=0 && stepY!=0) {
		if(Math.random()>0.5) stepX=0; else stepY=0;
	}

	const anim = 'stewiewalk'+(stepX<0?'N':'');
	console.log('player move '+dx+','+dy+': '+anim + ' facing '+(dx>=0?'left':'right'));
	this.sprite.play(anim);
	this.sprite.flipX = !((stepY>0));
	const tilePt = this.scene.cartesianToTile(new Phaser.Geom.Point(this.x, this.y));
	const newPt = this.scene.tileToCartesian(new Phaser.Geom.Point(tilePt.x+stepX,tilePt.y+stepY));
	console.log("Player: Taking a step to "+stepX+","+stepY+" -> "+newPt.x+","+newPt.y);

	const targetIsoPt = this.scene.cartesianToIsometric(new Phaser.Geom.Point(newPt.x,newPt.y));
        this.scene.tweens.add({
            targets: this.sprite,
            x: targetIsoPt.x,
            y: targetIsoPt.y,
            duration: 1000,
            delay: 0,
        });
        this.x = newPt.x;
        this.y = newPt.y;
        this.scene.time.addEvent({ delay: 1000, callback: function() {
                this.sprite.play('stewieidle');
				console.log("Player earned a activity point.");
				this.activityPoints++;
				this.walkActive=false;
            }, callbackScope: this, loop: false });
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
