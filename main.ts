/// <reference path="typings/tsd.d.ts" />
class FirstGame {
    private game: Phaser.Game;
    private platforms: Phaser.Group;
    private player: Phaser.Sprite;
    private stars: Phaser.Group;
    private cursors: Phaser.CursorKeys;
    private score: number;
    private scoreText: Phaser.Text;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: this.preload, create: this.create, update: this.update });
        this.score = 0;
    }

    private preload = (): void => {
        this.game.load.image("sky", "assets/sky.png");
        this.game.load.image("ground", "assets/platform.png");
        this.game.load.image("star", "assets/star.png");
        this.game.load.spritesheet("dude", "assets/DudeWalking.png", 28, 49);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    };

    private create = (): void => {
        // let star: Phaser.Sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "star");
        // star.anchor.setTo(0.5, 0.5);

        this.score = 0;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, "sky");

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        let ground = this.platforms.create(0, this.game.world.height - 64, "ground");
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        let ledge = this.platforms.create(400, 400, "ground");
        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, "ground");
        ledge.body.immovable = true;

        this.player = this.game.add.sprite(32, this.game.world.height - 150, "dude");
        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 500;
        this.player.body.collideWorldBounds = true;

        this.player.animations.add("left", [0, 1, 2, 3], 10, true);
        this.player.animations.add("right", [5, 6, 7, 8], 10, true);

        this.scoreText = this.game.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#000" });

        this.stars = this.game.add.group();
        this.stars.enableBody = true;

        for (let i = 0; i < 12; i++) {
            let star = this.stars.create(i * 70, 0, "star");
            star.body.gravity.y = 500;
            star.body.bounce.y = 0.2 + Math.random() * 0.2;
        }

        let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(() => { console.log("hara"); }, this);
    };

    private update = (): void => {

        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.stars, this.platforms);

        let self = this;
        this.game.physics.arcade.overlap(this.player, this.stars, self.collectStar, null, this);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play("left");
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play("right");
        }
        else {
            this.player.animations.stop();
            this.player.frame = 3;
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -500;
        }
    };

    private collectStar = (player, star) => {
        star.kill();

        this.score += 10;
        this.scoreText.text = "Score: " + this.score;
    };

}

window.onload = () => {
    let game: FirstGame = new FirstGame();
};