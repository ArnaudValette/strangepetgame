//new game scene
let gameScene = new Phaser.Scene('Game');




//////////////////////////////////
// 1 :INIT

gameScene.init = function(){
    this.playerSpeed = 3;
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.5;

    this.enemyMinY = 80;
    this.enemyMaxY = 280;

};





//////////////////////////////////
// 2 :PRELOAD

gameScene.preload = function(){
    
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('goal', 'assets/treasure.png');

   
};



/////////////////////////////////
// 3 :CREATE


gameScene.create = function(){



     /////////////////////////
     // RELATED TO BACKGROUND
     let bg = this.add.sprite(0,0, 'background');
    
     bg.setOrigin(0,0);
    bg.setPosition(0,0);

    
    
            //////////////////////////
             //RELATED TO PLAYER
    this.player = this.add.sprite(40, this.sys.game.config.height/2, 'player');
    this.player.setScale(.5);

    /////////////////////
    // ENEMIES

    this.enemy = this.add.sprite(240, this.sys.game.config.height /2, 'enemy');
    this.enemy.flipX = true;
    this.enemy.setScale(.8);

    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    this.enemy.speed = dir * speed;

    //////////////////////
    // GOAL

    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height/2, 'goal');
    this.goal.setScale(.7);
};


/////////////////////////////
// 4 :UPDATE



gameScene.update = function(){
    



    if(this.input.activePointer.isDown){
        this.player.x += this.playerSpeed;
    }

    let playerRect = this.player.getBounds();
    let goalRect = this.goal.getBounds();
    let enemyRect = this.enemy.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)){
        console.log('won');
        this.scene.manager.bootScene(this);

        return;
    }

    this.enemy.y += this.enemy.speed;

    let conditionUp = this.enemy.speed < 0 && this.enemy.y <= this.enemyMinY;
    let conditionDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY;

    if(conditionUp || conditionDown){
        this.enemy.speed *= -1;
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)){
        console.log('lose');
        this.scene.restart();

        return;
    }
};



////////////////////////////
// CONFIG

let config = {
    type : Phaser.AUTO,
    width : 640,
    height : 360,
    
    scene : gameScene
};

////////////////////////
// game

let game = new Phaser.Game(config);