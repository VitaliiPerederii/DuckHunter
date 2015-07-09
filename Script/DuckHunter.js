//============================ Game declarations ==============================
function Game() {
    this._canvas = document.getElementById("myCanvas");
    this._canvasCtx = this._canvas.getContext("2d");

    this._worldScrollPos = new Point(0, 0);
    this._worldImage = new Image(4000, 1384);

    this._duck = new Duck();
    this._duck.setPos(new Point(0, 0));
    this._duck.setSize(new Size(150, 171));

    this._keyStates = {};
}

Game.prototype.WORLD_SCROLL_STEP = 20;

Game.prototype._render = function () {

    this._canvasCtx.drawImage(this._worldImage, this._worldScrollPos.x, this._worldScrollPos.y, this._canvas.clientWidth, this._canvas.clientHeight,
                                                                        0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

    this._canvasCtx.save();
    this._canvasCtx.translate(-this._worldScrollPos.x, -this._worldScrollPos.y);
    this._duck.render(this._canvasCtx);
    this._canvasCtx.restore();
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

Game.prototype._onBlur = function () {
    for (var key = 37; key <= 40; key++) {
        this._keyStates[key] = false;
    }
}

Game.prototype._onMouseMove = function () {
    
}

Game.prototype._onMouseOut = function () {

  
}

Game.prototype._gameLoop = function () {

    this._updateEntitiesStates();

    this._render();
}


Game.prototype._updateEntitiesStates = function () {

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
    
    
    this._duck.makeStep();
}

Game.prototype._initialize = function () {

    var This = this;
    document.addEventListener("keydown", function () {
        This._onKeyDown.apply(This, arguments);
    });

    document.addEventListener("keyup", function () {
        This._onKeyUp.apply(This, arguments);
    });

    this._canvas.addEventListener("mouseout", function () {
        This._onMouseOut.apply(This, arguments);
    });

    this._canvas.addEventListener("mousemove", function () {
        This._onMouseMove.apply(This, arguments);
    });

    document.body.addEventListener("onblur", function () {
        This._onBlur.apply(This, arguments);
    });

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    this._worldImage.src = "../DuckHunter/Res/background.jpg";
}

Game.prototype.run = function () {
    this._initialize();
    var This = this;
    window.requestAnimationFrame(function loop() {
        This._gameLoop.apply(This);
        window.requestAnimationFrame(loop);
    });
}
//============================ end Game declarations ==============================


var game = new Game();
game.run();