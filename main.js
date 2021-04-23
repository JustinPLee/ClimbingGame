class GameScene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('platform', 'assets/platforms/platform-default.png');
        this.load.image('player', 'assets/player/player-idle-0.png');
    }

    create() {
        this.options = {};
        this.options.speed = 100;
        this.keys = this.input.keyboard.addKeys({
            a: Phaser.Input.Keyboard.KeyCodes.A,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        this.cameras.main.backgroundColor.setTo(120, 0, 0);
        this.player = this.physics.add.image(config.width / 2, config.height - 800, 'player');
        this.player.setCollideWorldBounds(true);


        this.platformGroup = this.physics.add.group({ defaultKey: 'platform', allowGravity: false, immovable: true, maxSize: 20, scale: 2 });
        this.initialPlatform = this.physics.add.image(config.width / 2, config.height - 750, 'platform');
        this.initialPlatform.setScale(2);
        this.initialPlatform.setImmovable(true);
        this.initialPlatform.body.setAllowGravity(false);
        this.initialPlatform.setVelocityY(this.options.speed);

        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: this.addPlatform,
            callbackScope: this
        });

        this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: this.speedUp,
            callbackScope: this
        });

        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.collider(this.player, this.initialPlatform);
        this.score = 0;
        this.scoreText = this.add.text(0, 0, "Score: " + this.score, { font: "bold 32px Arial", fill: "#fff" });
    }

    update() {
        if (this.player.body.y + this.player.body.height >= config.height) {
            this.score = 0;
            this.scene.restart();
        }
        this.platformGroup.children.each((child) => {
            if (child.body.y >= config.height) {
                this.platformGroup.killAndHide(child);
                if (this.initialPlatform.isActive) {
                    this.initialPlatform.destroy();
                }
            }
        });
        if (!this.keys.space.isDown && (this.player.body.blocked.down || this.player.body.touching.down)) {
            this.player.allowedToJump = true;
        }
        if (this.keys.space.isDown && (this.player.body.blocked.down || this.player.body.touching.down) && this.player.allowedToJump) {
            this.player.allowedToJump = false;
            this.player.setVelocityY(-900);
        }
        if (this.keys.a.isDown) {
            this.player.setVelocityX(-400);
            this.player.flipX = true;
        } else if (this.keys.d.isDown) {
            this.player.setVelocityX(400);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }
        this.scoreText.setText("Score: " + this.score);
    }
    addPlatform() {
        //this.platformList = [];
        // for (let i = 1; i <= 9; i++) {
        //     this.platformGroup.create(Math.floor(Math.random() * (400 - 50 + 1) + 50), config.height - (i * 75 + 130), 'platform');
        // }
        // this.platformGroup.children.each(function(child) {
        //     child.body.checkCollision.left = false;
        //     child.body.checkCollision.right = false;
        //     child.body.checkCollision.down = false;
        //     child.setVelocityY(75);
        // });
        const x = Phaser.Math.Between(75, 925);
        const y = 0;
        const platform = this.platformGroup.get(x, y);
        platform.body.checkCollision.left = false;
        platform.body.checkCollision.right = false;
        platform.body.checkCollision.down = false;
        if (!platform) return;
        this.score += 1;
        this.recreatePlatform(platform);
    }
    recreatePlatform(platform) {
        platform.setActive(true).setVisible(true);
        platform.setVelocityY(this.options.speed);
        if (Phaser.Math.Between(0, 2) == 0) {
            platform.setScale(Math.floor(Math.random() * 2) + 0.5);
        }
    }
    speedUp() {
        this.options.speed += 25;
    }
};

let config = {
    type: Phaser.AUTO,
    scene: GameScene,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 3000 }
        }
    },
    width: 1000,
    height: 800
};
let game = new Phaser.Game(config);