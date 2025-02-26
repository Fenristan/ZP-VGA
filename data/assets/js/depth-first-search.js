var nodes = [];
var time;
// WHITE = BLUE, GREY = PURPLE, BLACK = GREEN and RED is the one where I currently am
async function DFS_visit(u,waitUntilForwardClicked)
{
    //console.log("printing u.id: "+u.id);

    time += 1;
    u.timeDiscovered = time;
    updateNodeInformationQuadrantIForNodeInCanvas(u);
            
    u.color = "RED";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
    update=true;
    drawTreeDFS();

    if(stopFlag != true)
    {
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
    }
    
    
    for (var v of adjacencyList[u.id]) {

        //every time we go from this node to another, highlight it as the currently selected Node
        u.color = "RED";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        update=true;
        drawTreeDFS();
        
        console.log("jdu z: "+u.id+" do: "+v);
        console.log(nodes);
        if(getNodeUsingId(v).color=="BLUE")
        {

            console.log("norim do: "+getNodeUsingId(v).id);
            console.log("jeho color je: "+getNodeUsingId(v).color);

            //highlight edge between these nodes red
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[u.id]);
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[getNodeUsingId(v).id]);
            u.color = "RED";
            getNodeUsingId(v).color = "PURPLE";
            drawEdges(canvasGraph[currentCanvasId].edges);

            getNodeUsingId(v).parent = u;

            //drawTreeDFS();

            //highlight the newly visited node as visited
            //u.color = "PURPLE";
            containers[currentCanvasId].getChildByName("bmpNode_"+getNodeUsingId(v).id).image=visitedNodeImage;
            update=true;
            drawTreeDFS();

            getNodeUsingId(v).timeDiscovered = time+1;
            updateNodeInformationQuadrantIForNodeInCanvas(getNodeUsingId(v));

            //wait for the next step
            
            if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                }
            

            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=visitedNodeImage;
            update=true;
            drawEdges(canvasGraph[currentCanvasId].edges);
            

            if(u.id != canvasGraph[currentCanvasId].startingNode.id && u.distance == null)
            {
                getNodeUsingId(v).distance = null;
            }
            else
            {
                getNodeUsingId(v).distance = u.distance+1;
                updateNodeInformationQuadrantIForNodeInCanvas(getNodeUsingId(v));
            }

            
            drawTreeDFS();
            
            await DFS_visit(getNodeUsingId(v),waitUntilForwardClicked);

            
            if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                }
            
            
        }
        else
        {
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[u.id]);
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[getNodeUsingId(v).id]);
            drawEdges(canvasGraph[currentCanvasId].edges);
            //update = true;
            canvasGraph[currentCanvasId].visitedEdges.pop();
            drawTreeDFS();

            
            if(stopFlag != true)
            {
                await waitUntilForwardClicked;
                waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
            }
            

            
            drawEdges(canvasGraph[currentCanvasId].edges);
            
        }
        /*
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
        */
    }


    u.color = "GREEN";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    update=true;
    drawTreeDFS();

    time += 1;
    u.timeCompleted = time;
    updateNodeInformationQuadrantIForNodeInCanvas(u);

    
    if(stopFlag != true)
    {
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
    }
    
    
}

async function startDFS(waitUntilForwardClicked){
    nodes = canvasGraph[currentCanvasId].nodes.slice();
    //var spliced = nodes.splice(canvasGraph[currentCanvasId].startingNode.id)
    //spliced.reverse().forEach((node) => nodes.unshift(node));

    var splicedNode = nodes.splice(canvasGraph[currentCanvasId].startingNode.id,1);
    console.log("splcied node je: ");
    console.log(splicedNode);


    nodes.unshift(splicedNode[0]);

    console.log("novy order nodes je: ")
    console.log(nodes)

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
    
    var path = [];

    for (var u of nodes) {
        u.color = "BLUE";
        u.parent = null;
        //u.distance = null;
        //updateNodeInformationQuadrantIForNodeInCanvas(u)
    }

    //canvasGraph[currentCanvasId].startingNode.distance = 0;
    //updateNodeInformationQuadrantIForNodeInCanvas(canvasGraph[currentCanvasId].startingNode);

    time = 0;
    
    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            
            if(stopFlag != true)
            {
                await waitUntilForwardClicked;
                waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
            }
            

            await DFS_visit(u,waitUntilForwardClicked);
        }
    }

    if(stopFlag == true)
    {
        canvasGraph[currentCanvasId].visitedEdges = [];
        for(var u of canvasGraph[currentCanvasId].nodes)
        {
            u.color = "BLUE";
            u.timeDiscovered = null;
            u.timeCompleted = null;
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
        }
        
        clearNodeInformationQuadrantIText();
        disableNodeInformationQuadrantIVisibility();
        stopFlag = false;
    }

    //draw edges at the end so that the last selected edge isn't left colored as currently selected
    drawEdges(canvasGraph[currentCanvasId].edges);
    drawTreeDFS();

    


    console.log(path);

    console.log(nodes);

};