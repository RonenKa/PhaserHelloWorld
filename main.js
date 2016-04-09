/// <reference path="typings/tsd.d.ts" />
var FirstGame = (function () {
    function FirstGame() {
        var _this = this;
        this.preload = function () {
            _this.game.load.image("sky", "assets/sky.png");
            _this.game.load.image("ground", "assets/platform.png");
            _this.game.load.image("star", "assets/star.png");
            _this.game.load.spritesheet("dude", "assets/DudeWalking.png", 28, 49);
            _this.cursors = _this.game.input.keyboard.createCursorKeys();
        };
        this.create = function () {
            // let star: Phaser.Sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "star");
            // star.anchor.setTo(0.5, 0.5);
            _this.score = 0;
            _this.game.physics.startSystem(Phaser.Physics.ARCADE);
            _this.game.add.sprite(0, 0, "sky");
            _this.platforms = _this.game.add.group();
            _this.platforms.enableBody = true;
            var ground = _this.platforms.create(0, _this.game.world.height - 64, "ground");
            ground.scale.setTo(2, 2);
            ground.body.immovable = true;
            var ledge = _this.platforms.create(400, 400, "ground");
            ledge.body.immovable = true;
            ledge = _this.platforms.create(-150, 250, "ground");
            ledge.body.immovable = true;
            _this.player = _this.game.add.sprite(32, _this.game.world.height - 150, "dude");
            _this.game.physics.arcade.enable(_this.player);
            _this.player.body.bounce.y = 0.2;
            _this.player.body.gravity.y = 500;
            _this.player.body.collideWorldBounds = true;
            _this.player.animations.add("left", [0, 1, 2, 3], 10, true);
            _this.player.animations.add("right", [5, 6, 7, 8], 10, true);
            _this.scoreText = _this.game.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#000" });
            _this.stars = _this.game.add.group();
            _this.stars.enableBody = true;
            for (var i = 0; i < 12; i++) {
                var star = _this.stars.create(i * 70, 0, "star");
                star.body.gravity.y = 500;
                star.body.bounce.y = 0.2 + Math.random() * 0.2;
            }
            var spaceKey = _this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(function () { console.log("hara"); }, _this);
        };
        this.update = function () {
            _this.game.physics.arcade.collide(_this.player, _this.platforms);
            _this.game.physics.arcade.collide(_this.stars, _this.platforms);
            var self = _this;
            _this.game.physics.arcade.overlap(_this.player, _this.stars, self.collectStar, null, _this);
            _this.player.body.velocity.x = 0;
            if (_this.cursors.left.isDown) {
                _this.player.body.velocity.x = -150;
                _this.player.animations.play("left");
            }
            else if (_this.cursors.right.isDown) {
                _this.player.body.velocity.x = 150;
                _this.player.animations.play("right");
            }
            else {
                _this.player.animations.stop();
                _this.player.frame = 3;
            }
            if (_this.cursors.up.isDown && _this.player.body.touching.down) {
                _this.player.body.velocity.y = -500;
            }
        };
        this.collectStar = function (player, star) {
            star.kill();
            _this.score += 10;
            _this.scoreText.text = "Score: " + _this.score;
        };
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: this.preload, create: this.create, update: this.update });
        this.score = 0;
    }
    return FirstGame;
}());
window.onload = function () {
    var game = new FirstGame();
};
