#include <stdio.h>

#ifndef byte
typedef unsigned char byte;
#endif

#define TILESACROSS 8
#define TILESDOWN 8
#define MAXENEMY 7
#define MAXBULLET 3
#define MAXSPAWN 4

struct Player {
	byte x,y;
	byte dir;
	byte hp;
	byte frame;	
	byte inventory;	// bitfield
	// Always sprite 0
};

enum EnemyType {
	ET_PLAYER,
	ET_BAT,
	ET_RAT,
	ET_THRALL,
	ET_DRACULA
};

struct Enemy {
	byte x,y;
	byte hp;
	byte type;
	byte sprite;
	byte spriteCount;
	byte frame;
	byte targetX,targetY;
};

struct Bullet {
	byte x,y;
	byte sprite;
	byte targetX,targetY;
};

enum GameModeType {
	GM_TITLE,
	GM_SELECTLEVEL,
	GM_PLAY,
	GM_GAMEOVER,
};

const struct Attack {
	byte flags;	// 1=meelee, 0=range; 
			// 2=undead damage, 0=normal; 
			// 4=drain status effect, 0=none;
			// 8=freeze status effect, 0=none;
	char damage;	// + or - for initial attack
	char *name;	// For the UI
} attack[]={
	{ 1,1,"BITE" },
	{ 3,2,"DRINK BLOOD" },
	{ 1,1,"CLAW" },
	{ 5,0,"DRAIN LIFE" },
	{ 0,1,"DAGGER" },
	{ 9,0,"HOLY WATER" },
	{ 1,2,"STAKE" },
};

const struct BaseStats {
	byte hp;	// max hp
	byte attacks;	// bitfield
	char *name;	// for UI
} baseStats[]={
	// 0 = player
	{8,0x38,"PLAYER"},
	// 1 = bat
	{1,1,"BAT"},
	// 2 = rat
	{1,3,"RAT"},
	// 3 = thrall
	{3,5,"THRALL"},
	// 4 = dracula
	{64,7,"DRACULA"},
};

struct Spawn {
	byte type;
	byte count;	// how many of this type to spawn
	byte startSec;	// how many seconds in since last spawn/level start
	byte spacingSec;// how many seconds apart to spawn
};

enum Behaviour {
	B_IDLE,		// Do nothing
	B_SWARM,	// Try to surround player
	B_FLEE,		// Move away from player
	B_PATROLX,	// Patrol on this X from spawn
	B_PATROLY,	// Patrol on this Y from spawn
	B_EXAMINE,	// Wander between nodes at random
};

// Level format: + = wall, T = tombstone, s = enemy spawn point
const struct Level {
	char *tile[TILESDOWN];
	struct Spawn spawnList[MAXSPAWN];
	byte spawnCount;
} level[] = {
	{
		{
			"    ++++",
			"T    +++",
			"      ++",
			"s T  T +",
			"        ",
			"T  T    ",
			"        ",
			"s T  T  ",
		},
		{ 
			{ ET_THRALL, 3, 5, 5 },
			{ ET_THRALL, 5, 60, 5 },
			{ ET_THRALL, 7, 60, 5 },
	       	},
		3
	},
};

struct Player player;
struct Enemy enemy[MAXENEMY];
struct Bullet bullet[MAXBULLET];
struct Game {
	byte enemyCount;
	byte bulletCount;
	byte levelNo;
	byte mode;	
	byte spawnType;	// The spawn index for this level or -1
	byte spawnRemaining;	// How many of count spawns need to appear still
	int spawnTimer;	// 60th of a second until the next spawn
	byte day,hour;
	int hourTimer;	// Each day takes 1h? So each hour takes 6min, so each min takes 6*60*60 frames
} game;

void drawTile(int x,int y)
{
	int i;
	if(player.x==x && player.y==y) {
		printf("P");
		return;
	}
	for(i=0;i<game.enemyCount;i++) {
		if(enemy[i].x==x && enemy[i].y==y) {
			printf("%c",'E'+enemy[i].type);
			return;
		}
	}
	for(i=0;i<game.bulletCount;i++) {
		if(bullet[i].x==x && bullet[i].y==y) {
			printf("%c",',');
			return;
		}
	}
	printf("%c",level[game.levelNo].tile[y][x]);
}


void drawBoard()
{
	int x,y;
	// Draw the board
	printf("Board state:\n");
	for(y=0;y<TILESDOWN;y++) {
		for(x=0;x<TILESACROSS;x++) {
			drawTile(x,y);
		}
		printf("\n");
	}
}

void updateEnemy(int id)
{
}

void updateBullet(int id)
{
}

void updatePlayer()
{
	int i;

	for(i=0;i<game.bulletCount;i++) {
		updateBullet(i);
	}
}

void updateGame()
{
	int i;

	updatePlayer();
	for(i=0;i<game.enemyCount;i++) {
		updateEnemy(i);
	}
}

void resetGame()
{
	player.x=0;
	player.y=0;
	game.enemyCount=0;
	game.bulletCount=0;
	game.levelNo=0;
	game.mode=GM_PLAY;
	game.spawnType=0;
	game.spawnRemaining=0;
	game.spawnTimer=123;
	game.day=1;
	game.hour=0;
	game.hourTimer=6*60*60;

}

void initGraphics()
{
}

int main(int argc,char **argv)
{
	initGraphics();
	resetGame();
	while(1) {
		updateGame();
		drawBoard();
	}
	return 0;
}



