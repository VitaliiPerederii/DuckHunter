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
//============================ end Game entitiesdeclarations ==============================
