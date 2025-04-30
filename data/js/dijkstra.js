
class Dijkstra extends Algorithm
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
    
            updateNodeInformationQuadrantIForDijkstra(u);
        }
        for(var edge of currentCanvasGraph.edges)
        {
            edge.changed = true;
        }
    
        drawEdges();
        drawTreeDijkstra();
    }
    
    
    async startAlgorithm()
    {
        this.originalGraph = currentCanvasGraph;

        currentCanvasGraph = currentCanvasGraph.getCurrentGraphCopy();
    
        toggleNodeInformationQuadrantIVisibility();
        showCurrentVisNetwork();
    
        currentCanvasGraph.queue = [];
        currentCanvasGraph.set = [];
        currentCanvasGraph.startingNode=currentCanvasGraph.nodes[currentCanvasGraph.startingNode.id];
    
        canvasFlags[currentCanvasId].runningFlag = true;
    
        this.dijkstra();
    
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
    
    extractMin()
    {
        var min = Number.MAX_VALUE;
        var minNode = null;
    
        for(var node of currentCanvasGraph.queue)
        {
            if(node.distance != "∞")
            {    
                if(node.distance < min)
                {
                    min = node.distance;
                    minNode = node;
                }
            }
        }
    
        if(minNode != null)
        {
            const findIndex = currentCanvasGraph.queue.findIndex(node => node.id === minNode.id);
            findIndex !== -1 && currentCanvasGraph.queue.splice(findIndex , 1);
        }
    
        return minNode;
    }
    
    dijkstra()
    {
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
        }
        for (var e of currentCanvasGraph.edges) {
            e.color = "black";
        }
        
        currentCanvasGraph.startingNode.distance = 0;
    
        currentCanvasGraph.queue = nodes;
    
        while (currentCanvasGraph.queue.length > 0) {
            var u = this.extractMin();
            if(u == null)
            {
                break;
            }
            if(u.parent != null)
            {
                var edge = currentCanvasGraph.getEdgeFromNodeToNode(u.parent,u);
                edge.color = "purple";
            }
    
            currentCanvasGraph.set.push(u);
    
            u.color = "RED";
            this.saveStepToHistory(currentCanvasGraph.stepCounter);
            
    
            for (var vId of adjacencyList[u.id]) {
                var v =  currentCanvasGraph.getNodeUsingId(vId);
                var edge = currentCanvasGraph.getEdgeFromNodeToNode(u,v)
                edge.previousColor = edge.color;
                edge.color = "red";

                var alt = u.distance + edge.weight;

                if(alt < v.distance || v.distance == "∞")
                {
                    v.distance = alt;
                    v.parent = u;
                }
                this.saveStepToHistory(currentCanvasGraph.stepCounter);
                
                edge.color = edge.previousColor;
            }
            
            u.color = "GREEN";
            this.saveStepToHistory(currentCanvasGraph.stepCounter);
            
        }
    
    }
}

