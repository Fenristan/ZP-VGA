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
    

    getNodeUsingId(id)
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

    transformUndirectedToDirected()
    {
        var edgesCopy = currentCanvasGraph.edges.slice();
        for(edge of edgesCopy)
        {
            //if there is no edge going the opposite direction, add it
            if(!this.edgeFromNodeToNode(edge.nodes[1],edge.nodes[0]))
            {
                var newEdgeNodes = [];
                newEdgeNodes.push(edge.nodes[1])
                newEdgeNodes.push(edge.nodes[0]);
                this.addEdgeBetweenNodes(newEdgeNodes);
            }
        }
    }

    transformDirectedToUndirected()
    {
        //var edgesCopy = currentCanvasGraph.edges.slice();
        for(edge of currentCanvasGraph.edges)
        {
            //if there is a multigraph, delete one of the edges
            if(this.edgeFromNodeToNode(edge.nodes[1],edge.nodes[0]))
            {
                var nodesOfEdgeToBeRemoved = [];
                nodesOfEdgeToBeRemoved.push(edge.nodes[1]);
                nodesOfEdgeToBeRemoved.push(edge.nodes[0]);
                this.removeEdgeBetweenNodes(nodesOfEdgeToBeRemoved);
            }
        }
    }

    getCurrentGraphCopy()
    {
        var graphParsed = JSON.parse(JSON.stringify(currentCanvasGraph));

        var newGraphCopy = new Graph();

        Object.assign(newGraphCopy,graphParsed);
        
        for(var edge of newGraphCopy.edges)
        {
            //edge = Object.assign(new Edge,edge);

            //Since references are lost when parsing json, make it so that the nodes forming the edge reference the correct nodes.
            edge.nodes[0] = newGraphCopy.nodes[edge.nodes[0].id];
            edge.nodes[1] = newGraphCopy.nodes[edge.nodes[1].id];
        }
        return newGraphCopy;
    }


    edgeBetweenNodesBothWays(nodeA, nodeB)
    {
        var edges = this.edges;
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
    edgeFromNodeToNode(nodeA, nodeB)
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

    getEdgeFromNodeToNode(nodeA, nodeB)
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

    addNode(node)
    {
        this.nodes.push(node);
        createNodeBitmap(node,containers[currentCanvasId]);
    }

    removeNode(node)
    {
        var nodes = currentCanvasGraph.nodes;

        var bitmap = containers[currentCanvasId].getChildByName("bmpNode_"+(node.id));
        var parent = bitmap.parent;

        this.removeAllEdgesFromNode(nodes[bitmap.id]);

        //remove this node, it's bitmap and all other elements tied to this node
        nodes.splice(bitmap.id,1);

        removeNodeBitmap(bitmap);
        
        //shift the ids of all nodes that come after the one that was deleted.
        for(var i = nodes.length-1; i >= bitmap.id ; i--)
        {
            var selectedBitmap = parent.getChildByName("bmpNode_"+(nodes[i].id));
            selectedBitmap.id -= 1;
            selectedBitmap.name = "bmpNode_"+(selectedBitmap.id);
            //parent.addChild(selectedBitmap);

            var textName = parent.getChildByName("nodeNameText_"+nodes[i].id);
            textName.name = "nodeNameText_"+(selectedBitmap.id);
            //parent.addChild(textName);

            var htmlTextName = document.getElementById("nodeNameText_"+currentCanvasId+"_"+nodes[i].id);
            htmlTextName.id = "nodeNameText_"+currentCanvasId+"_"+(selectedBitmap.id);

            var textInformationQuadrantI =  parent.getChildByName("nodeInformationQuadrantIText_"+nodes[i].id);
            textInformationQuadrantI.name = "nodeInformationQuadrantIText_"+(selectedBitmap.id);
            //parent.addChild(textInformationQuadrantI);

            nodes[i].id-=1;
        }

        drawEdges();
        
    }

    removeAllEdgesFromNode(node)
    {
        var edges = this.edges;
        var edgesToBeRemoved = []

        for(let i = edges.length-1; i>=0; i--)
        {
            if((edges[i].nodes[0].id==node.id||edges[i].nodes[1].id==node.id))
            {
                edgesToBeRemoved.push(edges[i]);
            }
        }

        for(let i = 0; i<edgesToBeRemoved.length; i++)
        {
            this.removeEdgeBetweenNodes(edgesToBeRemoved[i].nodes);
        }

        drawEdges();
    }

    addEdgeBetweenNodes(nodes)
    {
        var edges = currentCanvasGraph.edges;
        if(this.edgeFromNodeToNode(nodes[0],nodes[1]))
        {
            console.log("There already is an edge between these nodes");
        }
        else if(currentCanvasGraph.directed == false && this.edgeFromNodeToNode(nodes[1],nodes[0]))
        {
            console.log("Undirected graph - There is already an edge between these nodes");
        }
        else
        {
            var edge = new Edge(edges.length,nodes,1);
            edges.push(edge);

            createEdgeVisualisationElements(edge);
        }
        
    }

    removeEdgeBetweenNodes(nodes)
    {
        var edges = currentCanvasGraph.edges;
        //let oldEdges = edges.slice(0);
        //var edge = new Edge(edges.length,nodes);
        for(let i = 0; i<edges.length; i++)
        {
            var deleteThisEdge = false;
            if(currentCanvasGraph.directed == true)
            {
                deleteThisEdge = (edges[i].nodes[0].id==nodes[0].id) && (edges[i].nodes[1].id==nodes[1].id);
            }
            else
            {
                deleteThisEdge = (nodes[0].id == edges[i].nodes[0].id)&&(nodes[1].id == edges[i].nodes[1].id)||(nodes[0].id == edges[i].nodes[1].id)&&(nodes[1].id == edges[i].nodes[0].id);
            }
            //if((edges[i].nodes[0]==nodes[0]||edges[i].nodes[0]==nodes[1])&&(edges[i].nodes[1]==nodes[0]||edges[i].nodes[1]==nodes[1])) //check if edge exists
            if(deleteThisEdge)
            {
                // if there is already an edge in the opposite direction, a multigraph, we have to make sure, so that it updates when we draw edges so that it can be drawn as a regular edge, isntead of a curve
                var edgeOppositeDirection = this.getEdgeFromNodeToNode(edges[i].nodes[1],edges[i].nodes[0])
                if(edgeOppositeDirection != null)
                {
                    edgeOppositeDirection.changed = true;
                }

                removeEdgeVisualisationElements(edges[i])


                for(let j = edges[i].id+1; j < edges.length; j++)
                {
                    
                    let edgeWeight = containers[currentCanvasId].getChildByName("edgeWeight_"+j);
                    //edgeWeight.id = edgeWeight.id-1;
                    let index = j-1
                    edgeWeight.name = "edgeWeight_" + index;
                    containers[currentCanvasId].addChild(edgeWeight);
                    
                    let text = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+j);
                    let indexNext = j-1


                    text.id = "edgeWeightText_"+currentCanvasId+"_"+indexNext;

                    let line = containers[currentCanvasId].getChildByName("line_"+j);
                    line.name = "line_"+(indexNext);

                }

                for(let j = edges[i].id; j < edges.length-1; j++)
                {
                    edges[j]=edges[j+1];
                    edges[j].id=(edges[j].id)-1;

                }
                
                var poppedEdge = edges.pop();

            }
        }
        drawEdges();
    }

    //In an undirected graph the same edge can be defined as (a,b) or (b,a). This function is for use in algorithms where the order of the two nodes making up an edge matters.
    getEdgeFromNodeToNodeUndirectedOrderMatters(nodeA, nodeB)
    {
        for(var edge of currentCanvasGraph.edges)
        {
            //if edge is (a,b), return edge
            if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id))
            {
                return edge;
            }
            //if the edge is (b,a) instead, swap the order of the two nodes and return edge
            if((nodeA.id == edge.nodes[1].id)&&(nodeB.id == edge.nodes[0].id))
            {

                var tmpNode = edge.nodes.slice(0,1)[0];
                edge.nodes[0] = edge.nodes[1];
                edge.nodes[1] = tmpNode;
                
                return edge;
            }
        }
        
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

