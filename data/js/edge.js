class Edge{
    constructor(id, nodes, weight) {
        this._id = id;
        this._nodes=nodes;
        this._weight=weight;
        this._color="black";
        this._label="";
        this._changed=true;
    }
    get id() {
        return this._id;
    }
    get nodes() {
        return this._nodes;
    }
    get weight() {
        return this._weight;
    }
    get color() {
        return this._color;
    }
    get label() {
        return this._label;
    }
    get changed() {
        return this._changed;
    }


    set nodes(value) {
        this._nodes = value;
    }

    set id(id)
    {
        this._id=id;
    }
    set weight(weight)
    {
        this._weight=weight;
    }
    set color(color) {
        this._color=color;
    }
    set label(label) {
        this._label=label;
    }
    set changed(changed) {
        this._changed=changed;
    }
}
Edge.prototype.toJSON = function () {
return {
    id: this.id,
    nodes: this.nodes,
    weight: this.weight,
    color: this.color,
    label: this.label,
    changed: this.changed
};
};
