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
        this.load.json('graveyard', 'assets/map/graveyard.json');
        this.load.tilemapTiledJSON('graveyardTileMap', 'assets/map/graveyard.json');
        this.load.spritesheet('tiles', 'assets/map/iso-64x64-outside.png', {frameWidth: 64, frameHeight: 64});

        this.stewie = this.load.spritesheet('stewie', 'assets/character/people-preview.png', { frameWidth: 64, frameHeight: 96 });

		this.bat = this.load.spritesheet('bat', 'assets/character/bat.png', { frameWidth: 64, frameHeight: 96 });
		this.thrall = this.load.spritesheet('thrall', 'assets/character/thrall-walk.png', { frameWidth: 64, frameHeight: 96 });
		this.rat = this.load.spritesheet('rat', 'assets/character/bat.png', { frameWidth: 64, frameHeight: 96 });
		this.dracula = this.load.spritesheet('dracula', 'assets/character/bat.png', { frameWidth: 64, frameHeight: 96 });

	/*
        this.load.image('healthbar', 'assets/hud/healthbar.png');
        this.load.image('hudBg', 'assets/hud/hud-bg.png');
	*/

        this.load.audio('uhh', [ 'assets/sfx/uhh.wav','assets/sfx/uhh.mp3','assets/sfx/uhh.ogg' ]);
        this.load.audio('maintheme', [ 'assets/sfx/maintheme.ogg','assets/sfx/maintheme.mp3' ]);
        this.load.audio('dractheme', [ 'assets/sfx/dractheme.ogg','assets/sfx/dractheme.mp3' ]);
    }

    create ()
    {
        //scene = this;
        this.buildMap();

        var easystar;
        console.log(this.listToMatrix(this.layers[1], 32));
        this.easystar = new EasyStar.js();
        this.easystar.setGrid(this.listToMatrix(this.layers[1], 32));
        this.easystar.setAcceptableTiles([0]);
        this.easystar.disableCornerCutting();

        var isFindingPath = false;
        var tapPos = new Phaser.Geom.Point(0,0);
        var isWalking = false;
        var borderOffset = new Phaser.Geom.Point(0,0);
        var path = [];
        var destination = new Phaser.Geom.Point(15,9);
        this.isFindingPath = isFindingPath;
        this.tapPos = tapPos;
        this.isWalking =  isWalking;
        this.borderOffset = borderOffset;
        this.destination = destination;
        this.path = path;


        /*var velocityX = 0;
        var velocityY = 0;*/
        /*var keys = this.input.keyboard.addKeys('W,S,A,D,LEFT,RIGHT,UP,DOWN');

        keys.W.on('down', function(event) {velocityY = -1});
        keys.W.on('up', function(event) {velocityY = 0});
        keys.S.on('down', function(event) {velocityY = 1});
        keys.S.on('up', function(event) {velocityY = 0});
        keys.A.on('down', function(event) {velocityX = -1});
        keys.A.on('up', function(event) {velocityX = 0});
        keys.D.on('down', function(event) {velocityX = 1});
        keys.D.on('up', function(event) {velocityX = 0});
        camX = camX + velocityX;
        camY = camY + velocityY;*/

        //this.cameras.main.setZoom();


        var health=30;

		var x=this.centerX + 200;
		var y=this.centerY + 400;
		// Tile -> World: const tx = (x-y) * this.tileWidthHalf;
		// Tile -> World: const ty = (x+y) * this.tileHeightHalf;
		var isoTileX = Math.floor((x-this.centerX)/this.tileWidthHalf);
		var isoTileY = Math.floor((y-this.centerY)/this.tileHeightHalf);
		var tileX = (isoTileX+isoTileY)/2;
		var tileY = isoTileY - tileX;
		console.log("200, 400 -> "+x+","+y+" -> iso "+isoTileX+","+isoTileY+" -> tile "+tileX+","+tileY);

		this.playerSprite = this.add.sprite(x,y);
        this.playerSprite.depth = 10000;
		console.log("The player sprite depth is " + this.playerSprite.depth);
		//this.playerSprite.setScale(4);
        this.playerSprite.flipX = true;
        var health=30;
        this.player = new Player({scene:this, sprite: this.playerSprite, x: x, y: y, health: health});
        this.player.createAnim('stewie');
        this.playerSprite.play('stewieidle');

        x=600;
		this.npcSprite = [this.add.sprite(x,y)];
        this.npcSprite[0].depth = 10000;
        this.npc = [new Npc({scene: this, sprite: this.npcSprite[0], x:x, y:y, health: health, enemyType: 'thrall'})];
        this.npc[0].createAnims();
        this.npc[0].activityPoints=3;

        x=500; y-=64;
		this.npcSprite.push(this.add.sprite(x,y));
        this.npcSprite[1].depth = 10000;
        this.npc.push(new Npc({scene: this, sprite: this.npcSprite[1], x:x, y:y, health: health, enemyType: 'bat'}));


        this.hud = new Hud({scene: this, player: this.player, npc: this.npc});

        console.log("is npc [0] alive:" + this.npc[0].alive);
        if(this.npc[0].alive){
          this.npcSprite[0].play('thrallidle');
        }
        if(this.npc[1].alive){
          this.npcSprite[1].play('batidle');
        }

        this.hud = new Hud({scene: this, player: this.player, npc: this.npc});


        /*this.createSounds();*/
        var camX = x;
        var camY = y;
        this.cameras.main.setSize(1600, 1200);
        //this.cameras.main.setPosition(-camX, -camY);
        this.cameras.main.centerOn(camX+350, camY+300);
        this.cameras.main.setZoom(1.2);
        console.log(this.cameras.main.zoom);
        //var keyObj = this.input.keyboard.addKey('W');
        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
          camera: this.cameras.main,
          left: cursors.left,
          right: cursors.right,
          up: cursors.up,
          down: cursors.down,
          zoomIn: this.input.keyboard.addKey('Q'),
          zoomOut: this.input.keyboard.addKey('E'),
          acceleration: 0.06,
          drag: 0.005,
          maxSpeed: 1.0
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        this.player.create();
        //this.hud.create();
        this.npc.forEach(npc => {
			npc.create();
		});
    }

  listToMatrix(list, elementPerSubArray){
    var matrix = [], i, k;
    for(i = 0, k = -1; i < list.length; i++){
      if(i % elementPerSubArray === 0){
        k++;
        matrix[k] = [];
      }
      matrix[k].push(list[i]);
    }
    return matrix;
  }
  findPath(playerPt){
    var playerMapTile = new Phaser.Geom.Point();
    playerMapTile = playerPt;
    console.log(this.id);
    console.log(playerPt.x + " " + playerPt.y);
    if(this.isFindingPath || this.isWalking)return;
    var posX = this.input.mousePointer.worldX;
    var posY = this.input.mousePointer.worldY;
    console.log(posX + " " + posY);
    var isoPt = new Phaser.Geom.Point(posX - 0, posY - 0);
    this.tapPos = this.isometricToCartesian(isoPt);
    this.tapPos.x -= this.tileWidthHalf;
    this.tapPos.y += this.tileWidthHalf;
    this.tapPos = this.getTileCoordinatesFromCart(this.tapPos);
    console.log(this.tapPos.x + " " + this.tapPos.y);
    if(this.tapPos.x > -1 && this.tapPos.y > -1 && this.tapPos.x < 32 && this.tapPos.y < 32){
      if(this.layers[1][this.id] != 1){
        this.isFindingPath = true;
        this.easystar.findPath(playerPt.x, playerPt.y, this.tapPos.x, this.tapPos.y, this.plotAndMove);
        this.easystar.calculate();
        console.log("made path");
      }
    }
  }
  plotAndMove(newPath){
  //var isFindingPath = false;

    //this.destinatio
    console.log(newPath);
    var path = newPath;
    console.log(path);
    //this.isFindingPath = false;
    if(path == null){
      console.log("no path found");
    } else {
      path.push(this.tapPos);
      path.reverse();
      path.pop();
      for(let i = 0; i < this.path.length; i++){
        //var tmpSpr
      }
    }
  }

  screenPoint(posX, posY){//not needed anymore
    var screenPt = new Phaser.Geom.Point();
    screenPt.x = posX;
    screenPt.y = posY;
    return(this.screenPt);
  }

	cartesianToIsometric(cartPt) {
		var tempPt=new Phaser.Geom.Point();
		tempPt.x=cartPt.x-cartPt.y;
		tempPt.y=(cartPt.x+cartPt.y)/2;
		return tempPt;
	}

	isometricToCartesian(isoPt){
		var tempPt=new Phaser.Geom.Point();
		tempPt.x=(2*isoPt.y+isoPt.x)/2;
		tempPt.y=(2*isoPt.y-isoPt.x)/2;
		return tempPt;
	}

	getTileCoordinatesFromCart(cartPt) {
		var tempPt=new Phaser.Geom.Point();
		tempPt.x=Math.floor(cartPt.x/this.tileHeight);
		tempPt.y=Math.floor(cartPt.y/this.tileHeight);
		return tempPt;
	}

    getTileXYType(pt){
		var x = pt.x;
		var y = pt.y;
		var id;
		id = (y * this.mapacross) + x;
    this.id = id;
		console.log(id);
		if(this.layers[1][id] != 0){
		  console.log("it worked, rock");
		} else{
		    console.log("movable");
      }
    }

    buildMap(){
      var scene = this
      const data = scene.cache.json.get('graveyard');
      var map = this.add.tilemap('graveyard');
      console.log(map);

      const tilewidth = data.tilewidth;
      const tileheight = data.tileheight;
	  this.tileHeight = tileheight;

      var tileWidthHalf = tilewidth / 2;
      var tileHeightHalf = tileheight / 2;

	  this.tileWidthHalf = tileWidthHalf;
	  this.tileHeightHalf = tileHeightHalf;

      this.layers = [];
      for(let j = 0; j < data.layers.length; j++){
        console.log(j);
        if(data.layers[j].type == "objectgroup"){
          var spawnX = data.layers[j].objects[0].x;
          var spawnY = data.layers[j].objects[0].y;
          const object = data.layers[j].data;
          console.log("it worked");
          console.log(data.layers[j].objects[0].x);
          console.log(data.layers[j].objects[0].y);
          return {x: spawnX, y: spawnY};
        }
        const layer = data.layers[j].data;
        this.layers.push(layer);

        const mapwidth = data.layers[j].width;
        const mapheight = data.layers[j].height;

		this.mapacross=mapwidth;
		this.mapdown=mapheight;

        const centerX = 0;//mapwidth * tileWidthHalf;
        const centerY = 0;//16;

		this.centerX = centerX;
		this.centerY = centerY;

        let i = 0;
        for(let y = 0; y < mapheight; y++){
          for(let x = 0; x < mapwidth; x++){
            const id = layer[i] - 1;

            const tx = (x-y) * tileWidthHalf;
            const ty = (x+y) * tileHeightHalf;
            if(id != -1){
				const tile = scene.add.image(centerX + tx, centerY + ty, 'tiles', id);

				tile.depth = centerY + ty;
            }
            i++;
          }
        }
      }
    }


    createSounds() {
		/*
        this.input.keyboard.on('keydown-SPACE', function () {
            console.log("Quiet.");
            this.sound.stopAll();
        }, this);

        this.womanWin = this.sound.add('womanwin');
        this.manWin = this.sound.add('manwin');
		*/
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
      this.controls.update();

      this.player.update();
      // Use actor for the animated figures.  Each player or npc has an actor.  This updates the player + npc.
	  this.npc.forEach(npc => {
		npc.update();
	  });
      //this.hud.update();
    }

}
