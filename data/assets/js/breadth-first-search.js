

function startBFS(){
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
                path.push(canvasStorages[currentCanvasId].nodes[v].text);
                console.log(v);
                for (var w of adjacencyList[v]) {
                    if (visited[w] == false) {
                        visited[w] = true;
                        queue.push(w); 
                    }
                }
            }
        }
    }
    console.log(path);

};