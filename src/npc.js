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
        this.addFancyText(375,300);

    }

    create(){
        this.scene.npcSprite.flipX = true;
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
        if (this.distantPlayerXPos == false || this.distantPlayerXPos == false || this.distantPlayerXPos == false || this.distantPlayerXPos == false)
        {
            const dx = this.x - this.scene.player.x;
            const dy = this.y - this.scene.player.y;
            if (dx * dx + dy * dy < this.attackRange * this.attackRange) {
                this.attackPossible = true;
                /// Do action
            }
        }
        /*
        if (this.distantPlayerXPos == false && this.distantPlayerXNeg = false) {
            if ((this.scene.player.y - this.y) =< this.attackRange) {
                this.attackPossible = true;
            }
        }
         */
    }

    update ()
    {
        // Update AI based movement of the NPC relative to the attacking player.
        if (this.activityPoints >= 1) {

            if (this.enemyType == "thrall") {
                if (this.scene.player.x >= this.x && this.scene.player.y >= this.y) {
                    this.x = this.x+1;
                    this.y = this.y+1;
                    this.activityPoints = this.activityPoints-1;
                } else if (this.scene.player.x < this.x && this.scene.player.y > this.y) {
                    this.x = this.x - 1;
                    this.y = this.y + 1;
                    this.activityPoints = this.activityPoints - 1;
                } else if (this.scene.player.x < this.x && this.scene.player.y > this.y) {
                    this.x = this.x - 1;
                    this.y = this.y + 1;
                    this.activityPoints = this.activityPoints - 1;
                } else if (this.scene.player.x < this.x && this.scene.player.y > this.y) {
                    this.x = this.x - 1;
                    this.y = this.y + 1;
                    this.activityPoints = this.activityPoints - 1;
                } else if (this.scene.player.x < this.x && this.scene.player.y > this.y) {
                    this.x = this.x - 1;
                    this.y = this.y + 1;
                    this.activityPoints = this.activityPoints - 1;
                } else if (this.scene.player.x < this.x && this.scene.player.y > this.y) {
                    this.x = this.x - 1;
                    this.y = this.y + 1;
                    this.activityPoints = this.activityPoints - 1;
                }
                /*
                if (this.distantPlayerYPos == false && this.distantPlayerYNeg == false) {

                } else if (this.distantPlayerXPos == false && this.distantPlayerXNeg == false) {

                }
                 */
            } else if (this.enemyType == "rat") {

            } else if (this.enemyType == "bat") {

            } else if (this.enemyType == "dracula") {

            }
        }
        return
    }
}
