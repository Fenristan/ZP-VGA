

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
        u.color = "WHITE";
        u.distance = "∞";
        u.parent = null;
        //updateNodeInformationQuadrantIForNodeInCanvas(u);
    }

    canvasGraph[currentCanvasId].startingNode.color = "GRAY";
    canvasGraph[currentCanvasId].startingNode.distance = 0;
    updateNodeInformationQuadrantIForNodeInCanvas(canvasGraph[currentCanvasId].startingNode);
    //canvasGraph[currentCanvasId].startingNode.parent = null;

    var queue = [];
    queue.push(canvasGraph[currentCanvasId].startingNode);

    while (queue.length > 0) {
        
        var u = queue.shift();

        //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
        drawEdges(canvasGraph[currentCanvasId].edges);

        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        update=true;

        if(stopFlag != true)
        {
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
        }

        for (var vId of adjacencyList[u.id]) {
            var v =  getNodeUsingId(vId);

            if (v.color == "WHITE") {
                v.color = "GRAY";
                v.distance = u.distance + 1;
                console.log("distance "+v.id+" je: " + v.distance)
                updateNodeInformationQuadrantIForNodeInCanvas(v);
                v.parent = u;
                queue.push(v);

                containers[currentCanvasId].getChildByName("bmpNode_"+v.id).image=visitedNodeImage;

                canvasGraph[currentCanvasId].selectedNodes.push(u);
                canvasGraph[currentCanvasId].selectedNodes.push(v);
                
                //g.clear;
                drawEdges(canvasGraph[currentCanvasId].edges);

                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                }
                
            }
        }
        //u.color = "WHITE";
        //containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        u.color = "BLACK";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    }
    
        
    if(stopFlag == true)
    {
        canvasGraph[currentCanvasId].visitedEdges = [];
        for(var node of canvasGraph[currentCanvasId].nodes)
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        }
        disableNodeInformationQuadrantIVisibility();
        stopFlag = false;
    }        

    drawEdges(canvasGraph[currentCanvasId].edges);

    //console.log(path);

};