class Node {
    constructor(id, text, x, y) {
        this._id = id;
        this._text=text;
        this._x=x;
        this._y=y;
        this._color="BLUE";
    }
    get text() {
        return this._text;
    }
    get id() {
        return this._id;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get size()
    {
        return this._size;
    }
    get color() {
        return this._color;
    }


    set x(x) {
        this._x=x;
    }
    set y(y) {
        this._y=y;
    }
    set size(size)
    {
        this._size=size;
    }
    set id(id)
    {
        this._id=id;
    }
    set text(text){
        this._text=text;
    }
    set color(color) {
        this._color=color;
    }

}
Node.prototype.toJSON = function () {
return {
    id: this.id,
    text: this.text,
    x: this.x,
    y: this.y,
    size: this.size,
    color: this.color,
    lowpt: this.lowpt,
    number: this.number,
    lowlink: this.lowlink,
    distance: this.distance,
    timeDiscovered: this.timeDiscovered,
    timeCompleted: this.timeCompleted,
    parent: this.parent
};
};