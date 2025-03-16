var nodes = [];
var time;

var tarjanGraphHistory = [];
var originalDFS_TarjanGraph = null;

function drawDFS_Tarjan()
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
    renderTarjanGrid();
    //drawTreeDFS_Tarjan();
}

function saveDFS_TarjanStepToHistory()
{

    var canvasGraphCopy = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]));

    for(var node of canvasGraphCopy.nodes)
    {
        node.timeDiscovered = canvasGraphs[currentCanvasId].nodes[node.id].timeDiscovered;
        node.timeCompleted = canvasGraphs[currentCanvasId].nodes[node.id].timeCompleted;
    }

    tarjanGraphHistory.push(canvasGraphCopy);
}

function resetDFS_Tarjan()
{
    canvasGraphs[currentCanvasId] = originalDFS_TarjanGraph;

    canvasGraphs[currentCanvasId].visitedEdges = [];
    canvasGraphs[currentCanvasId].selectedNodes = [];
    canvasGraphs[currentCanvasId].SCC = [];
    canvasGraphs[currentCanvasId].stack = [];
    for(var node of canvasGraphs[currentCanvasId].nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        node.lowpt = null;
        node.inComponent = null;
    }

    for(var edge of canvasGraphs[currentCanvasId].edges)
    {
        edge.color = "black";
        edge.label = "";
    }

    drawEdges(canvasGraphs[currentCanvasId].edges);
    destroyCurrentVisNetwork();
    clearTarjanGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;

    tarjanGraphHistory = [];

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
function DFS_Tarjan_visit(u)
{

    u.color = "RED";
    time += 1;
    u.timeDiscovered = time;
    u.lowpt = time;
    u.inComponent = false;
    canvasGraphs[currentCanvasId].stack.push(u);

    saveDFS_TarjanStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
    canvasGraphs[currentCanvasId].stepCounter++;
            
    for (var vId of adjacencyList[u.id]) {
        var v = canvasGraphs[currentCanvasId].nodes[vId];

        /*saveDFS_TarjanStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
        canvasGraphs[currentCanvasId].stepCounter++;*/
        
        if(v.color=="BLUE")
        {

            //highlight edge between these nodes red
            var edge = getEdgeFromNodeToNode(u, v);
            edge.color = "red";


            u.color = "RED";
            //highlight the newly visited node as visited
            v.color = "PURPLE";
            v.parent = u;

            v.timeDiscovered = time+1;

            saveDFS_TarjanStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            canvasGraphs[currentCanvasId].stepCounter++;
            
            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            edge.color = "purple";
            DFS_Tarjan_visit(v);

        }
        else 
        {

            var edge = getEdgeFromNodeToNode(u, v);
            edge.color = "red";

            //doParenthesisForEdgeBetweenNodes(canvasGraphs[currentCanvasId].nodes[u.id],canvasGraphs[currentCanvasId].nodes[v.id]);

            saveDFS_TarjanStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            canvasGraphs[currentCanvasId].stepCounter++;

            edge.color = "black";
            
            saveDFS_TarjanStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
            canvasGraphs[currentCanvasId].stepCounter++;

        }

        if(v.inComponent == false)
        {
            console.log("v.lowpt: "+v.lowpt);
            u.lowpt = Math.min(u.lowpt,v.lowpt);
        }

    }

    if(u.lowpt == u.timeDiscovered)
    {
        var C = [];
        do
        {
            var v = canvasGraphs[currentCanvasId].stack.pop(); 
            v.inComponent = true;
            C.push(v); //possibly union instead
        }while(v != u);

        canvasGraphs[currentCanvasId].SCC.push(C);
        console.log("SCC: ");
        console.log(canvasGraphs[currentCanvasId].SCC);

        /*canvasGraphs[currentCanvasId].SCC = [...canvasGraphs[currentCanvasId].SCC, ...C];
        
        
        //console.log( canvasGraphs[currentCanvasId].SCC);
        for(var u of canvasGraphs[currentCanvasId].SCC)
        {
            console.log(u.text);
        }
        canvasGraphs[currentCanvasId].SCC = [];*/
    }

    
    u.color = "GREEN";
    /*containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    update=true;
    drawTreeDFS_Tarjan();*/

    time += 1;
    u.timeCompleted = time;
    //updateNodeInformationQuadrantIForNodeInCanvas(u);

    saveDFS_TarjanStepToHistory(canvasGraphs[currentCanvasId].stepCounter);
    canvasGraphs[currentCanvasId].stepCounter++;

    
    
}

function DFS_Tarjan(){

    nodes = canvasGraphs[currentCanvasId].nodes.slice();

    var splicedNode = nodes.splice(canvasGraphs[currentCanvasId].startingNode.id,1);
    nodes.unshift(splicedNode[0]);

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
        u.timeDiscovered=null;
        u.timeCompleted=null;
        u.inComponent=false;
        u.lowpt=null;
    }

    for (var e of canvasGraphs[currentCanvasId].edges) {
        e.color = "black";
    }

    time = 0;
    canvasGraphs[currentCanvasId].stack = [];
    canvasGraphs[currentCanvasId].SCC = [];

    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            DFS_Tarjan_visit(u);
        }
    }


};

async function startTarjan(){

    //originalDFS_TarjanGraph = JSON.parse(JSON.stringify(canvasGraphs[currentCanvasId]))
    originalDFS_TarjanGraph = canvasGraphs[currentCanvasId];

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    DFS_Tarjan();

    canvasFlags[currentCanvasId].running = true;
    
    var step = 0;
    var lastStep = tarjanGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {
        console.log("tarjanGraphHistory je nasledujici: ");
        console.log(tarjanGraphHistory);

        canvasGraphs[currentCanvasId] = tarjanGraphHistory[step];

        drawDFS_Tarjan();

        await Promise.race([createClickListenerPromise(CurrentRestartButton), createClickListenerPromise(CurrentStepBackwardsButton), createClickListenerPromise(CurrentStepForwardButton)]);

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
            resetDFS_Tarjan();
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
    resetDFS_Tarjan();
    
    //drawEdges(canvasGraphs[currentCanvasId].edges);
    //drawTreeDFS_Tarjan();





}