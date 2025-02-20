

async function startBFS(waitUntilForwardClicked){
    var numberOfNodes = canvasGraph[currentCanvasId].nodes.length;
    adjacencyList = [];
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
    }
    
    var visited = new Array(numberOfNodes).fill(false);
    var path = [];
    var queue = [];
            
    visited[canvasGraph[currentCanvasId].startingNode.id] = true;
    queue.push(canvasGraph[currentCanvasId].startingNode.id);

    while (queue.length > 0) {
        
        var v = queue.shift();
        //canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[i]);
        
        path.push(canvasGraph[currentCanvasId].nodes[v].text);
        
        //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
        drawEdges(canvasGraph[currentCanvasId].edges);

        containers[currentCanvasId].getChildByName("bmpNode_"+v).image=selectedNodeImage;
        update=true;
        if(stopFlag != true)
        {
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
        }

        for (var w of adjacencyList[v]) {
            
            if (visited[w] == false) {
                visited[w] = true;
                queue.push(w); 
                containers[currentCanvasId].getChildByName("bmpNode_"+w).image=visitedNodeImage;

                //containers[currentCanvasId].getChildByName("bmpNode_"+w).image=selectedNodeImage;

                console.log(v);
                console.log("var W je: "+w);
                console.log(w);

                /*if(canvasGraph[currentCanvasId].selectedNodes.length!=0)
                {
                    canvasGraph[currentCanvasId].selectedNodes.pop()
                    canvasGraph[currentCanvasId].selectedNodes.pop()
                }*/
                canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[v]);
                canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[w]);
                
                
                console.log("selected nodes: ");
                console.log(canvasGraph[currentCanvasId].selectedNodes);
                g.clear;
                drawEdges(canvasGraph[currentCanvasId].edges);
                update=true;

                
                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
                }
                
            }
        }
        containers[currentCanvasId].getChildByName("bmpNode_"+v).image=completedNodeImage;
    }
        
    if(stopFlag == true)
    {
        canvasGraph[currentCanvasId].visitedEdges = [];
        for(var node of canvasGraph[currentCanvasId].nodes)
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        }
        //toggleDistancesFromSourceVisibility();
        stopFlag = false;
    }        

    drawEdges(canvasGraph[currentCanvasId].edges);

    console.log(path);

};