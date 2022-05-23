// Non-Player character.
import Actor from './actor.js'
// Calculates AI and updates Actor class

export default class Npc extends Actor {
    constructor ({scene,sprite,x,y,health,enemyType}) {
        super({scene,sprite,x,y,health});
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;	// In cartesian
        this.y = y;
        this.alive = true;
        this.enemyType = enemyType;
        this.attackRange = 2;
        this.scene.npcText = [];
        this.addFancyText(375,300);
    }

    create(){
        this.sprite.flipX = true;
        //this.npcPoint.x = this.x;	// In cartesian
        //this.npcPoint.y = this.y;
        //this.npcTilePoint.x = this.sprite.x;	// In iso coords
        //this.npcTilePoint.y = this.sprite.y;
        this.dx = 0;
	this.dy = 0;
	this.direction = -1;
    }
	
    createAnimBat(texture)
    {
        var name = texture;
        // Animation set
        this.scene.anims.create({
            key: name+'walk',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 0, 1,2,3,4,5 ] }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'idle',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [  0,1,2,3,4,5 ] }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'walkN',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 6,7,8,9,10,11 ] }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'attack',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 12,13,14,15,16,17 ] }),
            frameRate: 12,
            repeat: 0,
            repeatDelay: 2000
        });


        this.scene.anims.create({
            key: name+'die',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 21,21,21,21 ] }),
            frameRate: 8,
        });

        const keys = [ 'walk', 'walkN', 'idle', 'attack', 'die' ];
    }

    createAnimThrall(texture)
    {
        var name = texture;
        // Animation set
        this.scene.anims.create({
            key: name+'walk',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 0,1,2,3,4,5,6,7 ] }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'idle',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [  0,0,0,0,1,1,1,1 ] }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'walkN',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 8,9,10,11,12,13,14,15 ] }),
            frameRate: 12,
            repeat: -1
        });

        this.scene.anims.create({
            key: name+'attack',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 8,0,8,0 ] }),
            frameRate: 12,
            repeat: 0,
            repeatDelay: 2000
        });


        this.scene.anims.create({
            key: name+'die',
            frames: this.scene.anims.generateFrameNumbers(name, { frames: [ 0 ] }),
            frameRate: 8,
        });

        const keys = [ 'walk', 'idle', 'attack', 'die' ];
    }
	
	createAnims()
	{
		this.createAnimBat('bat');
		this.createAnimThrall('thrall');
		this.createAnimBat('rat');
		this.createAnimBat('dracula');
	}

    addFancyText(x,y) {
        var text = this.scene.add.text(x,y,'',{font: "20px Arial Black", fill: "#fff"});
        text.setStroke('#00f', 5);
        text.setShadow(2,2,'#333333',2,true,true);
        this.scene.npcText.push(text);
    }

    isAlive(){
      if(this.health <= 0){
        this.alive = false;
        console.log(this.health);
        console.log(this.alive);
        this.scene.npcText[0].text = 'You Win';
        //this.scene.manWin.play();
        //this.sprite.play('candydie');
      }
    }

    relativeToPlayer()
    {
		const playerTilePt = this.scene.cartesianToTile(new Phaser.Geom.Point(
		  this.scene.player.x,this.scene.player.y));
		const tilePt = this.scene.cartesianToTile(new Phaser.Geom.Point(this.x,this.y));
        this.dx = playerTilePt.x - tilePt.x;	// Vector towards player
        this.dy = playerTilePt.y - tilePt.y;

        const delta = this.dx * this.dx + this.dy * this.dy;
        this.attackPossible = delta < this.attackRange * this.attackRange;
        return this.attackPossible;
    }

    npcMove(dx,dy)
    {
	// What step have we settled on
	let stepX = dx==0?0:dx<0?-1:1;
	let stepY = dy==0?0:dy<0?-1:1;
	if(stepX!=0 && stepY!=0) {
		if(Math.random()>0.5) stepX=0; else stepY=0;
	}

	const anim = this.enemyType+'walk'+(stepX<0?'N':'');
	console.log('npc move '+dx+','+dy+': '+anim + ' facing '+(dx>=0?'left':'right'));
	this.sprite.play(anim);
	this.sprite.flipX = !((stepY>0));
	const tilePt = this.scene.cartesianToTile(new Phaser.Geom.Point(this.x,this.y));

	console.log(this.enemyType + ": Taking a step to "+stepX+","+stepY+" -> "+(tilePt.x+stepX)+","+(tilePt.y+stepY));
	const newTilePt = new Phaser.Geom.Point(tilePt.x+stepX,tilePt.y+stepY);
	const newCartPt = this.scene.tileToCartesian(newTilePt);
	const targetPt = this.scene.cartesianToIsometric(newCartPt);
        this.scene.tweens.add({
            targets: this.sprite,
            x: targetPt.x,
            y: targetPt.y,
            duration: 1000,
            delay: 0,
        });
        this.x = newCartPt.x;
        this.y = newCartPt.y;
        this.scene.time.addEvent({ delay: 1000, callback: function() {
                this.sprite.play(this.enemyType+'idle');
				console.log(this.enemyType + " earned a activity point.");
				this.activityPoints++;
            }, callbackScope: this, loop: false });
    }

    update ()
    {
        // Update AI based movement of the NPC relative to the attacking player.
        if (this.activityPoints >= 1) {
            this.activityPoints = 0;
            this.relativeToPlayer();
            if (this.attackPossible == true) {
                console.log(this.enemyType + ' can attack');
                //do attack based on enemy type
                //afterwards probably set attack possible to false, might require another variable
            } else {
                console.log(this.enemyType + ' is trying to move to '+this.dx+','+this.dy);
                if (this.enemyType == "thrall") {
                    this.npcMove(this.dx,this.dy);
                } else if (this.enemyType == "rat") {

                } else if (this.enemyType == "bat") {
                    this.npcMove(this.dx,this.dy);
                } else if (this.enemyType == "dracula") {

                }
            }
        }
    }
}
