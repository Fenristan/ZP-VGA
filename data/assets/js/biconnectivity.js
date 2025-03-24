var nodes = [];
var time;
var i;


var BiconnectivityGraphHistory = [];
var originalBiconnectivityGraph = null;
var adjacencyList = [];

function drawBiconnectivity()
{
    for(var u of currentCanvasGraph.nodes)
    {
        updateNodeBitmapColor(u);

        updateNodeInformationQuadrantIForBiconnectivity(u);
    }
    drawEdges();
    //renderBiconnectivityGrid();
    drawTreeBiconnectivity();
}

function saveBiconnectivityStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(currentCanvasGraph));

    for(var node of canvasGraphCopy.nodes)
    {
        node.lowpt = currentCanvasGraph.nodes[node.id].lowpt;
        node.number = currentCanvasGraph.nodes[node.id].number;
    }

    BiconnectivityGraphHistory.push(canvasGraphCopy);
}

function resetBiconnectivity()
{
    currentCanvasGraph = originalBiconnectivityGraph;

    /*for(var node of currentCanvasGraph.nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        node.color = "BLUE";
    }

    for(var edge of currentCanvasGraph.edges)
    {
        edge.color = "black";
        edge.label = "";
    }*/

    for(var u of currentCanvasGraph.nodes)
    {
        updateNodeBitmapColor(u);
    }    

    drawEdges();
    destroyCurrentVisNetwork();
    clearBiconnectivityGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].runningFlag = false;

    BiconnectivityGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=redNodeImage;
}

function doParenthesisForEdgeBetweenNodesBiconnectivity(nodeA, nodeB)
{
    var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(nodeA,nodeB);
    if(nodeA.number < nodeB.number)
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
    else if(nodeA.number > nodeB.number)
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

    v.color = "RED";
    i += 1;
    v.number = i;
    v.lowpt = v.number;

    saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
    currentCanvasGraph.stepCounter++;

    

    for (var wId of adjacencyList[v.id]) {
        var w = currentCanvasGraph.nodes[wId];

        var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
        edge.color = "red";

        if(w.number == null)
        {
            edge.color = "red";
            if(v.color != "ORANGE")
            {
                v.color = "RED";
            }
            w.color = "PURPLE";
            w.parent = v;

            saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;

            if(v.color != "ORANGE")
            {
                v.color = "PURPLE";
            }
            
            edge.color = "purple";

            currentCanvasGraph.edgeStack.push(edge);
            
            Biconnect(w,v);
            v.lowpt = Math.min(v.lowpt,w.lowpt);

            if(w.lowpt >= v.number)
            {
                //v.articulation = true;
                v.color = "ORANGE";
                var C = [];
                if(currentCanvasGraph.edgeStack.length != 0)
                {
                    while(currentCanvasGraph.edgeStack[(currentCanvasGraph.edgeStack.length-1)].nodes[0].number >= w.number)
                    {
                        var topEdge = currentCanvasGraph.edgeStack.pop();
                        C.push(topEdge);
    
                        if(currentCanvasGraph.edgeStack.length == 0)
                        {
                            break;
                        }
    
                    }
                }

                C.push(edge);
                currentCanvasGraph.components.push(C);
                //find (v,w) in the edge stack and delete it
                if(currentCanvasGraph.edgeStack.length != 0)
                {
                    var vWIndex = currentCanvasGraph.edgeStack.findIndex(edgeVW => edgeVW.id === edge.id);
                    
                    currentCanvasGraph.edgeStack.splice(vWIndex,1)[0];

                }

                saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
                currentCanvasGraph.stepCounter++;
                

            }
            if(w.lowpt > v.number)
            {
                edge.color = "red";

                saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
                currentCanvasGraph.stepCounter++;

                edge.color = "orange";
                saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
                currentCanvasGraph.stepCounter++;
            }
            
        }
        //else if((w.number < v.number) && w!=u)
        else if((w.number < v.number) && w.id!=u.id)
        {
            var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
            currentCanvasGraph.edgeStack.push(edge);
            v.lowpt = Math.min(v.lowpt,w.number);

            doParenthesisForEdgeBetweenNodesBiconnectivity(v,w);

            edge.color = "red";

            //doParenthesisForEdgeBetweenNodes(currentCanvasGraph.nodes[u.id],currentCanvasGraph.nodes[getNodeUsingId(v).id]);

            saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;


            edge.color = "black";
            
            saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;
        }
        else
        {
            edge.color = "red";

            saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;

            if(u.id == edge.nodes[1].id)
            {
                edge.color = "purple";
            }
            else
            {
                edge.color = "black";
            }

            //edge.color = "purple";
            
            saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;
        }
        /*else
        {
            var edge = getEdgeFromNodeToNodeUndirectedOrderMatters(v,w);
            edge.color = "red";

            //doParenthesisForEdgeBetweenNodes(currentCanvasGraph.nodes[u.id],currentCanvasGraph.nodes[getNodeUsingId(v).id]);

            saveDFSStepToHistory(currentCanvasGraph.stepCounter);

            currentCanvasGraph.stepCounter++;
            if(u.id == edge.nodes[1].id)
            {
                edge.color = "purple";
            }
            else
            {
                edge.color = "black";
            }

            saveDFSStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;
        }*/

        //saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
        //currentCanvasGraph.stepCounter++;
    }

    if(v.color != "ORANGE")
    {
        v.color = "GREEN";
    }
    
    saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
    currentCanvasGraph.stepCounter++;
    
}

function Biconnectivity(){

    nodes = currentCanvasGraph.nodes.slice();


    var splicedNode = nodes.splice(currentCanvasGraph.startingNode.id,1);
    nodes.unshift(splicedNode[0]);

    var numberOfNodes = nodes.length;
    
    if(canvases[currentCanvasId].directed == false)
    {
        adjacencyList = convertToAdjacencyListUndirected(numberOfNodes);
    }
    else
    {
        adjacencyList = convertToAdjacencyListDirected(numberOfNodes);
    }


    for (var u of nodes) {
        u.number = null;
        u.lowpt = null;
        u.parent = null;
    }

    for (var e of currentCanvasGraph.edges) {
        e.color = "black";
    }

    //currentCanvasGraph.edgeStack = [];
    
    //Biconnect();

    i = 0;
    currentCanvasGraph.edgeStack = [];
    currentCanvasGraph.components = [];

    for(var w of nodes)
    {
        if(w.number == null)
        {
            Biconnect(w,0);
        }
    }

    saveBiconnectivityStepToHistory(currentCanvasGraph.stepCounter);
    currentCanvasGraph.stepCounter++;


};

async function startBiconnectivity(){

    originalBiconnectivityGraph = JSON.parse(JSON.stringify(currentCanvasGraph));
    //originalBiconnectivityGraph = currentCanvasGraph;

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    Biconnectivity();

    canvasFlags[currentCanvasId].runningFlag = true;
    
    var step = 0;
    var lastStep = BiconnectivityGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {

        currentCanvasGraph = BiconnectivityGraphHistory[step];

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
            }
        }
    }
    resetBiconnectivity();
    
    //drawEdges(currentCanvasGraph.edges);
    //drawTreeBiconnectivity();





}