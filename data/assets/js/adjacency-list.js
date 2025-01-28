function convertToAdjacencyListUndirected(numVertices) {

    var adjacencyList = [];
    var edges = canvasStorages[currentCanvasId].edges;
    
    edges.forEach(edge => {
        
        var source = edge.nodes[0].id;
        var destination = edge.nodes[1].id;
  
      adjacencyList[source].push(destination);
      adjacencyList[destination].push(source);

    });
    return adjacencyList;
}

  function convertToAdjacencyListDirected(numVertices) {

    var adjacencyList = [];
    var edges = canvasStorages[currentCanvasId].edges;
    
    edges.forEach(edge => {
        
        var source = edge.nodes[0].id;
        var destination = edge.nodes[1].id;
  
      adjacencyList[source].push(destination);

    });
    return adjacencyList;
}