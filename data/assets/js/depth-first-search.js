var nodes = [];

// WHITE = BLUE, GREY = PURPLE, BLACK = GREEN
async function DFS_visit(u,waitUntilForwardClicked)
{
    //console.log("printing u.id: "+u.id);
            
    u.color = "PURPLE";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
    update=true;

    if(stopFlag != true)
    {
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
    }
    
    
    for (var v of adjacencyList[u.id]) {

        //every time we go from this node to another, highlight it as the currently selected Node
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        update=true;
        
        console.log("jdu z: "+u.id+" do: "+v);
        console.log(nodes);
        if(getNodeUsingId(v).color=="BLUE")
        {

            console.log("norim do: "+getNodeUsingId(v).id);
            console.log("jeho color je: "+getNodeUsingId(v).color);

            //highlight edge between these nodes red
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[u.id]);
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[getNodeUsingId(v).id]);
            drawEdges(canvasGraph[currentCanvasId].edges);

            //highlight the newly visited node as visited
            containers[currentCanvasId].getChildByName("bmpNode_"+getNodeUsingId(v).id).image=visitedNodeImage;
            update=true;

            //wait for the next step
            
            if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
                }
            

            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
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
                updateDistanceFromSourceForNodeInCanvas(getNodeUsingId(v));
            }

            await DFS_visit(getNodeUsingId(v),waitUntilForwardClicked);

            
            if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
                }
            
            
        }
        else
        {
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[u.id]);
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[getNodeUsingId(v).id]);
            drawEdges(canvasGraph[currentCanvasId].edges);
            //update = true;
            canvasGraph[currentCanvasId].visitedEdges.pop();

            
            if(stopFlag != true)
            {
                await waitUntilForwardClicked;
                waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
            }
            

            
            drawEdges(canvasGraph[currentCanvasId].edges);
            
        }
        /*
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
        */
    }


    u.color = "GREEN";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    update=true;

    
    if(stopFlag != true)
    {
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
    }
    
    
}

async function startDFS(waitUntilForwardClicked){
    nodes = canvasGraph[currentCanvasId].nodes.slice();
    var spliced = nodes.splice(canvasGraph[currentCanvasId].startingNode.id)
    spliced.reverse().forEach((node) => nodes.unshift(node));

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
        u.distance = null;
        updateDistanceFromSourceForNodeInCanvas(u)
    }

    canvasGraph[currentCanvasId].startingNode.distance = 0;
    updateDistanceFromSourceForNodeInCanvas(canvasGraph[currentCanvasId].startingNode);

    
    
    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            
            if(stopFlag != true)
            {
                await waitUntilForwardClicked;
                waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
            }
            

            await DFS_visit(u,waitUntilForwardClicked);
        }
    }

    if(stopFlag == true)
    {
        canvasGraph[currentCanvasId].visitedEdges = [];
        for(var node of canvasGraph[currentCanvasId].nodes)
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
        }
        disableDistancesFromSourceVisibility();
        stopFlag = false;
    }

    //draw edges at the end so that the last selected edge isn't left colored as currently selected
    drawEdges(canvasGraph[currentCanvasId].edges);

    


    console.log(path);

    console.log(nodes);

};