

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
            

            while (queue.length > 0) {
                
                var v = queue.shift();
                //canvasStorages[currentCanvasId].selectedNodes.push(canvasStorages[currentCanvasId].nodes[i]);
                
                path.push(canvasStorages[currentCanvasId].nodes[v].text);
                
                

                for (var w of adjacencyList[v]) {
                    if (visited[w] == false) {
                        visited[w] = true;
                        queue.push(w); 

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
                
            }
        }
    }
    console.log(path);

};