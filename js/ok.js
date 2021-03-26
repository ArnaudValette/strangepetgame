let gameScene = new Phaser.Scene("game");

gameScene.init = function(){
    this.eMaxs = 4.5;
    this.eMins = 2;
    this.top = 80;
    this.bot = 280;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.speed = 3;


};

gameScene.preload = function(){

    this.load.image("background" , "assets/background.png");
    this.load.image("player" , "assets/player.png");
    this.load.image("enemy" , "assets/dragon.png");
    this.load.image("goal" , "assets/treasure.png");
    

};

gameScene.create = function(){

    this.bg = this.add.sprite(0,0, "background");
    this.bg.setOrigin(0,0);
    this.bg.setPosition(0,0);

    this.player = this.add.sprite(60, this.sys.game.config.height/2, "player");
    this.player.setScale(.5);

    this.enemy = this.add.sprite(220, this.sys.game.config.height/2, "enemy");
    this.enemy.setScale(.7);
    this.enemy.flipX = true;

    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height/2, "goal");
    this.goal.setScale(.6);

    this.enemy.speed = Math.random() * (this.eMaxs - this.eMins) + this.eMins;
    this.enemy.direction = Math.random() < .5 ? 1 : -1;
    this.enemy.movement = this.enemy.speed * this.enemy.direction;

    

};

gameScene.update = function(){
    let conditionToGoUp = this.enemy.movement > 0 && this.enemy.y >= this.bot;
    let conditionToGoDown = this.enemy.movement < 0 && this.enemy.y <= this.top;

    this.enemy.y += this.enemy.movement;


    if(conditionToGoUp || conditionToGoDown){
        this.enemy.movement *= -1;
    }

    if(this.input.activePointer.isDown){
        this.player.x += 3;
    }

    this.pRect = this.player.getBounds();
    this.eRect = this.enemy.getBounds();
    this.gRect = this.goal.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(this.pRect, this.eRect)){
        this.scene.restart();
        return;
    }
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.pRect, this.gRect)){
        this.scene.restart();
        return;
    }

    if(this.cursors.left.isDown){
        this.player.flipX = true;
        this.player.x -= this.speed;
        
    }
    else if(this.cursors.right.isDown){
        this.player.flipX = false;
        this.player.x += this.speed;
        
    }

    else if(this.cursors.up.isDown){
        
        this.player.y -= this.speed;
        
    }
    else if(this.cursors.down.isDown){
        
        this.player.y += this.speed;
    }

};


let config = {
    type : Phaser.AUTO,
    width : 640,
    height : 360,
    scene : gameScene
};

let game = new Phaser.Game(config);