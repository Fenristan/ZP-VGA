function convertToAdjacencyListUndirected(numberOfNodes) {

    var adjacencyList = Array.from({ length: numberOfNodes }, () => []);
    var edges = canvasGraphs[currentCanvasId].edges;
    
    edges.forEach(edge => {
        
    var source = edge.nodes[0].id;
    var destination = edge.nodes[1].id;
  
      adjacencyList[source].push(destination);
      adjacencyList[destination].push(source);

    });
    console.log(adjacencyList);
    return adjacencyList;
}

  function convertToAdjacencyListDirected(numberOfNodes) {

    var adjacencyList = Array.from({ length: numberOfNodes }, () => []);
    var edges = canvasGraphs[currentCanvasId].edges;
    
    edges.forEach(edge => {
        
        var source = edge.nodes[0].id;
        var destination = edge.nodes[1].id;
  
      adjacencyList[source].push(destination);

    });
    console.log("adjacencyLisT:")
    console.log(adjacencyList);
    return adjacencyList;
}