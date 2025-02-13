
// WHITE = BLUE, GREY = PURPLE, BLACK = GREEN
async function DFS_visit(u,waitUntilForwardClicked)
{

            
    u.color = "PURPLE";
    containers[currentCanvasId].getChildByName("bmp_"+u.id).image=visitedNodeImage;
    update=true;

    console.log("pausing");
    await waitUntilForwardClicked;
    waitUntilForwardClicked=createClickListenerPromise(StepForwardButton);
    console.log("unpausing");
    
    for (var v of adjacencyList[u.id]) {
        console.log("jdu z: "+u.id+" do: "+v);
        if(canvasStorages[currentCanvasId].nodes[v].color=="BLUE")
        {

            console.log("norim do: "+canvasStorages[currentCanvasId].nodes[v].id);
            console.log("jeho color je: "+canvasStorages[currentCanvasId].nodes[v].color);

            await DFS_visit(canvasStorages[currentCanvasId].nodes[v],waitUntilForwardClicked);

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
    containers[currentCanvasId].getChildByName("bmp_"+u.id).image=completedNodeImage;
    update=true;
    
}

async function startDFS(waitUntilForwardClicked){
    var numberOfNodes = canvasStorages[currentCanvasId].nodes.length;
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

    for (var u of canvasStorages[currentCanvasId].nodes) {
        u.color = "BLUE";
    }

    for (var u of canvasStorages[currentCanvasId].nodes) {
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

};