



class Depth_First_Search extends Algorithm
{
    constructor()
    {
        super();
        this.time = 0;
        this.adjacencyList = [];
    }

    drawStep()
    {
        for(var u of currentCanvasGraph.nodes)
        {
            updateNodeBitmapColor(u);
    
            updateNodeInformationQuadrantIForDFS(u);
        }
        for(var edge of currentCanvasGraph.edges)
        {
            edge.changed = true;
        }
        drawEdges();
        drawTreeDFS();
    }
    
    resetGraph()
    {
        currentCanvasGraph = this.originalGraph;
    
        this.graphStepsHistory = [];
        
        clearDFSGrid();
    
        resetGraph();
        
    }
    
    // WHITE = BLUE, GREY = PURPLE, BLACK = GREEN and RED is the one where I currently am
    DFS_visit(u)
    {
    
        u.color = "RED";
        this.time += 1;
        u.timeDiscovered = this.time;
    
        this.saveStepToHistory(currentCanvasGraph.stepCounter);
        
                
        for (var vId of this.adjacencyList[u.id]) {
            var v = currentCanvasGraph.nodes[vId];
            //every this.time we go from this node to another, highlight it as the currently selected Node
            u.color = "RED";
    
            /*saveStepToHistory(currentCanvasGraph.stepCounter);
            */
    
            //highlight edge between these nodes red
            var edge = currentCanvasGraph.getEdgeFromNodeToNode(u, v);
            edge.previousColor = edge.color;
            edge.color = "red";
            
            if(v.color=="BLUE")
            {
    
                //u.color = "RED";
                //highlight the newly visited node as visited
                v.color = "PURPLE";
                v.parent = u;
    
                v.timeDiscovered = this.time+1;
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
                
                //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
                u.color = "PURPLE";
                edge.color = "purple";
                this.DFS_visit(v);
    
            }
            else 
            {
    
                if(u.parent != null)
                {
                    if(v.id != u.parent.id)
                    {
                        setTypeForEdgeBetweenNodes(u,v);
                    }
                }
                else
                {
                    setTypeForEdgeBetweenNodes(u,v); 
                }
                
                
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
                //edge.color = "purple";
    
                //currentCanvasGraph.visitedEdges.pop();
    
                //if this is an undirected graph, then should check if the edge leads to the parent node, if it does, make it purple again, if not, then make it black. If it isn't undirected, simply make the edge black.
                /*if(currentCanvasGraph.directed == false)
                {
                    if(u.parent != null)
                    {
                        if(u.parent.id == edge.nodes[1].id || u.parent.id == edge.nodes[0].id)
                        {
                            edge.color = "purple";
                        }
                        else
                        {
                            edge.color = "black";
                        }
                    }
                    else
                    {
                        edge.color = "black";
                    }
                }
                else
                {
                    edge.color = "black";
                }*/
                edge.color = edge.previousColor ;
                
                
                
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
            }
            /*
            await thisWaitUntilForwardClicked;
            thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
            */
        }
    
        
        u.color = "GREEN";
        /*containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=greenNodeImage;
        update=true;
        drawTreeDFS();*/
    
        this.time += 1;
        u.timeCompleted = this.time;
        //updateNodeInformationQuadrantIForNodeInCanvas(u);
    
        this.saveStepToHistory(currentCanvasGraph.stepCounter);
        
    
        
        
    }
    
    DFS(){
        //currentCanvasGraph.stepCounter = 0;
    
        //canvasFlags[currentCanvasId].runningFlag = true;
    
        var nodes = currentCanvasGraph.nodes.slice();
    
        //nodes = currentCanvasGraph.nodes;
    
        var splicedNode = nodes.splice(currentCanvasGraph.startingNode.id,1);
        nodes.unshift(splicedNode[0]);
    
        var numberOfNodes = nodes.length;
        this.adjacencyList = [];
        if(currentCanvasGraph.directed == false)
        {
            this.adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
        }
        else
        {
            this.adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
        }
        
        //var path = [];
    
        for (var u of nodes) {
            u.color = "BLUE";
            u.parent = null;
            //u.distance = null;
            u.timeDiscovered=null;
            u.timeCompleted=null;
        }
    
        for (var e of currentCanvasGraph.edges) {
            e.color = "black";
        }
    
        //currentCanvasGraph.startingNode.distance = 0;
        //updateNodeInformationQuadrantIForNodeInCanvas(currentCanvasGraph.startingNode);
    
        this.time = 0;
    
        for (var u of nodes) {
            if(u.color == "BLUE")
            {
                this.DFS_visit(u);
            }
        }
    
    
    };
    
    async startAlgorithm(){
    
        this.originalGraph = currentCanvasGraph;

        currentCanvasGraph = currentCanvasGraph.getCurrentGraphCopy();
        //this.originalGraph = currentCanvasGraph;
    
        toggleNodeInformationQuadrantIVisibility();
        showCurrentVisNetwork();
    
        this.DFS();
    
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
        
        //drawEdges();
        //drawTreeDFS();
    }
}

function setTypeForEdgeBetweenNodes(nodeA, nodeB)
{
    var edge = currentCanvasGraph.getEdgeFromNodeToNode(nodeA,nodeB);
    if(nodeA.timeDiscovered < nodeB.timeDiscovered)
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
    else if(nodeA.timeDiscovered > nodeB.timeDiscovered)
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