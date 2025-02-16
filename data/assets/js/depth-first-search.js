var nodes = [];

// WHITE = BLUE, GREY = PURPLE, BLACK = GREEN
async function DFS_visit(u,waitUntilForwardClicked)
{
    //console.log("printing u.id: "+u.id);
            
    u.color = "PURPLE";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=visitedNodeImage;
    update=true;

    console.log("pausing");
    await waitUntilForwardClicked;
    waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
    console.log("unpausing");
    
    for (var v of adjacencyList[u.id]) {
        console.log("jdu z: "+u.id+" do: "+v);
        console.log(nodes);
        if(getNodeUsingId(v).color=="BLUE")
        {

            console.log("norim do: "+getNodeUsingId(v).id);
            console.log("jeho color je: "+getNodeUsingId(v).color);

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

            console.log("pausing");
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
            console.log("unpausing");
            
        }
        console.log("pausing");
        await waitUntilForwardClicked;
        waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
        console.log("unpausing");
    }


    u.color = "GREEN";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    update=true;
    
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
    }

    canvasGraph[currentCanvasId].startingNode.distance = 0;
    updateDistanceFromSourceForNodeInCanvas(canvasGraph[currentCanvasId].startingNode);

    
    
    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            console.log("pausing");
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
            console.log("unpausing");

            await DFS_visit(u,waitUntilForwardClicked);
        }
    }

    console.log(path);

    console.log(nodes);

};