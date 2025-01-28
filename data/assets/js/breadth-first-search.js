<script src="adjacency-list.js" defer></script>;

function startBFS(){
    var numberOfNodes = canvasStorages[currentCanvasId].nodes.length;
    adjacencyList = [];
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected();
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected();
    }
    
    let visited = new Array(numberOfNodes).fill(false);

    for (let i = 0; i < this.numberOfNodes; i++) {
        if (!visited[i]) {
            var queue = [];
            visited[i] = true;
            queue.push(i);

            while (queue.length !== 0) {
                var s = queue.shift();
                process.stdout.write(s + " ");
                for (var n of adjacencyList[s]) {
                    if (!visited[n]) {
                        visited[n] = true;
                        queue.push(n);
                    }
                }
            }
        }
    }
}