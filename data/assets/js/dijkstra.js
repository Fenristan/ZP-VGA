var dijkstraGraphHistory = [];

var originalDijkstraGraph = null;

function drawDijkstra()
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

function saveDijkstraStepToHistory()
{

    var canvasGraphCopy = getCurrentGraphCopy();

    for(var node of canvasGraphCopy.nodes)
    {
        node.distance = currentCanvasGraph.nodes[node.id].distance;
    }

    dijkstraGraphHistory.push(canvasGraphCopy);
}

function resetDijkstra()
{
    currentCanvasGraph = originalDijkstraGraph;

    /*currentCanvasGraph.queue = [];
    for(var node of currentCanvasGraph.nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    for(var edge of currentCanvasGraph.edges)
    {
        edge.color = "black";
    }*/

    for(var u of currentCanvasGraph.nodes)
    {
        updateNodeBitmapColor(u);
    }  
    for(var edge of currentCanvasGraph.edges)
    {
        edge.changed = true;
    }

    drawEdges();
    destroyCurrentVisNetwork();
    clearDijkstraGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();


    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].runningFlag = false;

    dijkstraGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=redNodeImage;
}

async function startDijkstra()
{
    originalDijkstraGraph = getCurrentGraphCopy();
    //originalDijkstraGraph = currentCanvasGraph;

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    currentCanvasGraph.queue = [];
    currentCanvasGraph.set = [];
    currentCanvasGraph.startingNode=currentCanvasGraph.nodes[currentCanvasGraph.startingNode.id];

    canvasFlags[currentCanvasId].runningFlag = true;

    dijkstra();

    var step = 0;
    var lastStep = dijkstraGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        currentCanvasGraph = dijkstraGraphHistory[step];

        drawDijkstra();

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

    resetDijkstra();
    
}

function extractMin()
{
    var min = Number.MAX_VALUE;
    var minNode = null;

    for(node of currentCanvasGraph.queue)
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

function dijkstra()
{
    nodes = currentCanvasGraph.nodes.slice();
    
    var numberOfNodes = nodes.length;
    var adjacencyList = [];

    if(canvases[currentCanvasId].directed == false)
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

    console.log("startingNode: ")
    console.log(currentCanvasGraph.startingNode)
    
    currentCanvasGraph.startingNode.distance = 0;

    currentCanvasGraph.queue = nodes;

    while (currentCanvasGraph.queue.length > 0) {
        var u = extractMin();
        if(u == null)
        {
            break;
        }
        if(u.parent != null)
        {
            var edge = getEdgeFromNodeToNode(u.parent,u);
            edge.color = "purple";
        }

        currentCanvasGraph.set.push(u);

        u.color = "RED";
        saveDijkstraStepToHistory(currentCanvasGraph.stepCounter);
        currentCanvasGraph.stepCounter++;

        for (var vId of adjacencyList[u.id]) {
            var v =  getNodeUsingId(vId);
            var edge = getEdgeFromNodeToNode(u,v)
            edge.previousColor = edge.color;
            edge.color = "red";
            //saveDijkstraStepToHistory(currentCanvasGraph.stepCounter);
            //currentCanvasGraph.stepCounter++;
            //edge.color = "black";

            var alt = u.distance + edge.weight;
            console.log("alt je: " +alt)
            console.log(currentCanvasGraph.set);
            if(alt < v.distance || v.distance == "∞")
            {
                console.log("v.distance: "+v.distance)
                v.distance = alt;
                v.parent = u;
                //v.color = "PURPLE";
                //edge.color = "purple"

                //saveDijkstraStepToHistory(currentCanvasGraph.stepCounter);
                //currentCanvasGraph.stepCounter++;
            }
            saveDijkstraStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;
            edge.color = edge.previousColor;

            //edge.color = "purple";
        }
        
        u.color = "GREEN";
        
    }

    saveDijkstraStepToHistory(currentCanvasGraph.stepCounter);
    currentCanvasGraph.stepCounter++;

    console.log("set je: ")
    console.log(currentCanvasGraph.set);

    console.log("nodes jsou: ")
    console.log(currentCanvasGraph.nodes);
}