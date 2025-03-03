//WHITE == BLUE, GRAY == PURPLE, BLACK == GREEN
async function startBFS(waitUntilForwardClicked){
    var numberOfNodes = canvasGraph[currentCanvasId].nodes.length;
    var adjacencyList = [];
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
    }
    
    for(var u of canvasGraph[currentCanvasId].nodes)
    {
        u.color = "BLUE";
        u.distance = "∞";
        u.parent = null;
        //updateNodeInformationQuadrantIForNodeInCanvas(u);
    }

    canvasGraph[currentCanvasId].startingNode.color = "PURPLE";
    canvasGraph[currentCanvasId].startingNode.distance = 0;
    updateNodeInformationQuadrantIForNodeInCanvas(canvasGraph[currentCanvasId].startingNode);
    //canvasGraph[currentCanvasId].startingNode.parent = null;

    var queue = [];
    queue.push(canvasGraph[currentCanvasId].startingNode);

    drawTreeBFS();

    while (queue.length > 0) {
        
        var u = queue.shift();

        //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
        drawEdges(canvasGraph[currentCanvasId].edges);
        drawTreeBFS();

        u.color = "RED";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        
        update=true;
        drawTreeBFS();

        if(stopFlag != true)
        {
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
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

                canvasGraph[currentCanvasId].selectedNodes.push(u);
                canvasGraph[currentCanvasId].selectedNodes.push(v);
                drawEdges(canvasGraph[currentCanvasId].edges);
                drawTreeBFS();
                //u.color = "PURPLE";
                //drawTreeBFS();

                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                }
                drawTreeBFS();
                
            }
        }
        //u.color = "BLUE";
        //containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        u.color = "GREEN";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
        update = true; //snad
        drawTreeBFS();
    }
    
    if(stopFlag != true)
    {
        await createClickListenerPromise(CurrentRestartButton);
        console.log("Restart button pressed");
    }
        
    if(stopFlag == true)
    {
        canvasGraph[currentCanvasId].visitedEdges = [];
        for(var node of canvasGraph[currentCanvasId].nodes)
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        }
        disableNodeInformationQuadrantIVisibility();


        drawEdges(canvasGraph[currentCanvasId].edges);
        destroyCurrentVisNetwork();

        stopFlag = false;
    }        

    

    //console.log(path);

};