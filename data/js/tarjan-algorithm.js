
class Tarjan extends Algorithm
{
    constructor()
    {
        super();
        this.time = 0;
        this.nodes = [];
        this.adjacencyList = [];
    }

    drawStep()
    {
        for(var u of currentCanvasGraph.nodes)
        {
            if(u.isRoot == true)
            {
                if(u.color != "RED")
                {
                    u.color = "ORANGE";
                }
            }

            updateNodeBitmapColor(u);
    
            updateNodeInformationQuadrantIForDFS_Tarjan(u);
        }
        for(var edge of currentCanvasGraph.edges)
        {
            edge.changed = true;
        }
        drawEdges();
        renderTarjanGrid();
        drawTreeDFS_Tarjan();
    }
    
    
    resetGraph()
    {
        currentCanvasGraph = this.originalGraph;
        
        this.graphStepsHistory = [];
    
        clearTarjanGrid();
    
        resetGraph();
    }
    
    // WHITE = BLUE, GREY = PURPLE, BLACK = GREEN and RED is the one where I currently am
    DFS_Tarjan_visit(u)
    {
    
        u.color = "RED";
        this.time += 1;
        u.timeDiscovered = this.time;
        u.lowlink = this.time;
        u.inComponent = false;
        currentCanvasGraph.stack.push(u);
    
        this.saveStepToHistory(currentCanvasGraph.stepCounter);
        
                
        for (var vId of this.adjacencyList[u.id]) {
            var v = currentCanvasGraph.nodes[vId];
    
            /*this.saveStepToHistory(currentCanvasGraph.stepCounter);
            */
            
            if(v.color=="BLUE")
            {
    
                //highlight edge between these nodes red
                var edge = currentCanvasGraph.getEdgeFromNodeToNode(u, v);
                edge.color = "red";
    
    
                u.color = "RED";
                //highlight the newly visited node as visited
                v.color = "PURPLE";
                v.parent = u;
    
                //v.timeDiscovered = this.time+1;
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
                
                //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
                u.color = "PURPLE";
                edge.color = "purple";
                this.DFS_Tarjan_visit(v);
    
            }
            else 
            {
    
                var edge = currentCanvasGraph.getEdgeFromNodeToNode(u, v);
                edge.color = "red";
    
                setTypeForEdgeBetweenNodes(u,v);
    
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
                edge.color = "black";
                
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
    
            }
    
            if(v.inComponent == false)
            {
                var edge = currentCanvasGraph.getEdgeFromNodeToNode(u, v);
                edge.previousColor = edge.color;
                edge.color = "red";

                u.lowlink = Math.min(u.lowlink,v.lowlink);

                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
                edge.color = edge.previousColor;
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
            }
    
        }
    
        if(u.lowlink == u.timeDiscovered)
        {
            //u.color = "ORANGE";
            u.isRoot = true;
            var C = [];
            do
            {
                var v = currentCanvasGraph.stack.pop(); 
                v.inComponent = true;
                C.push(v); 
            }while(v != u);
    
            currentCanvasGraph.SCC.push(C);

        }
    
        
        u.color = "GREEN";

    
        this.time += 1;
        u.timeCompleted = this.time;
        //updateNodeInformationQuadrantIForNodeInCanvas(u);
    
        this.saveStepToHistory(currentCanvasGraph.stepCounter);
        
    
        
        
    }
    
    DFS_Tarjan(){
    
        this.nodes = currentCanvasGraph.nodes.slice();
    
        var splicedNode = this.nodes.splice(currentCanvasGraph.startingNode.id,1);
        this.nodes.unshift(splicedNode[0]);
    
        var numberOfNodes = this.nodes.length;
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
    
        for (var u of this.nodes) {
            u.color = "BLUE";
            u.parent = null;
            u.timeDiscovered=null;
            u.timeCompleted=null;
            u.inComponent=false;
            u.lowlink=null;
            u.isRoot=false;
        }
    
        for (var e of currentCanvasGraph.edges) {
            e.color = "black";
        }
    
        this.time = 0;
        currentCanvasGraph.stack = [];
        currentCanvasGraph.SCC = [];
    
        for (var u of this.nodes) {
            if(u.color == "BLUE")
            {
                this.DFS_Tarjan_visit(u);
            }
        }
    
    
    };
    
    async startAlgorithm(){
    
        this.originalGraph = currentCanvasGraph;

        currentCanvasGraph = currentCanvasGraph.getCurrentGraphCopy();
    
        toggleNodeInformationQuadrantIVisibility();
        showCurrentVisNetwork();
    
        this.DFS_Tarjan();
    
        canvasFlags[currentCanvasId].runningFlag = true;
        
        var step = 0;
        var lastStep = this.graphStepsHistory.length;
    
        while(canvasFlags[currentCanvasId].stopFlag != true)
        {
    
            currentCanvasGraph = this.graphStepsHistory[step];
    
            this.drawStep();
    
            await Promise.race([createClickListenerPromise(CurrentRestartButton), createClickListenerPromise(CurrentStepBackwardsButton), createClickListenerPromise(CurrentStepForwardButton)]);
    
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
}

