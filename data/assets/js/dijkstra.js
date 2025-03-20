var dijkstraGraphHistory = [];

var originalDijkstraGraph = null;

function drawDijkstra()
{
    for(var u of canvasGraphs[currentCanvasId].nodes)
    {
        if(u.color == "BLUE")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        }
        else if(u.color == "RED")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        }
        else if(u.color == "PURPLE")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=visitedNodeImage;
        }
        else if(u.color == "GREEN")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
        }

        updateNodeInformationQuadrantIForDijkstra(u);
    }

    drawEdges(canvasGraphs[currentCanvasId].edges);
    drawTreeDijkstra();
}

function saveDijkstraStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]));

    for(var node of canvasGraphCopy.nodes)
    {
        node.distance = canvasGraphs[currentCanvasId].nodes[node.id].distance;
    }

    dijkstraGraphHistory.push(canvasGraphCopy);
}

function resetDijkstra()
{
    canvasGraphs[currentCanvasId] = originalDijkstraGraph;

    canvasGraphs[currentCanvasId].queue = [];
    for(var node of canvasGraphs[currentCanvasId].nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    for(var edge of canvasGraphs[currentCanvasId].edges)
    {
        edge.color = "black";
    }

    drawEdges(canvasGraphs[currentCanvasId].edges);
    destroyCurrentVisNetwork();
    clearDijkstraGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();


    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    dijkstraGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+canvasGraphs[currentCanvasId].startingNode.id).image=selectedNodeImage;
}

async function startDijkstra()
{
    originalDijkstraGraph = canvasGraphs[currentCanvasId];

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    canvasGraphs[currentCanvasId].queue = [];
    canvasGraphs[currentCanvasId].set = [];
    canvasGraphs[currentCanvasId].startingNode=canvasGraphs[currentCanvasId].nodes[canvasGraphs[currentCanvasId].startingNode.id]

    canvasFlags[currentCanvasId].running = true;

    dijkstra();

    var step = 0;
    var lastStep = dijkstraGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        console.log("BFSGraphHistory je nasledujici: ");
        console.log(dijkstraGraphHistory);

        console.log("accesuji BFSGraphHistory na indexu: "+step);
        canvasGraphs[currentCanvasId] = dijkstraGraphHistory[step];

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

    for(node of canvasGraphs[currentCanvasId].queue)
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
        const findIndex = canvasGraphs[currentCanvasId].queue.findIndex(node => node.id === minNode.id);
        findIndex !== -1 && canvasGraphs[currentCanvasId].queue.splice(findIndex , 1);
    }

    return minNode;
}

function dijkstra()
{
    nodes = canvasGraphs[currentCanvasId].nodes.slice();
    
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
    for (var e of canvasGraphs[currentCanvasId].edges) {
        e.color = "black";
    }

    canvasGraphs[currentCanvasId].startingNode.distance = 0;

    canvasGraphs[currentCanvasId].queue = nodes;

    while (canvasGraphs[currentCanvasId].queue.length > 0) {
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
        console.log("extracted min: ");
        console.log(u);
        canvasGraphs[currentCanvasId].set.push(u);

        u.color = "RED";
        saveDijkstraStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
        canvasGraphs[currentCanvasId].stepCounter++;

        for (var vId of adjacencyList[u.id]) {
            var v =  getNodeUsingId(vId);
            var edge = getEdgeFromNodeToNode(u,v)
            edge.color = "red";
            //saveDijkstraStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            //canvasGraphs[currentCanvasId].stepCounter++;
            //edge.color = "black";

            var alt = u.distance + edge.weight;
            console.log("alt je: " +alt)
            console.log(canvasGraphs[currentCanvasId].set);
            if(alt < v.distance || v.distance == "∞")
            {
                console.log("v.distance: "+v.distance)
                v.distance = alt;
                v.parent = u;
                //v.color = "PURPLE";
                //edge.color = "purple"

                //saveDijkstraStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
                //canvasGraphs[currentCanvasId].stepCounter++;
            }
            saveDijkstraStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            canvasGraphs[currentCanvasId].stepCounter++;
            edge.color = "black";

            //edge.color = "purple";
        }
        
        u.color = "GREEN";
        
    }

    saveDijkstraStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
    canvasGraphs[currentCanvasId].stepCounter++;

    console.log("set je: ")
    console.log(canvasGraphs[currentCanvasId].set);

    console.log("nodes jsou: ")
    console.log(canvasGraphs[currentCanvasId].nodes);
}