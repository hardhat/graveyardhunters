// Non-Player character.
import Actor from './actor.js'
// Calculates AI and updates Actor class

export default class Npc extends Actor {
    constructor ({scene,sprite,x,y,health}) {
        super({scene,sprite,x,y,health});
        this.sprite = sprite;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.alive = true;
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

    update ()
    {
        // Update AI based movement of the NPC relative to the attacking player.
    }
}
