//============================ Game declarations ==============================
function Game() {
    this._canvas = document.getElementById("myCanvas");
    this._canvasCtx = this._canvas.getContext("2d");

    this._pos = {
        x: 0,
        y: 0
    };

    this._aim = new Aim();
    this._keyStates = {};
}

Game.prototype._render = function () {

    this._canvasCtx.fillStyle = "#00FF00";
    this._canvasCtx.fillRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);

    this._canvasCtx.fillStyle = "#000000";
    this._canvasCtx.fillRect(this._pos.x, this._pos.y, 40, 40);

    this._aim.render(this._canvasCtx);
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

Game.prototype._onMouseMove = function () {
    this._aim.setPos(new Point(event.clientX - this._canvas.offsetLeft, event.clientY - this._canvas.offsetTop, -1));
}

Game.prototype._onMouseOut = function () {

    this._aim.setPos(new Point());
}

Game.prototype._gameLoop = function () {

    this._pos.x -= this._keyStates[37] ? 5 : 0;
    this._pos.y -= this._keyStates[38] ? 5 : 0;
    this._pos.x += this._keyStates[39] ? 5 : 0;
    this._pos.y += this._keyStates[40] ? 5 : 0;

    this._render();
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
}

Game.prototype.run = function () {
    this._initialize();
    var This = this;
    setTimeout(function loop() {
        This._gameLoop.apply(This);
        setTimeout(loop, 25);
    }, 25);
}
//============================ end Game declarations ==============================


var game = new Game();
game.run();