

async function startBFS(waitUntilForwardClicked){
    var numberOfNodes = canvasStorages[currentCanvasId].nodes.length;
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


    
    for (var i = 0; i < numberOfNodes; i++) {
        if (visited[i] == false) {
            
            var queue = [];
            visited[i] = true;
            queue.push(i);

            containers[currentCanvasId].getChildByName("bmp_"+i).image=visitedNodeImage;
            g.clear;
            drawEdges(canvasStorages[currentCanvasId].edges);
            update=true;
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
            
            

            while (queue.length > 0) {
                
                var v = queue.shift();
                //canvasStorages[currentCanvasId].selectedNodes.push(canvasStorages[currentCanvasId].nodes[i]);
                
                path.push(canvasStorages[currentCanvasId].nodes[v].text);
                
                //I want to draw edges here because otherwise there could be a colored (selected) edge left hanging
                drawEdges(canvasStorages[currentCanvasId].edges);

                containers[currentCanvasId].getChildByName("bmp_"+v).image=selectedNodeImage;
                update=true;
                await waitUntilForwardClicked;
                waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);

                for (var w of adjacencyList[v]) {
                    
                    if (visited[w] == false) {
                        visited[w] = true;
                        queue.push(w); 
                        containers[currentCanvasId].getChildByName("bmp_"+w).image=visitedNodeImage;

                        //containers[currentCanvasId].getChildByName("bmp_"+w).image=selectedNodeImage;

                        console.log(v);
                        console.log(w);

                        /*if(canvasStorages[currentCanvasId].selectedNodes.length!=0)
                        {
                            canvasStorages[currentCanvasId].selectedNodes.pop()
                            canvasStorages[currentCanvasId].selectedNodes.pop()
                        }*/

                        canvasStorages[currentCanvasId].selectedNodes.push(canvasStorages[currentCanvasId].nodes[v]);
                        canvasStorages[currentCanvasId].selectedNodes.push(canvasStorages[currentCanvasId].nodes[w]);
                        console.log("selected nodes: ");
                        console.log(canvasStorages[currentCanvasId].selectedNodes);
                        g.clear;
                        drawEdges(canvasStorages[currentCanvasId].edges);
                        update=true;

                        console.log("pausing");
                        await waitUntilForwardClicked;
                        waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
                        console.log("unpausing");
                    }
                }
                containers[currentCanvasId].getChildByName("bmp_"+v).image=completedNodeImage;
            }
        }
    }
    console.log(path);

};