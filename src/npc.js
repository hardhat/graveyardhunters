// Non-Player character.
import Actor from './actor.js'
// Calculates AI and updates Actor class

export default class Npc extends Actor {
    constructor ({scene,sprite,x,y,health,enemyType}) {
        super({scene,sprite,x,y,health});
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.enemyType = enemyType;
        this.attackRange = 1;
        this.scene.npcText = [];
        this.npcPoint = new Phaser.Geom.Point();
        this.npcTilePoint = new Phaser.Geom.Point();
        this.addFancyText(375,300);

    }

    create(){
        this.scene.npcSprite.flipX = true;
        this.npcPoint.x = this.x;
        this.npcPoint.y = this.y;
        this.npcTilePoint.x = this.sprite.x;
        this.npcTilePoint.y = this.sprite.y;
        this.distantPlayerXPos = true;
        this.distantPlayerXNeg = true;
        this.distantPlayerYPos = true;
        this.distantPlayerYNeg = true;
        this.activityPoints = 3;
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

        const keys = [ 'walk', 'idle', 'attack', 'die' ];
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
        this.scene.manWin.play();
        //this.sprite.play('candydie');
      }
    }

    relativeToPlayer(){

        /*
        this.distantPlayerXPos; /n this.distantPlayerXPos; /n this.distantPlayerXPos; /n this.distantPlayerXPos;
        this.distantPlayerXPos = new boolean;
        this.distantPlayerXNeg = new boolean;
        this.distantPlayerYPos = new boolean;
        this.distantPlayerYNeg = new boolean;
         */
        if (this.scene.player.x > this.x) {
            this.distantPlayerXPos = true;
        } else if (this.scene.player.x < this.x) {
            this.distantPlayerXNeg = true;
        } else {
            this.distantPlayerXPos = false;
            this.distantPlayerXNeg = false;
        }
        if (this.scene.player.y > this.y) {
            this.distantPlayerYPos = true;
        } else if (this.scene.player.y < this.y) {
            this.distantPlayerYNeg = true;
        } else {
            this.distantPlayerYPos = false;
            this.distantPlayerYNeg = false;
        }
        if (this.distantPlayerXPos == false || this.distantPlayerXNeg == false || this.distantPlayerYPos == false || this.distantPlayerYNeg == false)
        {
            /*
            const dx = this.x - this.scene.player.x;
            const dy = this.y - this.scene.player.y;
            */
            this.dx = this.x - this.scene.player.x;
            this.dy = this.y - this.scene.player.y;
            if (this.dx*this.dx >= this.dy*this.dy) {
                this.horizDistanceGreater = true
                this.vertiDistanceGreater = false
            } else {
                this.vertiDistanceGreater = true
                this.horizDistanceGreater = false
            }
            if (this.dx * this.dx + this.dy * this.dy < this.attackRange * this.attackRange) {
                this.attackPossible = true;
                //return;
                /// Do action
            } else {
                console.log('npc toPlayer1');
                //return;
            }
        } else {
            console.log('npc toPlayer2');
            console.log(this.distantPlayerXPos + this.distantPlayerXPos + this.distantPlayerXPos + this.distantPlayerXPos);
            //return;
        }
        console.log('npc toPlayer3');
        return;
        /*
        if (this.distantPlayerXPos == false && this.distantPlayerXNeg = false) {
            if ((this.scene.player.y - this.y) =< this.attackRange) {
                this.attackPossible = true;
            }
        }
         */
    }

    screenToIso(moveCase) {
        console.log('npc moveCase');
        if (this.horizDistanceGreater == true) {
            if (this.dx>=0) {
                this.npcMove(-this.scene.tileWidthHalf, 0);
            } else {
                this.npcMove(this.scene.tileWidthHalf, 0);
            }
        } else {
            if (this.dy >= 0) {
                this.npcMove(0, -this.scene.tileHeightHalf);
            } else {
                this.npcMove(0, this.scene.tileHeightHalf);
            }
        }
        /*
        if (moveCase == "plusPlus") { //>>
            this.npcMove(this.scene.tileWidthHalf, this.scene.tileHeightHalf);
        } else if (moveCase == "minusPlus") { //<>
            this.npcMove(-this.scene.tileWidthHalf, this.scene.tileHeightHalf);
        } else if (moveCase == "minusMinus") { //<<
            this.npcMove(-this.scene.tileWidthHalf, -this.scene.tileHeightHalf);
        } else if (moveCase == "plusMinus") { //><
            this.npcMove(this.scene.tileWidthHalf, -this.scene.tileHeightHalf);
        } else {
            return;
        }
        */
    }

    npcMove(dx,dy)
    {
        console.log('npc move');
        this.sprite.play(this.enemyType+'walk');
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
                this.sprite.play(this.enemyType+'idle');
            }, callbackScope: this, loop: false });
        this.comboString = "";
    }

    update ()
    {
        // Update AI based movement of the NPC relative to the attacking player.
        if (this.activityPoints >= 1) {
            this.relativeToPlayer();
            if (this.attackPossible == true) {
                console.log(this.enemyType + index + 'can attack');
                //do attack based on enemy type
                //afterwards probably set attack possible to false, might require another variable
            } else {
                console.log(this.enemyType + this.index + 'is trying to move');
                if (this.enemyType == "thrall") {
                    this.screenToIso();
                    if (this.distantPlayerXPos == true && this.distantPlayerYPos == true) { //>>
                        //this.x = this.x + 1;
                        //this.x = this.y + 1;
                        this.screenToIso("plusPlus");
                        this.activityPoints = this.activityPoints - 1;
                    } else if (this.distantPlayerXNeg == true && this.distantPlayerYPos == true) {//<>
                        //this.x = this.x - 1;
                        //this.x = this.y + 1;
                        this.screenToIso("minusPlus");
                        this.activityPoints = this.activityPoints - 1;
                    } else if (this.distantPlayerXNeg == true && this.distantPlayerYNeg == true) {//<<
                        //this.x = this.x - 1;
                        //this.x = this.y - 1;
                        this.screenToIso("minusMinus");
                        this.activityPoints = this.activityPoints - 1;
                    } else if (this.distantPlayerXPos == true && this.distantPlayerYNeg == true) {//><
                        //this.x = this.x + 1;
                        //this.x = this.y - 1;
                        this.screenToIso("plusMinus");
                        this.activityPoints = this.activityPoints - 1;
                    }
                    /*
                    if (this.distantPlayerYPos == false && this.distantPlayerYNeg == false) {

                    } else if (this.distantPlayerXPos == false && this.distantPlayerXNeg == false) {

                    }
                     */
                } else if (this.enemyType == "rat") {

                } else if (this.enemyType == "bat") {
                    this.screenToIso();
                } else if (this.enemyType == "dracula") {

                }
            }
        }
        return
    }
}
