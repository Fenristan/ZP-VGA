var nodes = [];
var time;


var DFSGraphHistory = [];
var originalDFSGraph = null;

function drawDFS()
{
    for(var u of currentCanvasGraph.nodes)
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
    drawEdges(currentCanvasGraph.edges);
    drawTreeDFS();
}

function saveDFSStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(currentCanvasGraph));

    for(var node of canvasGraphCopy.nodes)
    {
        node.timeDiscovered = currentCanvasGraph.nodes[node.id].timeDiscovered;
        node.timeCompleted = currentCanvasGraph.nodes[node.id].timeCompleted;
        node.parent = currentCanvasGraph.nodes[node.id].parent
    }

    DFSGraphHistory.push(canvasGraphCopy);
}

function resetDFS()
{
    currentCanvasGraph = originalDFSGraph;

    for(var node of currentCanvasGraph.nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    for(var edge of currentCanvasGraph.edges)
    {
        edge.color = "black";
        edge.label = "";
    }

    drawEdges(currentCanvasGraph.edges);
    destroyCurrentVisNetwork();
    clearDFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    DFSGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=selectedNodeImage;
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

    u.color = "RED";
    time += 1;
    u.timeDiscovered = time;

    saveDFSStepToHistory(currentCanvasGraph.stepCounter);
    currentCanvasGraph.stepCounter++;
            
    for (var vId of adjacencyList[u.id]) {
        var v = currentCanvasGraph.nodes[vId];
        //every time we go from this node to another, highlight it as the currently selected Node
        u.color = "RED";

        /*saveDFSStepToHistory(currentCanvasGraph.stepCounter);
        currentCanvasGraph.stepCounter++;*/
        
        if(v.color=="BLUE")
        {

            console.log("norim do: "+v.id);
            console.log("jeho color je: "+v.color);

            //highlight edge between these nodes red
            var edge = getEdgeFromNodeToNode(currentCanvasGraph.nodes[u.id], currentCanvasGraph.nodes[v.id]);
            edge.color = "red";


            u.color = "RED";
            //highlight the newly visited node as visited
            v.color = "PURPLE";
            v.parent = u;

            v.timeDiscovered = time+1;

            saveDFSStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;
            
            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            edge.color = "purple";
            DFS_visit(v);

        }
        else 
        {
            console.log(currentCanvasGraph.nodes[u.id]);
            console.log(currentCanvasGraph.nodes[v.id]);
            var edge = getEdgeFromNodeToNode(u,v);
            edge.color = "red";


            if(u.parent != null)
            {
                if(v.id != u.parent.id)
                {
                    doParenthesisForEdgeBetweenNodes(u,v);
                }
            }
            
            

            saveDFSStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;

            //currentCanvasGraph.visitedEdges.pop();

            //if this is an undirected graph, then should check if the edge leads to the parent node, if it does, make it purple again, if not, then make it black. If it isn't undirected, simply make the edge black.
            if(canvases[currentCanvasId].directed == false)
            {
                if(u.parent != null)
                {
                    if(u.parent.id == edge.nodes[1].id || u.parent.id == edge.nodes[0].id)
                    {
                        edge.color = "purple";
                    }
                    else
                    {
                        edge.color = "black";
                    }
                }
            }
            else
            {
                edge.color = "black";
            }
            
            
            
            saveDFSStepToHistory(currentCanvasGraph.stepCounter);
            currentCanvasGraph.stepCounter++;

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

    saveDFSStepToHistory(currentCanvasGraph.stepCounter);
    currentCanvasGraph.stepCounter++;

    
    
}

function DFS(){
    //currentCanvasGraph.stepCounter = 0;

    //canvasFlags[currentCanvasId].running = true;

    nodes = currentCanvasGraph.nodes.slice();

    //nodes = currentCanvasGraph.nodes;

    var splicedNode = nodes.splice(currentCanvasGraph.startingNode.id,1);
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

    for (var e of currentCanvasGraph.edges) {
        e.color = "black";
    }

    //currentCanvasGraph.startingNode.distance = 0;
    //updateNodeInformationQuadrantIForNodeInCanvas(currentCanvasGraph.startingNode);

    time = 0;

    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            DFS_visit(u);
        }
    }


};

async function startDFS(){

    //originalDFSGraph = JSON.parse(JSON.stringify(currentCanvasGraph))
    originalDFSGraph = currentCanvasGraph;

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

        currentCanvasGraph = DFSGraphHistory[step];

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
    
    //drawEdges(currentCanvasGraph.edges);
    //drawTreeDFS();





}