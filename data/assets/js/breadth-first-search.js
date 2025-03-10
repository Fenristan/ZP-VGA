var queue = [];

function resetBFS()
{
    canvasGraphs[currentCanvasId].visitedEdges = [];
    canvasGraphs[currentCanvasId].selectedNodes = [];
    queue = [];
    for(var node of canvasGraphs[currentCanvasId].nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    drawEdges(canvasGraphs[currentCanvasId].edges);
    destroyCurrentVisNetwork();
    clearDFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;
}

async function startBFS(waitUntilForwardClicked,startFromStep=-1)
{

    canvasFlags[currentCanvasId].running = true;

    toggleNodeInformationQuadrantIVisibility();

    var result = await BFS(waitUntilForwardClicked,startFromStep)
    console.log("result je: "+result);

    resetBFS();
 
    if(result == 0)
    {
        console.log("BFS has been stopped or restarted");
        
        if(canvasFlags[currentCanvasId].restartFlag == true)
        {
            console.log("canvasFlags[currentCanvasId].restartFlag byl pressed");
            canvasFlags[currentCanvasId].restartFlag = false;
            canvasFlags[currentCanvasId].stopFlag = false;
            await startBFS(waitUntilForwardClicked);
        }

        disableNodeInformationQuadrantIVisibility();

        return 0;
    }
    else if (result > 0)
    {
        console.log("Returning one step back, to step number: "+result);
        await startBFS(waitUntilForwardClicked,(result-4));

        return 0;
    }
    

}

//WHITE == BLUE, GRAY == PURPLE, BLACK == GREEN
async function BFS(waitUntilForwardClicked, startFromStep=-1){
    console.log("startFromStep je: "+ startFromStep);
    //var canvasGraphs[currentCanvasId].stepCounter = 0;
    var numberOfNodes = canvasGraphs[currentCanvasId].nodes.length;
    var adjacencyList = [];
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
    }
    
    for(var u of canvasGraphs[currentCanvasId].nodes)
    {
        u.color = "BLUE";
        u.distance = "∞";
        u.parent = null;
        updateNodeInformationQuadrantIForNodeInCanvas(u);
    }

    canvasGraphs[currentCanvasId].startingNode.color = "PURPLE";
    canvasGraphs[currentCanvasId].startingNode.distance = 0;
    updateNodeInformationQuadrantIForNodeInCanvas(canvasGraphs[currentCanvasId].startingNode);
    //canvasGraphs[currentCanvasId].startingNode.parent = null;

    queue.push(canvasGraphs[currentCanvasId].startingNode);

    drawTreeBFS();

    while (queue.length > 0) {
        
        var u = queue.shift();
        
        //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
        drawEdges(canvasGraphs[currentCanvasId].edges);
        drawTreeBFS();

        u.color = "RED";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        
        update=true;
        drawTreeBFS();

        if(canvasGraphs[currentCanvasId].stepCounter > startFromStep)
        {
            if(canvasFlags[currentCanvasId].stopFlag != true)
            {
                await waitUntilForwardClicked;
                waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                canvasGraphs[currentCanvasId].stepCounter++;
            }
            else
            {
                if(canvasFlags[currentCanvasId].stepBackwardsFlag == true)
                {
                    canvasFlags[currentCanvasId].stopFlag = false;
                    canvasFlags[currentCanvasId].stepBackwardsFlag = false;
                    return canvasGraphs[currentCanvasId].stepCounter;
                }
                return 0;
            }
        }
        else
        {
            canvasGraphs[currentCanvasId].stepCounter++;
        }

        for (var vId of adjacencyList[u.id]) {
            var v =  getNodeUsingId(vId);

            if (v.color == "BLUE") {
                //u.color = "RED";
                v.color = "PURPLE";
                containers[currentCanvasId].getChildByName("bmpNode_"+v.id).image=visitedNodeImage;
                v.distance = u.distance + 1;
                console.log("distance "+v.id+" je: " + v.distance)
                updateNodeInformationQuadrantIForNodeInCanvas(v);
                v.parent = u;
                queue.push(v);
                
                //update = true;
                //drawTreeBFS();

                canvasGraphs[currentCanvasId].selectedNodes.push(u);
                canvasGraphs[currentCanvasId].selectedNodes.push(v);
                drawEdges(canvasGraphs[currentCanvasId].edges);
                drawTreeBFS();
                //u.color = "PURPLE";
                //drawTreeBFS();

                if(canvasGraphs[currentCanvasId].stepCounter > startFromStep)
                {
                    if(canvasFlags[currentCanvasId].stopFlag != true)
                    {
                        await waitUntilForwardClicked;
                        waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                        canvasGraphs[currentCanvasId].stepCounter++;
                    }
                    else
                    {
                        if(canvasFlags[currentCanvasId].stepBackwardsFlag == true)
                        {
                            canvasFlags[currentCanvasId].stopFlag = false;
                            canvasFlags[currentCanvasId].stepBackwardsFlag = false;
                            return canvasGraphs[currentCanvasId].stepCounter;
                        }
                        return 0;
                    }
                }
                else
                {
                    canvasGraphs[currentCanvasId].stepCounter++;
                }
                drawTreeBFS();
                
            }
        }
        //u.color = "BLUE";
        //containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        u.color = "GREEN";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
        update = true; 
        drawTreeBFS();
    }
    
    if(canvasFlags[currentCanvasId].stopFlag != true)
    {
        await Promise.race([createClickListenerPromise(CurrentRestartButton), createClickListenerPromise(CurrentStartStopButton), createClickListenerPromise(LoadButton), createClickListenerPromise(CurrentStepBackwardsButton)]);
        console.log("Restart or stop button or backwards button pressed");

        var lastStep = canvasGraphs[currentCanvasId].stepCounter;

        resetDFS();

        if(canvasFlags[currentCanvasId].stepBackwardsFlag == true)
        {
            console.log("starting new simulation from next to last step");
            canvasFlags[currentCanvasId].stopFlag = false;
            canvasFlags[currentCanvasId].stepBackwardsFlag = false;
            await startBFS(waitUntilForwardClicked,lastStep-4);
        }
        else if(canvasFlags[currentCanvasId].restartFlag == true)
        {
            canvasFlags[currentCanvasId].stopFlag = false;
            canvasFlags[currentCanvasId].restartFlag = false;

            await startBFS(waitUntilForwardClicked);
        }
        else if(canvasFlags[currentCanvasId].stopFlag == true)
        {
            return 0;
        }

        return 0;
    }
        

    

    //console.log(path);

};