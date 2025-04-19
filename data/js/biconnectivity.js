
class Biconnectivity extends Algorithm
{
    constructor()
    {
        super();
        this.time = 0;
        this.i = 0;
        this.adjacencyList = [];
    }

    drawStep()
    {
        for(var u of currentCanvasGraph.nodes)
        {
            if(u.articulation == true)
            {
                if(u.color != "RED")
                {
                    u.color = "ORANGE";
                }
            }
    
            updateNodeBitmapColor(u);
    
            updateNodeInformationQuadrantIForBiconnectivity(u);
        }
        
        for(var edge of currentCanvasGraph.edges)
        {
            edge.changed = true;
        }
    
        drawEdges();
        //renderBiconnectivityGrid();
        drawTreeBiconnectivity();
    }
    
    resetGraph()
    {
        currentCanvasGraph = this.originalGraph;
    
        this.graphStepsHistory = [];
    
        clearBiconnectivityGrid();
    
        resetGraph();
    
    }
    
    setTypeForEdgeBetweenNodesBiconnectivity(nodeA, nodeB)
    {
        var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(nodeA,nodeB);
        if(nodeA.number < nodeB.number)
        {
            if(isInTheSameTree(nodeB,nodeA))
            {
                edge.label = "F";
            }
            else
            {
                edge.label = "C";
            }
            
        }
        else if(nodeA.number > nodeB.number)
        {
            if(isInTheSameTree(nodeA,nodeB))
            {
                edge.label = "B";
            }
            else
            {
                edge.label = "C";
            }
            
        }
    }
    
    Biconnect(v,u){
    
        v.color = "RED";
        this.i += 1;
        v.number = this.i;
        v.lowpt = v.number;
    
        this.saveStepToHistory(currentCanvasGraph.stepCounter);
        
    
        
    
        for (var wId of this.adjacencyList[v.id]) {
            var w = currentCanvasGraph.nodes[wId];
    
            var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
            edge.color = "red";
            v.color = "RED";
    
            if(w.number == null)
            {
                edge.color = "red";
                v.color = "RED";
                w.color = "PURPLE";
                w.parent = v;
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
                v.color = "PURPLE";  
                edge.color = "purple";
    
                currentCanvasGraph.edgeStack.push(edge);
                
                this.Biconnect(w,v);
                v.lowpt = Math.min(v.lowpt,w.lowpt);
    
                if(w.lowpt >= v.number)
                {
                    v.articulation = true;
                    //v.color = "ORANGE";
                    var C = [];
                    if(currentCanvasGraph.edgeStack.length != 0)
                    {
                        while(currentCanvasGraph.edgeStack[(currentCanvasGraph.edgeStack.length-1)].nodes[0].number >= w.number)
                        {
                            var topEdge = currentCanvasGraph.edgeStack.pop();
                            C.push(topEdge);
        
                            if(currentCanvasGraph.edgeStack.length == 0)
                            {
                                break;
                            }
        
                        }
                    }
    
                    C.push(edge);
                    currentCanvasGraph.components.push(C);
                    //find (v,w) in the edge stack and delete it
                    if(currentCanvasGraph.edgeStack.length != 0)
                    {
                        var vWIndex = currentCanvasGraph.edgeStack.findIndex(edgeVW => edgeVW.id === edge.id);
                        
                        currentCanvasGraph.edgeStack.splice(vWIndex,1)[0];
    
                    }
    
                    //this.saveStepToHistory(currentCanvasGraph.stepCounter);
                    //
                    
    
                }
                if(w.lowpt > v.number)
                {
                    edge.color = "red";
                    v.previousColor = v.color;
                    v.color = "RED";
    
                    this.saveStepToHistory(currentCanvasGraph.stepCounter);
                    
    
                    edge.color = "orange";
                    v.color = v.previousColor;
    
                    //this.saveStepToHistory(currentCanvasGraph.stepCounter);
                    //
                }
    
                if(w.lowpt < v.number)
                {
                    edge.previousColor = edge.color;
                    edge.color = "red";
                    v.previousColor = v.color;
                    v.color = "RED";
    
                    this.saveStepToHistory(currentCanvasGraph.stepCounter);
                    
    
                    edge.color = edge.previousColor
                    v.color = v.previousColor;
    
                }
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
                
            }
            //else if((w.number < v.number) && w!=u)
            else if((w.number < v.number) && w.id!=u.id)
            {
                var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
                currentCanvasGraph.edgeStack.push(edge);
                v.lowpt = Math.min(v.lowpt,w.number);
    
                this.setTypeForEdgeBetweenNodesBiconnectivity(v,w);
    
                edge.color = "red";
    
                //setTypeForEdgeBetweenNodes(currentCanvasGraph.nodes[u.id],currentCanvasGraph.nodes[getNodeUsingId(v).id]);
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
    
                edge.color = "black";
                
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
            }
            else
            {
                edge.color = "red";
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
                if(u.id == edge.nodes[1].id)
                {
                    edge.color = "purple";
                }
                else
                {
                    edge.color = "black";
                }
    
                //edge.color = "purple";
                
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
            }
            /*else
            {
                var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
                edge.color = "red";
    
                //setTypeForEdgeBetweenNodes(currentCanvasGraph.nodes[u.id],currentCanvasGraph.nodes[getNodeUsingId(v).id]);
    
                saveDFSStepToHistory(currentCanvasGraph.stepCounter);
    
                
                if(u.id == edge.nodes[1].id)
                {
                    edge.color = "purple";
                }
                else
                {
                    edge.color = "black";
                }
    
                saveDFSStepToHistory(currentCanvasGraph.stepCounter);
                
            }*/
    
            //this.saveStepToHistory(currentCanvasGraph.stepCounter);
            //
            if(v.articulation && v.color == "RED")
            {
                v.color = "ORANGE";
            }
        }
    
        if(v.articulation == false)
        {
            v.color = "GREEN";
    
            this.saveStepToHistory(currentCanvasGraph.stepCounter);
            
        }
        
        
        
    }
    
    Biconnectivity(){
    
        var nodes = currentCanvasGraph.nodes.slice();
    
    
        var splicedNode = nodes.splice(currentCanvasGraph.startingNode.id,1);
        nodes.unshift(splicedNode[0]);
    
        var numberOfNodes = nodes.length;
        
        if(currentCanvasGraph.directed == false)
        {
            this.adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
        }
        else
        {
            this.adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
        }
    
    
        for (var u of nodes) {
            u.number = null;
            u.lowpt = null;
            u.parent = null;
            u.articulation = false;
        }
    
        for (var e of currentCanvasGraph.edges) {
            e.color = "black";
        }
    
        //currentCanvasGraph.edgeStack = [];
        
        //Biconnect();
    
        this.i = 0;
        currentCanvasGraph.edgeStack = [];
        currentCanvasGraph.components = [];
    
        for(var w of nodes)
        {
            if(w.number == null)
            {
                this.Biconnect(w,0);
            }
        }
    
        this.saveStepToHistory(currentCanvasGraph.stepCounter);
        
    
    
    };
    
    async startAlgorithm(){
    
        //this.originalGraph = getCurrentGraphCopy();
        //this.originalGraph = currentCanvasGraph;
        this.originalGraph = currentCanvasGraph;

        currentCanvasGraph = getCurrentGraphCopy();
    
        toggleNodeInformationQuadrantIVisibility();
        showCurrentVisNetwork();
    
        this.Biconnectivity();
    
        canvasFlags[currentCanvasId].runningFlag = true;
        
        var step = 0;
        var lastStep = this.graphStepsHistory.length;
    
        while(canvasFlags[currentCanvasId].stopFlag != true)
        {
    
            currentCanvasGraph = this.graphStepsHistory[step];
    
            this.drawStep();
    
            await Promise.race([createClickListenerPromise(CurrentRestartButton), /*createClickListenerPromise(LoadButton),*/ createClickListenerPromise(CurrentStepBackwardsButton), createClickListenerPromise(CurrentStepForwardButton)]);
    
            if(canvasFlags[currentCanvasId].stepBackwardsFlag == true)
            {
                if(step != 0)
                {
                    step--;
                }
                canvasFlags[currentCanvasId].stepBackwardsFlag = false;
            }
            else if(canvasFlags[currentCanvasId].restartFlag == true)
            {
                step = 0;
                canvasFlags[currentCanvasId].restartFlag = false;
            }
            /*else if(canvasFlags[currentCanvasId].stopFlag == true)
            {
                resetGraph();
                canvasFlags[currentCanvasId].stopFlag = false;
                return 0;
            }*/
            else
            {
                if(step < lastStep-1)
                {
                    step++;
                }
            }
        }
        this.resetGraph();
        
        //drawEdges(currentCanvasGraph.edges);
        //drawTreeBiconnectivity();
    
    
    
    
    
    }
}

