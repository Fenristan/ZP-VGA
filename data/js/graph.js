class Graph {
    constructor(id) {
        this._id = id;
        this._nodes=[];
        this._edges=[];
        this._startingNode=null;
        this._stepCounter=0;
        this._selectedNodes=[];
        this._algorithm = null;
        this._directed = true;
        this._weighted = false;
    }

    get id() {
        return this._id;
    }
    get nodes() {
        return this._nodes;
    }
    get edges() {
        return this._edges;
    }
    get startingNode() {
        return this._startingNode;
    }
    get stepCounter() {
        return this._stepCounter;
    }
    get selectedNodes()
    {
        return this._selectedNodes;
    }
    get algorithm()
    {
        return this._algorithm;
    }
    get directed()
    {
        return this._directed;
    }
    get weighted()
    {
        return this._weighted;
    }

    set id(id) {
        this._id=id;
    }
    set nodes(nodes) {
        this._nodes=nodes;
    }
    set edges(edges) {
        this._edges=edges;
    }
    set startingNode(startingNode)
    {
        this._startingNode=startingNode;
    }
    set stepCounter(stepCounter)
    {
        this._stepCounter=stepCounter;
    }
    set selectedNodes(selectedNodes){
        this._selectedNodes=selectedNodes;
    }
    set algorithm(algorithm){
        this._algorithm=algorithm;
    }
    set directed(directed){
        this._directed=directed;
    }
    set weighted(weighted){
        this._weighted=weighted;
    }
    

}
Graph.prototype.toJSON = function () {
return {
    id: this.id,
    nodes: this.nodes,
    edges: this.edges,
    startingNode: this.startingNode,
    stepCounter: this.stepCounter,
    selectedNodes: this.selectedNodes,
    directed: this.directed,
    weighted: this.weighted,
    stack: this.stack,
    SCC: this.SCC,
    components: this.components,
    queue: this.queue
};
};