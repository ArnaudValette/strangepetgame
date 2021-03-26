let pacManScene = new Phaser.Scene("pacman");

let config = {
    type: Phaser.AUTO,
    width : 800,
    height: 600,
    scene: pacManScene
};


pacManScene.init = function(){
    this.cursors = this.input.keyboard.createCursorKeys();
    

    
    

};
pacManScene.preload = function(){
    this.load.image("pacman", "assets/pacman.png");
    this.load.image("wall", 'assets/barrier.png');
    this.load.image("ghost", "assets/ghost.png");
    this.load.image("fruit", "assets/fruit.png");

};

pacManScene.create = function(){
    this.score = 0;
    
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    this.player = this.add.sprite(this.sys.game.config.width/2, 400, "pacman");
    
    this.player.speed = 3;

    this.enemy = [this.add.sprite(Math.random() * (this.sys.game.config.width - 20 - 20) + 20, Math.random() * (this.sys.game.config.height - 20 - 20) + 20, "ghost"), this.add.sprite(Math.random() * (this.sys.game.config.width - 20 - 20) + 20, Math.random() * (this.sys.game.config.height - 20 - 20) + 20, "ghost"), this.add.sprite(Math.random() * (this.sys.game.config.width - 20 - 20) + 20, Math.random() * (this.sys.game.config.height - 20 - 20) + 20, "ghost"), this.add.sprite(Math.random() * (this.sys.game.config.width - 20 - 20) + 20, Math.random() * (this.sys.game.config.height - 20 - 20) + 20, "ghost")];
    this.enemy.speed = 1.5;

    this.fruit = this.add.sprite(Math.random() * (this.sys.game.config.width - 20 - 20) + 20, Math.random() * (this.sys.game.config.height - 20 - 20) + 20, "fruit");
    this.fruit.setScale(1.5);

};

pacManScene.update = function(){

   

    for(let i = 0; i< this.enemy.length ; i++){
    
    


    this.xDistance = this.player.x - this.enemy[i].x;
    this.yDistance = this.player.y - this.enemy[i].y;

    this.enemyXdir = this.xDistance < 0 ? -1 : 1;
    this.enemyYdir = this.yDistance < 0 ? -1 : 1;

    if(this.player.x == this.enemy[i].x){
        this.enemy[i].y += this.enemyYdir * this.enemy.speed;
    }
    if(this.player.y == this.enemy[i].y){
       this.enemy[i].x += this.enemyXdir * this.enemy.speed;
    }
    if(this.player.y != this.enemy[i].y){
        this.enemy[i].y += this.enemyYdir * this.enemy.speed;
    }
    if(this.player.x != this.enemy[i].x){
        this.enemy[i].x += this.enemyXdir * this.enemy.speed;
    }

    
    
    let jump = Math.random() < .5 ? 1 : -1;
    let dir = Math.random() >.5 ? 1 : -1;
    if(jump == 1){
        
   this.enemy[i].x += dir * 3;
    }
    else{
        this.enemy[i].y += dir * 3;
    }
   
    

}


if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.fruit.getBounds())){
    this.fruit.x = Math.random() * (this.sys.game.config.width - 20 - 20) + 20;
    this.fruit.y = Math.random() * (this.sys.game.config.height - 20 - 20) + 20;
    this.score += 1;
    this.scoreText.setText('Score:' + this.score);
    for(let i = 0; i< this.enemy.length ; i++){
        this.enemy[i].x = Math.random() * (this.sys.game.config.width - 20 - 20) + 20;
        this.enemy[i].y = Math.random() * (this.sys.game.config.height - 20 - 20) + 20;
    }
}

        
    
    

    if(this.cursors.left.isDown){
        this.player.x -= this.player.speed;
        this.player.angle = 180;
        
    }
    else if(this.cursors.right.isDown){
        this.player.angle = 0;
        this.player.x += this.player.speed;
        
    }

    else if(this.cursors.up.isDown){
        this.player.angle = 270;
        this.player.y -= this.player.speed;
        
    }
    else if(this.cursors.down.isDown){
        this.player.angle = 90;
        this.player.y += this.player.speed;
    }
    
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy[0].getBounds()) || Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy[1].getBounds())){
        this.scene.restart();
    }

};


let game = new Phaser.Game(config);