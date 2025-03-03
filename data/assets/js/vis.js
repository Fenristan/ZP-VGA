//import * as vis from "./lib/vis-network.min.js";

visGraphs = [];
visNetworks = [];

var currentVisNetwork = null;

for(let i = 0; i < canvases.length; i++)
{
    visGraphs.push({ nodes: [], edges: []});
    visNetworks.push(null);
}

//var network = null;
//var directionInput = document.getElementById("direction");

function destroyCurrentVisNetwork() {
  if (currentVisNetwork !== null) {
    currentVisNetwork.destroy();
    currentVisNetwork = null;
  }
}

function getLevelRec(node, level)
{
  level += 1;
  console.log(level);
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
  level = 0;
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

function searchParents(currentNode, lookingForNode)
{
  console.log("I am currently in node: "+currentNode.id+" and I am looking for: "+ lookingForNode.id);
  if(currentNode.parent == null)
  {
    return false;
  }
  else if(currentNode.parent == lookingForNode)
  {
    console.log("The parent I am looking for");
    return true;
  }
  else
  {
    return searchParents(currentNode.parent, lookingForNode);
  }
}

function isInTheSameTree(startingNode, lookingForNode)
{
  if(startingNode.parent != null)
  {
    return searchParents(startingNode,lookingForNode);
  }
  else
  {
    return false;
  }
}

function drawTreeDFS()
{
    currentVisGraph = visGraphs[currentCanvasId];
    currentVisNetwork = visNetworks[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of canvasGraph[currentCanvasId].nodes)
    {
        //node = canvasGraph[currentCanvasId].nodes.slice(node.id,1);
        if(node.color == "PURPLE" || node.color == "GREEN" || node.color == "RED")
        {
            node.level = 0;
            node.label = node.text;
            getLevel(node);
            currentVisGraph.nodes.push(node);
            console.log(currentVisGraph.nodes);
        }
    }


    //add all edges to the array of edges to be draw
    for(edge of canvasGraph[currentCanvasId].edges)
    {
      if(canvasGraph[currentCanvasId].visitedEdges.includes(edge))
      {
        currentVisGraph.edges.push({ from: edge.nodes[0].id, to: edge.nodes[1].id, color: edge.color });
      }
      else
      {
        currentVisGraph.edges.push({ from: edge.nodes[0].id, to: edge.nodes[1].id, label: edge.label, color: edge.color });
      }
    }
  
    var arrowsEnabled = Boolean(canvases[currentCanvasId].directed);
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = {
        edges: {
        smooth: {
            type: "cubicBezier",
            forceDirection: "vertical",
            //roundness: 0.4,
            roundness: 0.0,
            /*type: "curvedCW",
            forceDirection: "vertical",
            roundness: -2.1,*/
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
    currentVisNetwork = new vis.Network(container, data, options);
}

function drawTreeBFS()
{
    currentVisGraph = visGraphs[currentCanvasId];
    destroyCurrentVisNetwork();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    //add all visited, completed and currently selected nodes to an array of nodes to be drawn
    for(node of canvasGraph[currentCanvasId].nodes)
    {
        //node = canvasGraph[currentCanvasId].nodes.slice(node.id,1);
        if(node.color == "PURPLE" || node.color == "GREEN" || node.color == "RED")
        {
            node.level = node.distance;
            node.label = node.text;
            //getLevel(node);
            currentVisGraph.nodes.push(node);
            console.log(currentVisGraph.nodes);
        }
    }


    //add all edges to the array of edges to be drawn
    for(edge of canvasGraph[currentCanvasId].edges)
    {
      if(canvasGraph[currentCanvasId].visitedEdges.includes(edge))
      {
        currentVisGraph.edges.push({ from: edge.nodes[0].id, to: edge.nodes[1].id, color: edge.color, width: 3 });
      }
      else
      {
        currentVisGraph.edges.push({ from: edge.nodes[0].id, to: edge.nodes[1].id, label: edge.label, color: "black", width: 0.8 });
      }
    }
  
    var arrowsEnabled = Boolean(canvases[currentCanvasId].directed);
    
    // create a network
    var container = document.getElementById("visNetworkCanvas"+currentCanvasId);
    var data = {
        nodes: currentVisGraph.nodes,
        edges: currentVisGraph.edges,
    };

    var options = {
        edges: {
        smooth: {
            type: "cubicBezier",
            forceDirection: "vertical",
            roundness: 0.0,

            /*type: "curvedCW",
            forceDirection: "vertical",
            roundness: -2.1,*/
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
    currentVisNetwork = new vis.Network(container, data, options);
    renderBFSGrid();
}

/*var directionInput = document.getElementById("direction");
var btnUD = document.getElementById("btn-UD");
btnUD.onclick = function () {
  directionInput.value = "UD";
  draw();
};
var btnDU = document.getElementById("btn-DU");
btnDU.onclick = function () {
  directionInput.value = "DU";
  draw();
};
var btnLR = document.getElementById("btn-LR");
btnLR.onclick = function () {
  directionInput.value = "LR";
  draw();
};
var btnRL = document.getElementById("btn-RL");
btnRL.onclick = function () {
  directionInput.value = "RL";
  draw();
};*/

/*window.addEventListener("load", () => {
  draw();
});*/
