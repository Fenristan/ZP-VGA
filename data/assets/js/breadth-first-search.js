var BFSGraphHistory = [];

var originalBFSGraph = null;

function drawBFS()
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

function saveBFSStepToHistory()
{

    var canvasGraphCopy = getCurrentGraphCopy();

    for(var node of canvasGraphCopy.nodes)
    {
        //node.timeDiscovered = currentCanvasGraph.nodes[node.id].timeDiscovered;
        //node.timeCompleted = currentCanvasGraph.nodes[node.id].timeCompleted;
        node.distance = currentCanvasGraph.nodes[node.id].distance;
        /*if(node.id == currentCanvasGraph.startingNode.id)
        {
            node = currentCanvasGraph.startingNode;
        }*/
    }

    //canvasGraphCopy.startingNode = currentCanvasGraph.startingNode;

    BFSGraphHistory.push(canvasGraphCopy);
    currentCanvasGraph.stepCounter++;
}

function resetBFS()
{
    currentCanvasGraph = originalBFSGraph;

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
    clearBFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].runningFlag = false;

    BFSGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=redNodeImage;
}

async function startBFS()
{
    originalBFSGraph = getCurrentGraphCopy();
    //originalBFSGraph = currentCanvasGraph;

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    currentCanvasGraph.queue = [];
    currentCanvasGraph.startingNode=currentCanvasGraph.nodes[currentCanvasGraph.startingNode.id]

    canvasFlags[currentCanvasId].runningFlag = true;

    BFS();

    
    var step = 0;
    var lastStep = BFSGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        currentCanvasGraph = BFSGraphHistory[step];

        drawBFS();

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

    resetBFS();
    

}

//WHITE == BLUE, GRAY == PURPLE, BLACK == GREEN
function BFS(){

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

        saveBFSStepToHistory(currentCanvasGraph.stepCounter);
        

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


                saveBFSStepToHistory(currentCanvasGraph.stepCounter);
                

                u.color = "PURPLE";
                edge.color = "purple";
                
                
            }
        }
        u.color = "GREEN";
        
        saveBFSStepToHistory(currentCanvasGraph.stepCounter);
        
    }
    
    

};