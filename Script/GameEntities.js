//============================ Game entities declarations ==============================
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

function Point(x, y, z) {
    this.x = x == undefined ? -1 : x;
    this.y = undefined ? -1 : y;
    this.z = undefined ? -1 : z;
};

Point.prototype = Object.create(Clonable.prototype);

function Aim() {
    this._pos = new Point(0, 0, 0);
    this._image = new Image("..\Res\aim.png");
};

Aim.prototype.setPos = function (pos) {
    this._pos = pos;
};

Aim.prototype.getPos = function () {
    return this._pos.clone();
};

Aim.prototype.render = function (context) {
    if (this._pos.x != -1 && this._pos.y != -1) {
        context.drawImage(this._image, this._pos.x, this._pos.y, 32, 32);
    }
}

//============================ end Game entitiesdeclarations ==============================
