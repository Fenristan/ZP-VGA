var BFSGraphHistory = [];

var originalBFSGraph = null;

function drawBFS()
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

        updateNodeInformationQuadrantIForBFS(u);
    }

    /*canvasGraphs[currentCanvasId].startingNode.color = "RED";
    canvasGraphs[currentCanvasId].startingNode.distance = 0;*/

    drawEdges(canvasGraphs[currentCanvasId].edges);
    drawTreeBFS();
}

function saveBFSStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]));

    for(var node of canvasGraphCopy.nodes)
    {
        //node.timeDiscovered = canvasGraphs[currentCanvasId].nodes[node.id].timeDiscovered;
        //node.timeCompleted = canvasGraphs[currentCanvasId].nodes[node.id].timeCompleted;
        node.distance = canvasGraphs[currentCanvasId].nodes[node.id].distance;
        /*if(node.id == canvasGraphs[currentCanvasId].startingNode.id)
        {
            node = canvasGraphs[currentCanvasId].startingNode;
        }*/
    }

    //canvasGraphCopy.startingNode = canvasGraphs[currentCanvasId].startingNode;

    BFSGraphHistory.push(canvasGraphCopy);
}

function resetBFS()
{
    canvasGraphs[currentCanvasId] = originalBFSGraph;

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
    clearBFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    BFSGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+canvasGraphs[currentCanvasId].startingNode.id).image=selectedNodeImage;
}

async function startBFS()
{
    originalBFSGraph = canvasGraphs[currentCanvasId];

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    canvasGraphs[currentCanvasId].queue = [];
    canvasGraphs[currentCanvasId].startingNode=canvasGraphs[currentCanvasId].nodes[canvasGraphs[currentCanvasId].startingNode.id]

    canvasFlags[currentCanvasId].running = true;

    BFS();

    
    var step = 0;
    var lastStep = BFSGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        console.log("BFSGraphHistory je nasledujici: ");
        console.log(BFSGraphHistory);

        console.log("accesuji BFSGraphHistory na indexu: "+step);
        canvasGraphs[currentCanvasId] = BFSGraphHistory[step];

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
        //updateNodeInformationQuadrantIForBFS(u);
    }
    for (var e of canvasGraphs[currentCanvasId].edges) {
        e.color = "black";
    }

    canvasGraphs[currentCanvasId].startingNode.color = "PURPLE";
    canvasGraphs[currentCanvasId].startingNode.distance = 0;
    

    //updateNodeInformationQuadrantIForBFS(canvasGraphs[currentCanvasId].startingNode)


    canvasGraphs[currentCanvasId].queue.push(canvasGraphs[currentCanvasId].startingNode);

    while (canvasGraphs[currentCanvasId].queue.length > 0) {
        
        var u = canvasGraphs[currentCanvasId].queue.shift();
        
        //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
        //drawEdges(canvasGraphs[currentCanvasId].edges);
        //drawTreeBFS();

        u.color = "RED";

        saveBFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
        canvasGraphs[currentCanvasId].stepCounter++;

        for (var vId of adjacencyList[u.id]) {
            var v =  getNodeUsingId(vId);

            if (v.color == "BLUE") {
                u.color = "RED";
                v.color = "PURPLE";
                //containers[currentCanvasId].getChildByName("bmpNode_"+v.id).image=visitedNodeImage;
                v.distance = u.distance + 1;
                console.log("distance "+v.id+" je: " + v.distance)

                v.parent = u;
                canvasGraphs[currentCanvasId].queue.push(v);

                var edge = getEdgeFromNodeToNode(u,v);
                edge.color = "red";


                saveBFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
                canvasGraphs[currentCanvasId].stepCounter++;

                u.color = "PURPLE";
                edge.color = "purple";
                
                
            }
        }
        //u.color = "BLUE";
        //containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        u.color = "GREEN";
        
        saveBFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
        canvasGraphs[currentCanvasId].stepCounter++;
    }
    
    
        

    

    //console.log(path);

};