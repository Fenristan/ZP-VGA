var nodes = [];
var time;
var i;


var BiconnectivityGraphHistory = [];
var originalBiconnectivityGraph = null;
var adjacencyList = [];

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
    renderBiconnectivityGrid();
    //drawTreeBiconnectivity();
}

function saveBiconnectivityStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]));

    for(var node of canvasGraphCopy.nodes)
    {
        node.lowpt = canvasGraphs[currentCanvasId].nodes[node.id].lowpt;
        node.number = canvasGraphs[currentCanvasId].nodes[node.id].number;
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
    clearBiconnectivityGrid();
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

    saveBiconnectivityStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
    canvasGraphs[currentCanvasId].stepCounter++;

    for (var wId of adjacencyList[v.id]) {
        var w = canvasGraphs[currentCanvasId].nodes[wId];
        console.log("jdu z node: "+v.text +" do node w: "+w.text);
        console.log("a w.number je: "+w.number );
        if(w.number == null)
        {
            console.log("a w.number je null, right?: "+w.number );
            var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
            canvasGraphs[currentCanvasId].edgeStack.push(edge);
            Biconnect(w,v);
            v.lowpt = Math.min(v.lowpt,w.lowpt);
            if(w.lowpt >= v.number)
            {
                var C = [];
                if(canvasGraphs[currentCanvasId].edgeStack.length != 0)
                {
                    console.log("zacinam while, length je: "+canvasGraphs[currentCanvasId].edgeStack.length);
                    while(canvasGraphs[currentCanvasId].edgeStack[(canvasGraphs[currentCanvasId].edgeStack.length-1)].nodes[0].number >= w.number)
                    {
                        var topEdge = canvasGraphs[currentCanvasId].edgeStack.pop();
                        C.push(topEdge);
    
                        console.log("length: " + canvasGraphs[currentCanvasId].edgeStack.length);
                        if(canvasGraphs[currentCanvasId].edgeStack.length == 0)
                        {
                            break;
                        }
    
                    }
                }
                
                /*while(canvasGraphs[currentCanvasId].edgeStack[0].nodes[0].number >= w.number)
                {
                    var topEdge = canvasGraphs[currentCanvasId].edgeStack.shift();
                    C.push(topEdge);
                }*/
                C.push(edge);
                canvasGraphs[currentCanvasId].components.push(C);
                //find (v,w) in the edge stack and delete it
                if(canvasGraphs[currentCanvasId].edgeStack.length != 0)
                {
                    var vWIndex = canvasGraphs[currentCanvasId].edgeStack.findIndex(edgeVW => edgeVW.id === edge.id);
                    
                    var vWEdge = canvasGraphs[currentCanvasId].edgeStack.splice(vWIndex,1)[0];


                    console.log("vWIndex: "+vWIndex);
                    console.log("vWId: "+vWEdge.id);
                    console.log("edge id: "+edge.id);
                }
                

            }
        }
        //else if((w.number < v.number) && w!=u)
        else if((w.number < v.number) && w.id!=u.id)
        {
            console.log("a w.number neni null a je mensi nez v.number: "+w.number );
            var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
            canvasGraphs[currentCanvasId].edgeStack.push(edge);
            v.lowpt = Math.min(v.lowpt,w.number);
        }
        saveBiconnectivityStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
        canvasGraphs[currentCanvasId].stepCounter++;
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
    
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
    }

    console.log("adjacency list:");
    console.log(adjacencyList);

    for (var u of nodes) {
        u.number = null;
        u.lowpt = null;
    }

    for (var e of canvasGraphs[currentCanvasId].edges) {
        e.color = "black";
    }

    //canvasGraphs[currentCanvasId].edgeStack = [];
    
    //Biconnect();

    i = 0;
    canvasGraphs[currentCanvasId].edgeStack = [];
    canvasGraphs[currentCanvasId].components = [];

    for(var w of nodes)
    {
        if(w.number == null)
        {
            Biconnect(w,0);
        }
    }

    /*saveBiconnectivityStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
    canvasGraphs[currentCanvasId].stepCounter++;*/

    console.log(canvasGraphs[currentCanvasId].components);

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