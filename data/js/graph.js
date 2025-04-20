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

function getNodeUsingId(id)
{
    for(var i = 0; i < currentCanvasGraph.nodes.length; i++)
    {
        if(currentCanvasGraph.nodes[i].id == id)
        {
            return currentCanvasGraph.nodes[i];
        }
    }
    return null;
}

function transformUndirectedToDirected()
{
    var edgesCopy = currentCanvasGraph.edges.slice();
    for(edge of edgesCopy)
    {
        //if there is no edge going the opposite direction, add it
        if(!edgeFromNodeToNode(edge.nodes[1],edge.nodes[0]))
        {
            var newEdgeNodes = [];
            newEdgeNodes.push(edge.nodes[1])
            newEdgeNodes.push(edge.nodes[0]);
            addEdgeBetweenNodes(newEdgeNodes);
        }
    }
}

function transformDirectedToUndirected()
{
    //var edgesCopy = currentCanvasGraph.edges.slice();
    for(edge of currentCanvasGraph.edges)
    {
        //if there is a multigraph, delete one of the edges
        if(edgeFromNodeToNode(edge.nodes[1],edge.nodes[0]))
        {
            var nodesOfEdgeToBeRemoved = [];
            nodesOfEdgeToBeRemoved.push(edge.nodes[1]);
            nodesOfEdgeToBeRemoved.push(edge.nodes[0]);
            removeEdgeBetweenNodes(nodesOfEdgeToBeRemoved);
        }
    }
}

function getCurrentGraphCopy()
{
    graphCopy = JSON.parse(JSON.stringify(currentCanvasGraph));
    console.log("graphCopy:");
    console.log(graphCopy);
    /*for(var node of graphCopy.nodes)
    {
        node = Object.assign(new Node,node);
    }*/
    for(var edge of graphCopy.edges)
    {
        //edge = Object.assign(new Edge,edge);

        //Since references are lost when parsing json, make it so that the nodes forming the edge reference the correct nodes.
        edge.nodes[0] = graphCopy.nodes[edge.nodes[0].id];
        edge.nodes[1] = graphCopy.nodes[edge.nodes[1].id];
    }
    return graphCopy;
}

function edgeBetweenNodes(nodeA, nodeB, edges)
{
    //edges = currentCanvasGraph.edges
    for(let i = 0; i<edges.length;i++)
    {
        if((edges[i].nodes[0].id==nodeA.id||edges[i].nodes[0].id==nodeB.id)&&(edges[i].nodes[1].id==nodeA.id||edges[i].nodes[1].id==nodeB.id))
        {
            return true
        }
        else
        {
            return false
        }
    }
    
}
function edgeBetweenNodesBothWays(nodeA, nodeB, edges)
{
    //edges = currentCanvasGraph.edges
    var counter = 0
    for(let i = 0; i<edges.length;i++)
    {
        if(edges[i].nodes[0].id != edges[i].nodes[1].id)
        {
            if((edges[i].nodes[0].id==nodeA.id||edges[i].nodes[0].id==nodeB.id)&&(edges[i].nodes[1].id==nodeA.id||edges[i].nodes[1].id==nodeB.id))
            {
                counter++;
            }
        }
        
    }
    if(counter>1)
    {
        return true
    }
    else
    {
        return false
    }
    
}
function edgeFromNodeToNode(nodeA, nodeB)
{
    var edges = currentCanvasGraph.edges;
    for(var i = 0; i<edges.length;i++)
    {
        if((edges[i].nodes[0].id==nodeA.id) &&(edges[i].nodes[1].id==nodeB.id))
        {
            return true
        }
    }
    return false
}

function getEdgeFromNodeToNode(nodeA, nodeB)
{
    for(var edge of currentCanvasGraph.edges)
    {
        if(currentCanvasGraph.directed == true)
        {
            if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id))
            {
                return edge;
            }
        }
        else
        {
            if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id)||(nodeA.id == edge.nodes[1].id)&&(nodeB.id == edge.nodes[0].id))
            {
                return edge;
            }
        }
    }
    
}

function getEdgeFromNodeToNodeUndirectedOrderMatters(nodeA, nodeB)
{
    for(var edge of currentCanvasGraph.edges)
    {

        if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id))
        {
            return edge;
        }
        if((nodeA.id == edge.nodes[1].id)&&(nodeB.id == edge.nodes[0].id))
        {

            var tmpNode = edge.nodes.slice(0,1)[0];
            edge.nodes[0] = edge.nodes[1];
            edge.nodes[1] = tmpNode;
            
            return edge;
        }
    }
    
}