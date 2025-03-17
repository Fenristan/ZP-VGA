var nodes = [];
var time;
var i;


var BiconnectivityGraphHistory = [];
var originalBiconnectivityGraph = null;

function drawBiconnectivity()
{
    for(var u of canvasGraphs[currentCanvasId].nodes)
    {
        if(u.color == "BLUE")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        }
        else if(u.color == "RED")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        }
        else if(u.color == "PURPLE")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=visitedNodeImage;
        }
        else if(u.color == "GREEN")
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
        }

        updateNodeInformationQuadrantIForBiconnectivity(u);
    }
    drawEdges(canvasGraphs[currentCanvasId].edges);
    //drawTreeBiconnectivity();
}

function saveBiconnectivityStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]));

    for(var node of canvasGraphCopy.nodes)
    {
        node.timeDiscovered = canvasGraphs[currentCanvasId].nodes[node.id].timeDiscovered;
        node.timeCompleted = canvasGraphs[currentCanvasId].nodes[node.id].timeCompleted;
    }

    BiconnectivityGraphHistory.push(canvasGraphCopy);
}

function resetBiconnectivity()
{
    canvasGraphs[currentCanvasId] = originalBiconnectivityGraph;

    canvasGraphs[currentCanvasId].visitedEdges = [];
    canvasGraphs[currentCanvasId].selectedNodes = [];
    for(var node of canvasGraphs[currentCanvasId].nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    for(var edge of canvasGraphs[currentCanvasId].edges)
    {
        edge.color = "black";
        edge.label = "";
    }

    drawEdges(canvasGraphs[currentCanvasId].edges);
    destroyCurrentVisNetwork();
    //clearBiconnectivityGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    BiconnectivityGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+canvasGraphs[currentCanvasId].startingNode.id).image=selectedNodeImage;
}

function doParenthesisForEdgeBetweenNodes(nodeA, nodeB)
{
    var edge = getEdgeFromNodeToNode(nodeA,nodeB);
    if(nodeA.timeDiscovered < nodeB.timeDiscovered)
    {
        if(isInTheSameTree(nodeB,nodeA))
        {
            edge.label = "F";
        }
        else
        {
            edge.label = "C";
        }
        
    }
    else if(nodeA.timeDiscovered > nodeB.timeDiscovered)
    {
        if(isInTheSameTree(nodeA,nodeB))
        {
            edge.label = "B";
        }
        else
        {
            edge.label = "C";
        }
        
    }
}

function Biconnect(v,u){
    i += 1;
    v.number = i;
    v.lowpt = v.number;
    for (var wId of adjacencyList[v.id]) {
        var w = canvasGraphs[currentCanvasId].nodes[wId];
        if(w.number == null)
        {
            var edge = getEdgeFromNodeToNode(v,w);
            canvasGraphs[currentCanvasId].edgeStack.push(edge);
            Biconnect(w,v);
            w.lowpt = Math.min(v.lowpt,w.lowpt);
            if(w.lowpt >= v.number)
            {
                var C = [];
                while(canvasGraphs[currentCanvasId].edgeStack[0].nodes[0].number >= w.number)
                {
                    var topEdge = canvasGraphs[currentCanvasId].edgeStack.shift();
                    C.push(topEdge);
                }
                C.push(edge);
                //find (v,w) in the edge stack and delete it
                var vWIndex = canvasGraphs[currentCanvasId].edgeStack.findIndex(edgeVW => edgeVW.id === edge.id);
                canvasGraphs[currentCanvasId].edgeStack.slice(vWIndex,1);

                saveBiconnectivityStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
                canvasGraphs[currentCanvasId].stepCounter++;
            }
        }
        else if((w.number < v.number) && w!=u)
        {
            var edge = getEdgeFromNodeToNode(v,w);
            canvasGraphs[currentCanvasId].edgeStack.push(edge);
            v.lowpt = Math.min(v.lowpt,w.number);
        }
    }
}

function Biconnectivity(){

    nodes = canvasGraphs[currentCanvasId].nodes.slice();

    //nodes = canvasGraphs[currentCanvasId].nodes;

    var splicedNode = nodes.splice(canvasGraphs[currentCanvasId].startingNode.id,1);
    nodes.unshift(splicedNode[0]);

    //console.log("novy order nodes je: ")
    //console.log(nodes)

    var numberOfNodes = nodes.length;
    adjacencyList = [];
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
    }

    for (var u of nodes) {
        u.number = "BLUE";
        u.lowpt = null;
    }

    for (var e of canvasGraphs[currentCanvasId].edges) {
        e.color = "black";
    }

    //canvasGraphs[currentCanvasId].edgeStack = [];
    
    //Biconnect();

    i = 0;
    canvasGraphs[currentCanvasId].edgeStack = [];

    for(var w of nodes)
    {
        if(w.number == null)
        {
            Biconnect(w,0);
        }
    }


};

async function startBiconnectivity(){

    //originalBiconnectivityGraph = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]))
    originalBiconnectivityGraph = canvasGraphs[currentCanvasId];

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    Biconnectivity();

    canvasFlags[currentCanvasId].running = true;
    
    var step = 0;
    var lastStep = BiconnectivityGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        console.log("BiconnectivityGraphHistory je nasledujici: ");
        console.log(BiconnectivityGraphHistory);

        canvasGraphs[currentCanvasId] = BiconnectivityGraphHistory[step];

        drawBiconnectivity();

        await Promise.race([createClickListenerPromise(CurrentRestartButton), /*createClickListenerPromise(LoadButton),*/ createClickListenerPromise(CurrentStepBackwardsButton), createClickListenerPromise(CurrentStepForwardButton)]);

        if(canvasFlags[currentCanvasId].stepBackwardsFlag == true)
        {
            if(step != 0)
            {
                step--;
            }
            canvasFlags[currentCanvasId].stepBackwardsFlag = false;
        }
        else if(canvasFlags[currentCanvasId].restartFlag == true)
        {
            step = 0;
            canvasFlags[currentCanvasId].restartFlag = false;
        }
        /*else if(canvasFlags[currentCanvasId].stopFlag == true)
        {
            resetBiconnectivity();
            canvasFlags[currentCanvasId].stopFlag = false;
            return 0;
        }*/
        else
        {
            if(step < lastStep-1)
            {
                step++;
                console.log("jdu delat step: "+step);
            }
        }
    }
    resetBiconnectivity();
    
    //drawEdges(canvasGraphs[currentCanvasId].edges);
    //drawTreeBiconnectivity();





}