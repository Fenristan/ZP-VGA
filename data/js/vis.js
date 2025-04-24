

function destroyCurrentVisNetwork() {
  if (visNetworks[currentCanvasId] !== null) {
    visNetworks[currentCanvasId].destroy();
    visNetworks[currentCanvasId] = null;
  }
}

function getOptions()
{
  var arrowsEnabled = Boolean(currentCanvasGraph.directed);
  var options = {
    edges: {
    smooth: {
        type: "cubicBezier",
        forceDirection: "vertical",
        //roundness: 0.0,
        roundness: 0.2,
        type: "curvedCW",
    },
    arrows: {
      to: {
        enabled: arrowsEnabled,
        type: "arrow"
      },
    }
    },
    layout: {
    hierarchical: {
        direction: "UD"
    },
    },
    physics: { //physics:false
      "hierarchicalRepulsion": {
        "avoidOverlap": 1
      },
    }
  };
  return options;
}


function drawTreeDFS()
{
    var currentVisGraph = visGraphs[currentCanvasId];
    var currentVisNetwork = visNetworks[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of currentCanvasGraph.nodes)
    {
        //node = currentCanvasGraph.nodes.slice(node.id,1);
        if(node.color != "BLUE")
        {
            node.level = 0;
            node.label = node.text;
            getLevel(node);
            currentVisGraph.nodes.push(node);
        }
    }


    //add all edges to the array of edges to be draw
    for(edge of currentCanvasGraph.edges)
    {
      var visEdge = { from: edge.nodes[0].id, to: edge.nodes[1].id, label: edge.label, color: edge.color };
      if(edge.color != "black")
      {
        visEdge.width = 3;
      }
      currentVisGraph.edges.push(visEdge);
    }
  
    
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = getOptions();
    
    currentVisNetwork = new vis.Network(container, data, options);
    visNetworks[currentCanvasId] = currentVisNetwork;
    renderDFSGrid();
}

function drawTreeBFS()
{
    var currentVisGraph = visGraphs[currentCanvasId];
    var currentVisNetwork = visNetworks[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of currentCanvasGraph.nodes)
    {
        //node = currentCanvasGraph.nodes.slice(node.id,1);
        if(node.color != "BLUE")
        {
            node.level = node.distance;
            node.label = node.text;
            //getLevel(node);
            currentVisGraph.nodes.push(node);
        }
    }


    //add all edges to the array of edges to be drawn
    for(edge of currentCanvasGraph.edges)
    {
      var visEdge = { from: edge.nodes[0].id, to: edge.nodes[1].id, color: edge.color };
      if(edge.color != "black")
      {
        visEdge.width = 3;
      }
      currentVisGraph.edges.push(visEdge);
    }
  
    
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = getOptions();

    currentVisNetwork = new vis.Network(container, data, options);
    visNetworks[currentCanvasId] = currentVisNetwork;
    renderBFSGrid();
}

function drawTreeDijkstra()
{
    var currentVisGraph = visGraphs[currentCanvasId];
    var currentVisNetwork = visNetworks[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of currentCanvasGraph.nodes)
    {
        //node = currentCanvasGraph.nodes.slice(node.id,1);
        if(node.color != "BLUE")
        {
            //node.level = node.distance;
            node.label = node.text;
            getLevel(node);
            currentVisGraph.nodes.push(node);
        }
    }

    //add all edges to the array of edges to be drawn
    for(edge of currentCanvasGraph.edges)
    {
      var visEdge = { from: edge.nodes[0].id, to: edge.nodes[1].id, color: edge.color };
      if(edge.color != "black")
      {
        visEdge.width = 3;
      }
      currentVisGraph.edges.push(visEdge);
      if(currentVisGraph.nodes.findIndex(node => node.id === edge.nodes[1].id) == -1)
      {
        if(edge.nodes[1].distance != "∞" && edge.nodes[1].distance != null)
        {
          getLevel(edge.nodes[1]);
          edge.nodes[1].label = edge.nodes[1].text;
          currentVisGraph.nodes.push(edge.nodes[1]);
        }
        
      }
      
    }
  
    
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = getOptions();

    currentVisNetwork = new vis.Network(container, data, options);
    visNetworks[currentCanvasId] = currentVisNetwork;
    renderDijkstraGrid();
}

function drawTreeDFS_Tarjan()
{
    var currentVisGraph = visGraphs[currentCanvasId];
    var currentVisNetwork = visNetworks[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of currentCanvasGraph.nodes)
    {
        //node = currentCanvasGraph.nodes.slice(node.id,1);
        if(node.color != "BLUE")
        {
            node.level = 0;
            node.label = node.text;
            getLevel(node);
            currentVisGraph.nodes.push(node);
        }
    }

    for(edge of currentCanvasGraph.edges)
    {
      var visEdge = { from: edge.nodes[0].id, to: edge.nodes[1].id, label:edge.label, color: edge.color };
      if(edge.color != "black")
      {
        visEdge.width = 3;
      }
      currentVisGraph.edges.push(visEdge);
    }
  
    
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = getOptions();

    currentVisNetwork = new vis.Network(container, data, options);
    visNetworks[currentCanvasId] = currentVisNetwork;
    renderTarjanGrid();
}

function drawTreeBiconnectivity()
{
    var currentVisGraph = visGraphs[currentCanvasId];
    var currentVisNetwork = visNetworks[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of currentCanvasGraph.nodes)
    {
        //node = currentCanvasGraph.nodes.slice(node.id,1);
        if(node.color != "BLUE")
        {
            node.level = 0;
            node.label = node.text;
            getLevel(node);
            currentVisGraph.nodes.push(node);
        }
    }

    for(edge of currentCanvasGraph.edges)
    {
      var visEdge = { from: edge.nodes[0].id, to: edge.nodes[1].id, color: edge.color };
      if(edge.color != "black")
      {
        visEdge.width = 3;
      }
      currentVisGraph.edges.push(visEdge);
    }
  
    
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = getOptions();

    currentVisNetwork = new vis.Network(container, data, options);
    visNetworks[currentCanvasId] = currentVisNetwork;
    renderBiconnectivityGrid();
}

function getLevelRec(node, level)
{
  level += 1;
  if(node.parent != null)
  {
    return getLevelRec(node.parent, level);
  }
  else
  {
    return level;
  }
}

function getLevel(node)
{
  var level = 0;
  if(node.parent != null)
  {
    node.level = getLevelRec(node.parent, level);
  }
  else
  {
    node.level = level;
    return;
  }
}

/*function searchParents(currentNode, lookingForNode)
{
  if(currentNode.parent == null)
  {
    return false;
  }
  else if(currentNode.parent == lookingForNode)
  {
    return true;
  }
  else
  {
    return searchParents(currentNode.parent, lookingForNode);
  }
}*/

/*function isInTheSameTree(startingNode, lookingForNode)
{
  if(startingNode.parent != null)
  {
    return searchParents(startingNode,lookingForNode);
  }
  else
  {
    return false;
  }
}*/

