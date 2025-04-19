
class Breadth_First_Search extends Algorithm
{
    constructor()
    {
        super();
    }

    drawStep()
    {
        for(var u of currentCanvasGraph.nodes)
        {
            updateNodeBitmapColor(u);
    
            updateNodeInformationQuadrantIForBFS(u);
        }
        for(var edge of currentCanvasGraph.edges)
        {
            edge.changed = true;
        }
    
        /*currentCanvasGraph.startingNode.color = "RED";
        currentCanvasGraph.startingNode.distance = 0;*/
    
        drawEdges();
        drawTreeBFS();
    }
    
    
    resetGraph()
    {
        currentCanvasGraph = this.originalGraph;
        
        this.graphStepsHistory = [];
    
        clearBFSGrid();
    
        resetGraph();
    
    }
    
    async startAlgorithm()
    {
        this.originalGraph = currentCanvasGraph;

        currentCanvasGraph = getCurrentGraphCopy();
    
        toggleNodeInformationQuadrantIVisibility();
        showCurrentVisNetwork();
    
        currentCanvasGraph.queue = [];
        currentCanvasGraph.startingNode=currentCanvasGraph.nodes[currentCanvasGraph.startingNode.id]
    
        canvasFlags[currentCanvasId].runningFlag = true;
    
        this.BFS();
    
        
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
                resetDFS();
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
        
    
    }
    
    //WHITE == BLUE, GRAY == PURPLE, BLACK == GREEN
    BFS(){
    
        var nodes = currentCanvasGraph.nodes.slice();
        
        var numberOfNodes = nodes.length;
        var adjacencyList = [];
        if(currentCanvasGraph.directed == false)
        {
            adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
        }
        else
        {
            adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
        }
        
        for(var u of nodes)
        {
            u.color = "BLUE";
            u.distance = "∞";
            u.parent = null;
            //updateNodeInformationQuadrantIForBFS(u);
        }
        for (var e of currentCanvasGraph.edges) {
            e.color = "black";
        }
    
        currentCanvasGraph.startingNode.color = "PURPLE";
        currentCanvasGraph.startingNode.distance = 0;
        
    
        //updateNodeInformationQuadrantIForBFS(currentCanvasGraph.startingNode)
    
    
        currentCanvasGraph.queue.push(currentCanvasGraph.startingNode);
    
        while (currentCanvasGraph.queue.length > 0) {
            
            var u = currentCanvasGraph.queue.shift();
    
            u.color = "RED";
    
            this.saveStepToHistory(currentCanvasGraph.stepCounter);
            
    
            for (var vId of adjacencyList[u.id]) {
                var v =  getNodeUsingId(vId);
    
                if (v.color == "BLUE") {
                    u.color = "RED";
                    v.color = "PURPLE";
    
                    v.distance = u.distance + 1;
    
                    v.parent = u;
                    currentCanvasGraph.queue.push(v);
    
                    var edge = getEdgeFromNodeToNode(u,v);
                    edge.color = "red";
    
    
                    this.saveStepToHistory(currentCanvasGraph.stepCounter);
                    
    
                    u.color = "PURPLE";
                    edge.color = "purple";
                    
                    
                }
            }
            u.color = "GREEN";
            
            this.saveStepToHistory(currentCanvasGraph.stepCounter);
            
        }
        
        
    
    }
}

