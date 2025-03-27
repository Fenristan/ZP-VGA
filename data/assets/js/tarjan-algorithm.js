var nodes = [];
var time;

var tarjanGraphHistory = [];
var originalDFS_TarjanGraph = null;

function drawDFS_Tarjan()
{
    for(var u of currentCanvasGraph.nodes)
    {
        updateNodeBitmapColor(u);

        updateNodeInformationQuadrantIForDFS_Tarjan(u);
    }
    for(var edge of currentCanvasGraph.edges)
    {
        edge.changed = true;
    }
    drawEdges();
    renderTarjanGrid();
    drawTreeDFS_Tarjan();
}

function saveDFS_TarjanStepToHistory()
{

    var canvasGraphCopy = getCurrentGraphCopy();

    for(var node of canvasGraphCopy.nodes)
    {
        node.timeDiscovered = currentCanvasGraph.nodes[node.id].timeDiscovered;
        node.timeCompleted = currentCanvasGraph.nodes[node.id].timeCompleted;
        node.parent = currentCanvasGraph.nodes[node.id].parent
    }

    tarjanGraphHistory.push(canvasGraphCopy);
    currentCanvasGraph.stepCounter++;
}

function resetDFS_Tarjan()
{
    currentCanvasGraph = originalDFS_TarjanGraph;
    console.log("original");
    console.log(originalDFS_TarjanGraph);
    console.log("current");
    console.log(currentCanvasGraph);

    /*currentCanvasGraph.SCC = [];
    currentCanvasGraph.stack = [];
    for(var node of currentCanvasGraph.nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        node.lowlink = null;
        node.inComponent = null;
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
    for(var edge of currentCanvasGraph.edges)
    {
        edge.changed = true;
    }

    drawEdges();
    destroyCurrentVisNetwork();
    clearTarjanGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].runningFlag = false;

    tarjanGraphHistory = [];

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=redNodeImage;
}

// WHITE = BLUE, GREY = PURPLE, BLACK = GREEN and RED is the one where I currently am
function DFS_Tarjan_visit(u)
{

    u.color = "RED";
    time += 1;
    u.timeDiscovered = time;
    u.lowlink = time;
    u.inComponent = false;
    currentCanvasGraph.stack.push(u);

    saveDFS_TarjanStepToHistory(currentCanvasGraph.stepCounter);
    
            
    for (var vId of adjacencyList[u.id]) {
        var v = currentCanvasGraph.nodes[vId];

        /*saveDFS_TarjanStepToHistory(currentCanvasGraph.stepCounter);
        */
        
        if(v.color=="BLUE")
        {

            //highlight edge between these nodes red
            var edge = getEdgeFromNodeToNode(u, v);
            edge.color = "red";


            u.color = "RED";
            //highlight the newly visited node as visited
            v.color = "PURPLE";
            v.parent = u;

            //v.timeDiscovered = time+1;

            saveDFS_TarjanStepToHistory(currentCanvasGraph.stepCounter);
            
            
            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            edge.color = "purple";
            DFS_Tarjan_visit(v);

        }
        else 
        {

            var edge = getEdgeFromNodeToNode(u, v);
            edge.color = "red";

            doParenthesisForEdgeBetweenNodes(u,v);

            saveDFS_TarjanStepToHistory(currentCanvasGraph.stepCounter);
            

            edge.color = "black";
            
            saveDFS_TarjanStepToHistory(currentCanvasGraph.stepCounter);
            

        }

        if(v.inComponent == false)
        {
            console.log("v.lowlink: "+v.lowlink);
            u.lowlink = Math.min(u.lowlink,v.lowlink);
        }

    }

    if(u.lowlink == u.timeDiscovered)
    {
        //u.color = "ORANGE";
        var C = [];
        do
        {
            var v = currentCanvasGraph.stack.pop(); 
            v.inComponent = true;
            C.push(v); 
        }while(v != u);

        currentCanvasGraph.SCC.push(C);
        console.log("SCC: ");
        console.log(currentCanvasGraph.SCC);

        /*currentCanvasGraph.SCC = [...currentCanvasGraph.SCC, ...C];
        
        
        //console.log( currentCanvasGraph.SCC);
        for(var u of currentCanvasGraph.SCC)
        {
            console.log(u.text);
        }
        currentCanvasGraph.SCC = [];*/
    }

    
    u.color = "GREEN";
    /*containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=greenNodeImage;
    update=true;
    drawTreeDFS_Tarjan();*/

    time += 1;
    u.timeCompleted = time;
    //updateNodeInformationQuadrantIForNodeInCanvas(u);

    saveDFS_TarjanStepToHistory(currentCanvasGraph.stepCounter);
    

    
    
}

function DFS_Tarjan(){

    nodes = currentCanvasGraph.nodes.slice();

    var splicedNode = nodes.splice(currentCanvasGraph.startingNode.id,1);
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
        u.lowlink=null;
    }

    for (var e of currentCanvasGraph.edges) {
        e.color = "black";
    }

    time = 0;
    currentCanvasGraph.stack = [];
    currentCanvasGraph.SCC = [];

    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            DFS_Tarjan_visit(u);
        }
    }


};

async function startTarjan(){

    originalDFS_TarjanGraph = getCurrentGraphCopy()
    
    //originalDFS_TarjanGraph = currentCanvasGraph;

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    DFS_Tarjan();

    canvasFlags[currentCanvasId].runningFlag = true;
    
    var step = 0;
    var lastStep = tarjanGraphHistory.length;

    while(canvasFlags[currentCanvasId].stopFlag != true)
    {

        currentCanvasGraph = tarjanGraphHistory[step];

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
    
    //drawEdges();
    //drawTreeDFS_Tarjan();





}