//============================ Game entities declarations ==============================

//-----------------------------Clonable-------------------------
function Clonable() {
};

Clonable.prototype.clone = function () {
    if (null == this || "object" != typeof this) return this;
    var copy = this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
}

//-----------------------------Point-------------------------
function Point(x, y, z) {
    this.x = x == undefined ? -1 : x;
    this.y = y == undefined ? -1 : y;
    this.z = z == undefined ? -1 : z;
};

Point.prototype = Object.create(Clonable.prototype);

//-----------------------------Size-------------------------
function Size(cx, cy) {
    this.cx = cx == undefined ? 0 : cx;
    this.cy = cy == undefined ? 0 : cy;
};

Size.prototype = Object.create(Clonable.prototype);

//-----------------------------Entity-------------------------
function Entity() {
    this._pos = new Point();
    this._size = new Size();
};

Entity.prototype.setPos = function (pos) {
    this._pos = pos;
}

Entity.prototype.getPos = function () {
    return this._pos.clone();
}

Entity.prototype.setSize = function (size) {
    this._size = size;
}

Entity.prototype.getSize = function () {
    return this._size.clone();
}

//-----------------------------Duck-------------------------
function Duck() {
    Entity.prototype.constructor.call(this);
    
    this._step = 0;
    this._time = 0;

    if (!Duck.sprite) {
        Duck.sprite = new Image(1200, 342);
        Duck.sprite.src = '../DuckHunter/Res/duck.png';
    }
}

Duck.prototype = Object.create(Entity.prototype);

Duck.prototype.STEP_COUNT = 8;
Duck.prototype.STEP_SIZE = 10;

Duck.sprite = null;

Duck.prototype.makeStep = function () {

    if ((Date.now() - this._time) > 40)
    {
        this._step = ++this._step % Duck.prototype.STEP_COUNT;
        this._time = Date.now();
    }

    this._pos.x += Duck.prototype.STEP_SIZE;
}


Duck.prototype.render = function (context) {
    var duckWidth = Duck.sprite.width / Duck.prototype.STEP_COUNT;
    var duckHeight = Duck.sprite.height / 2;

    context.drawImage(Duck.sprite, this._step * duckWidth, duckHeight, duckWidth, duckHeight, this._pos.x, this._pos.y, this._size.cx, this._size.cy);
}


//============================ end Game entities declarations ==============================
