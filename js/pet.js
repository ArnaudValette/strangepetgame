let gameScene = new Phaser.Scene("Game");


gameScene.init = function(){
    this.stats = { health: 100, fun: 100};
    this.items = [];
    //520
    this.ground = {bot: 520, top: 400 };
    this.gravity = 15;

};


gameScene.preload = function(){
    this.load.image("background", "assets/images/backyard.png");
    this.load.image("apple", "assets/images/apple.png");
    this.load.image("candy", "assets/images/candy.png");
    this.load.image("duck", "assets/images/rubber_duck.png");
    this.load.image("rotate", "assets/images/rotate.png");
    this.load.spritesheet("pet", "assets/images/pet.png", {frameWidth: 97, frameHeight: 83, margin : 1, spacing: 1});
};

gameScene.create = function(){
    this.bg = this.add.image(0,0, "background").setOrigin(0,0).setInteractive();
    this.bg.on("pointerdown", this.placeItem, this);

    this.pet = this.add.sprite(200, 100, "pet", 0).setInteractive();
    
    this.anims.create({
        key: "Eat",
        frames: this.anims.generateFrameNames('pet', {frames : [1, 2, 3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0
    });

    this.input.setDraggable(this.pet);
    this.input.on("drag", function(pointer, gameObject, dragX, dragY){
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    this.input.on("dragend", this.petFall, this);
    this.pickedItem;
    this.petFall();
    this.loadUi();
};


gameScene.loadUi = function(){
    let space = (360 - 80)/3 ;

    this.apple = this.add.sprite(40, 580, "apple").setInteractive();
    this.apple.customStats = {health: 20, fun: 0};
    this.apple.on("pointerdown", this.pickItem);

    ///////////
    // CANDY

    this.candy = this.add.sprite(40 + space, 580, "candy").setInteractive();
    this.candy.customStats = {health: -10, fun : 10};
    this.candy.on("pointerdown", this.pickItem);
    
    //////////
    // DUCK

    this.duck = this.add.sprite(40 + space + space, 580, "duck").setInteractive();
    this.duck.customStats = {health: 0, fun: 20};
    this.duck.on("pointerdown", this.pickItem);

    /////////
    // ROTATION


    this.rotateBtn = this.add.sprite(this.sys.game.config.width - 40, 580, "rotate").setInteractive();
    this.rotateBtn.customStats = {health: 0, fun : 10};
    this.rotateBtn.on("pointerdown", this.rotate);

    this.buttons = [this.apple, this.candy, this.duck, this.rotate];

    this.uiReady();

};

gameScene.petFall = function(pointer, localX, localY){
    this.pet.setFrame(3);
    let groundPosition = localY > this.ground.top ? localY : Math.random() * (this.ground.bot - this.ground.top) + this.ground.top;
    this.fallTween = this.tweens.add({
        targets: this.pet,
        y : groundPosition,
        duration: 500,
        ease: "Quad.easeIn",
        callbackScope: this,
        onComplete: function(){
            this.pet.setFrame(0);
        }

    });
};

gameScene.update = function(){
    

};


gameScene.placeItem = function(pointer, localX, localY){
    if(!this.pickedItem){ return;}
    if(this.uiBlocked){return;}


    else{
        this.pickedItem.alpha = 1;
        let newItem = this.add.sprite(localX, localY, this.pickedItem.texture.key);
        this.uiBlocked = true;
        let groundPosition = localY > 400 ? localY : Math.random() * (this.ground.bot - this.ground.top) + this.ground.top;

        this.itemFallTween = this.tweens.add({
            targets: newItem,
            y: groundPosition,
            duration: 500,
            ease: "Quad.easeIn",
            callbackScope: this,
            paused: false,

            onComplete: function(){
                this.pet.setFrame(3);
                this.eatTweens = this.tweens.add({
                    targets: this.pet,
                    duration: 500,
                    x: newItem.x,
                    y:newItem.y,
                    callbackScope: this,
                    onComplete: function(tween, sprite){
                        newItem.destroy();
                        this.pet.on("animationcomplete", function(){
                            if(!this.pickedItem){return;}
                            this.stats.health += this.pickedItem.customStats.health;
                            this.stats.fun += this.pickedItem.customStats.fun;
                            this.uiReady();
                            this.pet.setFrame(0);
                            console.log(this.stats);
                            
                        }, this);
                        this.pet.play("Eat");
        
                    }
                });
            }

        });

        
        console.log( this.pickedItem.texture.key );
        
        
        
    }
};

gameScene.pickItem = function(){
    if(this.scene.uiBlocked){return;}
    this.scene.uiReady();
    this.scene.pickedItem = this;
    this.alpha = .5;
    console.log(this.scene.pickedItem.texture.key);
    
};

gameScene.rotate = function(){
    if(this.scene.uiBlocked){return;}
    this.scene.uiReady();
    this.alpha = .5;
    this.scene.uiBlocked = true;

    this.rotateTween = this.scene.tweens.add({
        targets : this.scene.pet,
        angle : 720,
        duration : 600,
        paused : false,
        callbackScope : this,
        onComplete : function(tween, sprites){
            this.alpha = 1;
            this.scene.stats.fun += this.customStats.fun;
            this.scene.uiReady();
            console.log(this.scene.stats);
        }   

    });

    

   
};

gameScene.uiReady = function(){
    console.log("ui reload");
    this.pickedItem = null;
    this.uiBlocked = false;
    for(let i = 0; i < this.buttons.length; i++){
        this.buttons[i].alpha = 1;
    }
};

let config = {
    type : Phaser.AUTO,
    width : 360,
    height : 640,
    pixelArt : false,
    title : "Pet",
    scene : gameScene
};

let game = new Phaser.Game(config);