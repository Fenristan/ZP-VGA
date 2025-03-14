var nodes = [];
var time;


var DFSGraphHistory = [];
var originalDFSGraph = null;

function drawDFS()
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

        updateNodeInformationQuadrantIForDFS(u);
    }
    drawEdges(canvasGraphs[currentCanvasId].edges);
    drawTreeDFS();
}

function saveDFSStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]));

    for(var node of canvasGraphCopy.nodes)
    {
        node.timeDiscovered = canvasGraphs[currentCanvasId].nodes[node.id].timeDiscovered;
        node.timeCompleted = canvasGraphs[currentCanvasId].nodes[node.id].timeCompleted;
    }

    DFSGraphHistory.push(canvasGraphCopy);
}

function resetDFS()
{
    canvasGraphs[currentCanvasId] = originalDFSGraph;

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
    clearDFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    DFSGraphHistory = [];

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

// WHITE = BLUE, GREY = PURPLE, BLACK = GREEN and RED is the one where I currently am
function DFS_visit(u)
{
    //console.log("printing u.id: "+u.id);

    time += 1;
    u.timeDiscovered = time;
            
    for (var v of adjacencyList[u.id]) {
        //every time we go from this node to another, highlight it as the currently selected Node
        u.color = "RED";

        saveDFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
        canvasGraphs[currentCanvasId].stepCounter++;
        
        if(getNodeUsingId(v).color=="BLUE")
        {

            console.log("norim do: "+getNodeUsingId(v).id);
            console.log("jeho color je: "+getNodeUsingId(v).color);

            //highlight edge between these nodes red
            var edge = getEdgeFromNodeToNode(canvasGraphs[currentCanvasId].nodes[u.id], canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);
            edge.color = "red";


            u.color = "RED";
            //highlight the newly visited node as visited
            getNodeUsingId(v).color = "PURPLE";
            getNodeUsingId(v).parent = u;

            getNodeUsingId(v).timeDiscovered = time+1;

            saveDFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            canvasGraphs[currentCanvasId].stepCounter++;
            
            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            edge.color = "purple";
            DFS_visit(getNodeUsingId(v));

        }
        else 
        {
            //canvasGraphs[currentCanvasId].selectedNodes.push(canvasGraphs[currentCanvasId].nodes[u.id]);
            //canvasGraphs[currentCanvasId].selectedNodes.push(canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);
            console.log(canvasGraphs[currentCanvasId].nodes[u.id]);
            console.log(canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);
            var edge = getEdgeFromNodeToNode(canvasGraphs[currentCanvasId].nodes[u.id],canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);
            edge.color = "red";


            doParenthesisForEdgeBetweenNodes(canvasGraphs[currentCanvasId].nodes[u.id],canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);

            saveDFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);

            //canvasGraphs[currentCanvasId].visitedEdges.pop();
            edge.color = "black";
            
            saveDFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            canvasGraphs[currentCanvasId].stepCounter++;

        }
        /*
        await thisWaitUntilForwardClicked;
        thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
        */
    }

    
    u.color = "GREEN";
    /*containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    update=true;
    drawTreeDFS();*/

    time += 1;
    u.timeCompleted = time;
    //updateNodeInformationQuadrantIForNodeInCanvas(u);

    saveDFSStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
    canvasGraphs[currentCanvasId].stepCounter++;

    
    
}

function DFS(){
    //canvasGraphs[currentCanvasId].stepCounter = 0;

    //canvasFlags[currentCanvasId].running = true;

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
    
    //var path = [];

    for (var u of nodes) {
        u.color = "BLUE";
        u.parent = null;
        //u.distance = null;
        u.timeDiscovered=null;
        u.timeCompleted=null;
    }

    for (var e of canvasGraphs[currentCanvasId].edges) {
        e.color = "black";
    }

    //canvasGraphs[currentCanvasId].startingNode.distance = 0;
    //updateNodeInformationQuadrantIForNodeInCanvas(canvasGraphs[currentCanvasId].startingNode);

    time = 0;

    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            DFS_visit(u);
        }
    }


};

async function startDFS(){

    //originalDFSGraph = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]))
    originalDFSGraph = canvasGraphs[currentCanvasId];

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    DFS();

    canvasFlags[currentCanvasId].running = true;
    
    var step = 0;
    var lastStep = DFSGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        console.log("DFSGraphHistory je nasledujici: ");
        console.log(DFSGraphHistory);

        canvasGraphs[currentCanvasId] = DFSGraphHistory[step];

        drawDFS();

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
            resetDFS();
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
    resetDFS();
    
    //drawEdges(canvasGraphs[currentCanvasId].edges);
    //drawTreeDFS();





}