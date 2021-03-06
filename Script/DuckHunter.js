//============================ Game declarations ==============================
function Game() {
    this._canvas = document.getElementById("myCanvas");
    this._canvasCtx = this._canvas.getContext("2d");

    this._worldScrollPos = new Point(0, 0);
    this._worldImage = new Image(4000, 1384);
    this._bulitImage = new Image(10, 60);
       
    this._keyStates = {};

    this._ducks = [];
    this._scoreIndicators = [];

    this._finishTime = null;
    this._score = 0;
    this._bulitCount = Game.prototype.MAX_BULIT_COUNT;
}

Game.prototype.WORLD_SCROLL_STEP = 20;
Game.prototype.GAME_DURATION = 120;
Game.prototype.MAX_BULIT_COUNT = 10;

Game.prototype._render = function () {

    this._canvasCtx.drawImage(this._worldImage, this._worldScrollPos.x, this._worldScrollPos.y, this._canvas.clientWidth, this._canvas.clientHeight,
                                                                        0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
    this._canvasCtx.save();
    this._canvasCtx.translate(-this._worldScrollPos.x, -this._worldScrollPos.y);

    var drawArr = this._getScoreDucksArr();

    drawArr.forEach(function (self, entity) {
        entity.render(this._canvasCtx);
    }.bind(this, arguments));

    this._canvasCtx.restore();

    this._renderIndicators();
}

Game.prototype._renderIndicators = function () {
    var ms = this._finishTime - Date.now();

    this._canvasCtx.fillStyle = "rgb(255, 255, 255)";
    if (ms > 0) {
        this._canvasCtx.font = "48px serif";
        var timeString = "";
        var date = new Date(ms);
        var seconds = date.getSeconds();
        timeString += '' + date.getMinutes();
        timeString += ':' + (seconds < 10 ? '0' + seconds : seconds);
        
        this._canvasCtx.fillText(timeString, 930, 750);
        this._canvasCtx.strokeText(timeString, 930, 750);
        
        var scoreString = 'Score: ' + this._score;
        this._canvasCtx.fillText(scoreString, 10, 40);
        this._canvasCtx.strokeText(scoreString, 10, 40);

        var leftPos = 10;

        for (var index = 0; index < this._bulitCount; index++) {
            this._canvasCtx.drawImage(this._bulitImage, 0, 0, this._bulitImage.width, this._bulitImage.height, leftPos, this._canvas.clientHeight - this._bulitImage.height - 5, this._bulitImage.width, this._bulitImage.height);
            leftPos += this._bulitImage.width + 10;
        }


    } else {

        this._canvasCtx.font = "72px serif";
        var scoreString = 'Your score: ' + this._score;
        var tm = this._canvasCtx.measureText(scoreString);
        this._canvasCtx.fillText(scoreString, this._canvas.clientWidth / 2 - tm.width / 2, this._canvas.clientHeight / 2 - 36);
        this._canvasCtx.strokeText(scoreString, this._canvas.clientWidth / 2 - tm.width / 2, this._canvas.clientHeight / 2 - 36);
    }
}

Game.prototype._onKeyDown = function() {
    switch (event.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
            this._keyStates[event.keyCode] = true;
            break;
    }
}

Game.prototype._onKeyUp = function() {

    switch (event.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
            this._keyStates[event.keyCode] = false;
            break;
    }
}

Game.prototype._onMouseDown = function (event) {

    if (event.button === 0) {
        var rect = this._canvas.getBoundingClientRect();
        this._shoot(event.clientX + this._worldScrollPos.x - rect.left, event.clientY + this._worldScrollPos.y - rect.top);
    }
}

Game.prototype._onContextMenu = function (event) {

    this._refresh();

    event.preventDefault();
}

Game.prototype._gameLoop = function () {

    this._updateEntitiesStates();

    this._render();
}

Game.prototype._updateEntitiesStates = function () {

    this._updateKeysStates();
    this._performDucksActions();
}

Game.prototype._updateKeysStates = function () {

    if (this._keyStates[37]) {
        this._worldScrollPos.x = Math.max(0, this._worldScrollPos.x - Game.prototype.WORLD_SCROLL_STEP);
    }

    if (this._keyStates[38]) {
        this._worldScrollPos.y = Math.max(0, this._worldScrollPos.y - Game.prototype.WORLD_SCROLL_STEP);
    }

    if (this._keyStates[39]) {
        this._worldScrollPos.x = Math.min(this._worldImage.width - this._canvas.clientWidth, this._worldScrollPos.x + Game.prototype.WORLD_SCROLL_STEP);
    }

    if (this._keyStates[40]) {
        this._worldScrollPos.y = Math.min(this._worldImage.height - this._canvas.clientHeight, this._worldScrollPos.y + Game.prototype.WORLD_SCROLL_STEP);
    }
}

Game.prototype._performDucksActions = function () {

    var width = this._worldImage.width;
    var height = this._worldImage.height;
    var margin = 10;

    var actionArr = this._getScoreDucksArr();

    for (var index = actionArr.length - 1; index >= 0 ; index--) {
        var entity = actionArr[index];
        var entityPos = entity.getPos();
        var entitySize = entity.getSize();

        if ((entityPos.x < -(entitySize.cx + margin)) ||
            (entityPos.x > width + margin) ||
            (entityPos.y < -(entitySize.cy + margin)) ||
            (entityPos.y > height + margin)) {
            actionArr.splice(index, 1);
            continue;
        }
    }

    actionArr.forEach(function (entity) {
        entity.makeStep();
    });
}

Game.prototype._shoot = function (x, y) {

    if (this._bulitCount == 0)
        return;

    this._bulitCount--;
    for (var index = this._ducks.length - 1; index >= 0; index --) {
        var duck = this._ducks[index];
        var duckPos = duck.getPos();
        var duckSize = duck.getSize();

        if (!duck.isDead() && (duckPos.x < x) &&
            (duckPos.x + duckSize.cx > x) &&
            (duckPos.y < y) &&
            (duckPos.y + +duckSize.cy > y)) {
            duck.kill();

            var scoreVal = 0;
            
            switch (duckPos.z) {
                case 0:
                case 1:
                    scoreVal = 5;
                    break;
                case 2:
                    scoreVal = 10;
                    break;
                case 3:
                    scoreVal = 25;
                    break;
            }
            this._score += scoreVal;

            var scoreContent = new ScoreIndicator(scoreVal, this._canvasCtx);
            scoreContent.setPos(new Point(duckPos.x, duckPos.y, duckPos.z));
            this._scoreIndicators.push(scoreContent);
            
            break;
        }
    }
}

Game.prototype._refresh = function () {

    this._bulitCount = Game.prototype.MAX_BULIT_COUNT;
}

Game.prototype._generateDuck = function () {
    var duck = new Duck();
    var width = this._worldImage.width;
    var height = this._worldImage.height;

    var zPos = getRandomArbitary(1, 4);
    duck.setPos(new Point(getRandomArbitary(0, width), getRandomArbitary(0, height), zPos));

    duck.setDirection(getRandomArbitary(0, Duck.prototype.DIR_LAST + 1));

    if (!this._ducks.length) {
        this._ducks.push(duck);
    } else {
        for (var index = 0; index < this._ducks.length; index++) {
            if (zPos >= this._ducks[index].getPos().z) {
                this._ducks.unshift(duck);
                break;
            } else if (index == this._ducks.length - 1) {
                this._ducks.push(duck);
            }
        }
    }
}

Game.prototype._getScoreDucksArr = function () {
    var scoreDucksArr = this._ducks.concat(this._scoreIndicators);
    return scoreDucksArr;
}

Game.prototype._initialize = function () {

    var This = this;
    document.addEventListener("keydown", function () {
        This._onKeyDown.apply(This, arguments);
    });

    document.addEventListener("keyup", function () {
        This._onKeyUp.apply(This, arguments);
    });

    this._canvas.addEventListener("mousedown", function () {
        This._onMouseDown.apply(This, arguments);
    });


    this._canvas.addEventListener("contextmenu", function () {
        This._onContextMenu.apply(This, arguments);
    });

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    this._worldImage.src = "../DuckHunter/Res/background.jpg";
    this._bulitImage.src = "../DuckHunter/Res/bulit.png";
}

Game.prototype.run = function () {
    this._initialize();
    var This = this;
    this._finishTime = Date.now() + (1000 * Game.prototype.GAME_DURATION);

    window.requestAnimationFrame(function loop() {
        This._gameLoop.apply(This);
        if (This._finishTime > Date.now()) {
            window.requestAnimationFrame(loop);
        } else {
            This._render.apply(This);
        }
    });

    setTimeout(function loop() {
        This._generateDuck.apply(This);
        window.setTimeout(loop, getRandomArbitary(0, 2000));
    }, getRandomArbitary(0, 2000));
}
//============================ end Game declarations ==============================


var game = new Game();
game.run();