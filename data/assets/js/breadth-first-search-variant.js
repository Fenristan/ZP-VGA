var BFSGraphHistory = [];

var originalBFSGraph = null;

function drawBFS()
{
    for(var u of currentCanvasGraph.nodes)
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

        updateNodeInformationQuadrantIForBFS(u);
    }

    /*currentCanvasGraph.startingNode.color = "RED";
    currentCanvasGraph.startingNode.distance = 0;*/

    drawEdges(currentCanvasGraph.edges);
    drawTreeBFS();
}

function saveBFSStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(currentCanvasGraph));

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
}

function resetBFS()
{
    currentCanvasGraph = originalBFSGraph;

    currentCanvasGraph.queue = [];
    for(var node of currentCanvasGraph.nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    for(var edge of currentCanvasGraph.edges)
    {
        edge.color = "black";
    }

    drawEdges(currentCanvasGraph.edges);
    destroyCurrentVisNetwork();
    clearBFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    BFSGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=selectedNodeImage;
}

async function startBFS()
{
    originalBFSGraph = currentCanvasGraph;

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    currentCanvasGraph.queue = [];
    currentCanvasGraph.startingNode=currentCanvasGraph.nodes[currentCanvasGraph.startingNode.id]

    canvasFlags[currentCanvasId].running = true;

    BFS();

    
    var step = 0;
    var lastStep = BFSGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        console.log("BFSGraphHistory je nasledujici: ");
        console.log(BFSGraphHistory);

        console.log("accesuji BFSGraphHistory na indexu: "+step);
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
        
        //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
        //drawEdges(currentCanvasGraph.edges);
        //drawTreeBFS();

        u.color = "RED";

        saveBFSStepToHistory(currentCanvasGraph.stepCounter);
        currentCanvasGraph.stepCounter++;

        for (var vId of adjacencyList[u.id]) {
            var v =  getNodeUsingId(vId);

            if (v.color == "BLUE") {
                u.color = "RED";
                v.color = "PURPLE";
                //containers[currentCanvasId].getChildByName("bmpNode_"+v.id).image=visitedNodeImage;
                v.distance = u.distance + 1;
                console.log("distance "+v.id+" je: " + v.distance)

                v.parent = u;
                currentCanvasGraph.queue.push(v);

                var edge = getEdgeFromNodeToNode(u,v);
                edge.color = "red";


                saveBFSStepToHistory(currentCanvasGraph.stepCounter);
                currentCanvasGraph.stepCounter++;

                u.color = "PURPLE";
                edge.color = "purple";
                
                
            }
        }
        //u.color = "BLUE";
        //containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        u.color = "GREEN";
        
        saveBFSStepToHistory(currentCanvasGraph.stepCounter);
        currentCanvasGraph.stepCounter++;
    }
    
    
        

    

    //console.log(path);

};