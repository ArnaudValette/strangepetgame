let gameScene = new Phaser.Scene("Game");


gameScene.init = function(){
    this.playerSpeed = 3;
    this.upArrow = gameScene.input.keyboard.addKey('z');
    this.downArrow = gameScene.input.keyboard.addKey('s');
    this.leftArrow = gameScene.input.keyboard.addKey('q');
    this.rightArrow = gameScene.input.keyboard.addKey('d');
    this.eMaxSpeed = 4.5;
    this.eMinSpeed = 1;

    this.top = 80;
    this.bot = 280;

};

gameScene.preload = function(){
    this.load.image("background", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/dragon.png");
    this.load.image("goal", "assets/treasure.png");

};

gameScene.create = function(){
    this.bg = this.add.sprite(0, 0, "background");
    this.bg.setOrigin(0,0);
    this.bg.setPosition(0,0);

    this.player = this.add.sprite( 40,this.sys.game.config.height/2, 'player');
    this.player.setScale(.5);

    this.enemy1 = this.add.sprite( 180,this.sys.game.config.height/2, 'enemy');
    this.enemy1.flipX = true;
    this.enemy1.setScale(.7);

    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height/2, 'goal');
    this.goal.setScale(.6);

    let direction = Math.random() < .5 ? -1 : 1;
    let speed = this.eMinSpeed + Math.random() * (this.eMaxSpeed - this.eMinSpeed);
    this.enemy1.speed = direction * speed;

};

gameScene.update = function(){
    //enemyMovement :
        ///////////// Limits :
        let goingUpCondition = this.enemy1.speed > 0 && this.enemy1.y >= this.bot;
        let goingDownCondition = this.enemy1.speed < 0 && this.enemy1.y <= this.top;
        
        this.enemy1.y += this.enemy1.speed;

        if(goingUpCondition || goingDownCondition){
            this.enemy1.speed *= -1;
        }

        


    if(this.upArrow.isDown){
        this.player.y -= this.playerSpeed;
    }
    if(this.downArrow.isDown){
        this.player.y += this.playerSpeed;
    }

    if(this.leftArrow.isDown){
        this.player.x -= this.playerSpeed;
    }

    if(this.rightArrow.isDown){
        this.player.x += this.playerSpeed;
    }





    this.pRect = this.player.getBounds();
    this.eRect = this.enemy1.getBounds();
    this.gRect = this.goal.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(this.pRect, this.eRect)){
        console.log("you loose");
        this.scene.restart();
    }

    if(Phaser.Geom.Intersects.RectangleToRectangle(this.pRect, this.gRect)){
        console.log("well done");
        this.scene.restart();
    }

};



let config ={
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};

let game = new Phaser.Game(config);