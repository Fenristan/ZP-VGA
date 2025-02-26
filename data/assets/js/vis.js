//import * as vis from "./lib/vis-network.min.js";

visGraphs = [];

for(let i = 0; i < canvases.length; i++)
{
    visGraphs.push({ nodes: [], edges: []});
}

var network = null;
//var directionInput = document.getElementById("direction");

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
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

function drawTreeDFS()
{
    currentVisGraph = visGraphs[currentCanvasId];
    destroy();
    currentVisGraph.nodes = [];
    currentVisGraph.edges = [];

    for(node of canvasGraph[currentCanvasId].nodes)
    {
        //node = canvasGraph[currentCanvasId].nodes.slice(node.id,1);
        if(node.color == "PURPLE" || node.color == "GREEN" || node.color == "RED")
        {
            node.level = 0;
            getLevel(node);
            currentVisGraph.nodes.push(node);
            console.log(currentVisGraph.nodes);
        }
    }

    for(edge of canvasGraph[currentCanvasId].visitedEdges)
    {
      currentVisGraph.edges.push({ from: edge.nodes[0].id, to: edge.nodes[1].id });
    }

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
            roundness: 0.4,
        },
        },
        layout: {
        hierarchical: {
            direction: "UD",
        },
        },
        physics: false,
    };
    network = new vis.Network(container, data, options);
}

function draw() {
  currentVisGraph = visGraphs[currentCanvasId];
  destroy();
  currentVisGraph.nodes = [];
  currentVisGraph.edges = [];
  var connectionCount = [];

  // randomly create some nodes and edges
  for (var i = 0; i < 15; i++) {
    currentVisGraph.nodes.push({ id: i, label: String(i) });
  }
  currentVisGraph.edges.push({ from: 0, to: 1 });
  currentVisGraph.edges.push({ from: 0, to: 6 });
  currentVisGraph.edges.push({ from: 0, to: 13 });
  currentVisGraph.edges.push({ from: 0, to: 11 });
  currentVisGraph.edges.push({ from: 1, to: 2 });
  currentVisGraph.edges.push({ from: 2, to: 3 });
  currentVisGraph.edges.push({ from: 2, to: 4 });
  currentVisGraph.edges.push({ from: 3, to: 5 });
  currentVisGraph.edges.push({ from: 1, to: 10 });
  currentVisGraph.edges.push({ from: 1, to: 7 });
  currentVisGraph.edges.push({ from: 2, to: 8 });
  currentVisGraph.edges.push({ from: 2, to: 9 });
  currentVisGraph.edges.push({ from: 3, to: 14 });
  currentVisGraph.edges.push({ from: 1, to: 12 });
  currentVisGraph.nodes[0]["level"] = 0;
  currentVisGraph.nodes[1]["level"] = 1;
  currentVisGraph.nodes[2]["level"] = 3;
  currentVisGraph.nodes[3]["level"] = 4;
  currentVisGraph.nodes[4]["level"] = 4;
  currentVisGraph.nodes[5]["level"] = 5;
  currentVisGraph.nodes[6]["level"] = 1;
  currentVisGraph.nodes[7]["level"] = 2;
  currentVisGraph.nodes[8]["level"] = 4;
  currentVisGraph.nodes[9]["level"] = 4;
  currentVisGraph.nodes[10]["level"] = 2;
  currentVisGraph.nodes[11]["level"] = 1;
  currentVisGraph.nodes[12]["level"] = 2;
  currentVisGraph.nodes[13]["level"] = 1;
  currentVisGraph.nodes[14]["level"] = 5;

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
        roundness: 0.4,
      },
    },
    layout: {
      hierarchical: {
        direction: "UD",
      },
    },
    physics: false,
  };
  network = new vis.Network(container, data, options);

  /*network.on("select", function (params) {
    document.getElementById("selection").innerText =
      "Selection: " + params.nodes;
  });*/
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
