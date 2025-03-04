var nodes = [];
var time;
var stepCounter = 0;

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
async function DFS_visit(u,waitUntilForwardClicked,startFromStep=-1)
{
    //console.log("printing u.id: "+u.id);

    time += 1;
    u.timeDiscovered = time;
    updateNodeInformationQuadrantIForNodeInCanvas(u);
            
    u.color = "RED";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
    update=true;
    drawTreeDFS();

    if(stepCounter > startFromStep)
    {
        if(stopFlag != true)
        {
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
            stepCounter++;
        }
        else
        {
            if(stepBackwardsFlag == true)
            {
                stopFlag = false;
                stepBackwardsFlag = false;
                return stepCounter-1;
            }
            return 0;
        }
    }
    else
    {
        stepCounter++;
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

            drawTreeDFS();

            //highlight the newly visited node as visited
            //u.color = "PURPLE";
            containers[currentCanvasId].getChildByName("bmpNode_"+getNodeUsingId(v).id).image=visitedNodeImage;
            update=true;
            drawTreeDFS();

            getNodeUsingId(v).timeDiscovered = time+1;
            updateNodeInformationQuadrantIForNodeInCanvas(getNodeUsingId(v));

            //wait for the next step
            
            if(stepCounter > startFromStep)
            {
                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        stopFlag = false;
                        stepBackwardsFlag = false;
                        return stepCounter-1;
                    }
                    return 0;
                }
            }
            else
            {
                stepCounter++;
            }
            

            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=visitedNodeImage;
            update=true;
            drawEdges(canvasGraph[currentCanvasId].edges);
            drawTreeDFS();

            /*if(u.id != canvasGraph[currentCanvasId].startingNode.id && u.distance == null)
            {
                getNodeUsingId(v).distance = null;
            }
            else
            {
                getNodeUsingId(v).distance = u.distance+1;
                updateNodeInformationQuadrantIForNodeInCanvas(getNodeUsingId(v));
            }*/

            
            
            
            var result = await DFS_visit(getNodeUsingId(v),waitUntilForwardClicked,startFromStep);
            if(result == 0)
            {
                console.log("DFS has been stopped or restarted");
                return result;
            }
            else if(result > 0)
            {
                console.log("going back to previous step");
                return result;
            }
            
            if(stepCounter > startFromStep)
            {
                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        stopFlag = false;
                        stepBackwardsFlag = false;
                        return stepCounter-1;
                    }
                    return 0;
                }
            }
            else
            {
                stepCounter++;
            }
            
            
        }
        else 
        {
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[u.id]);
            canvasGraph[currentCanvasId].selectedNodes.push(canvasGraph[currentCanvasId].nodes[getNodeUsingId(v).id]);

            doParenthesisForEdgeBetweenNodes(canvasGraph[currentCanvasId].selectedNodes[0],canvasGraph[currentCanvasId].selectedNodes[1]);

            drawEdges(canvasGraph[currentCanvasId].edges);
            drawTreeDFS();
            canvasGraph[currentCanvasId].visitedEdges.pop();
            

            
            if(stepCounter > startFromStep)
            {
                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        stopFlag = false;
                        stepBackwardsFlag = false;
                        return stepCounter-1;
                    }
                    return 0;
                }
            }
            else
            {
                stepCounter++;
            }
            

            drawEdges(canvasGraph[currentCanvasId].edges);
            drawTreeDFS();
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

    
    if(stepCounter > startFromStep)
    {
        if(stopFlag != true)
        {
            await waitUntilForwardClicked;
            waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
            stepCounter++;
        }
        else
        {
            if(stepBackwardsFlag == true)
            {
                stopFlag = false;
                stepBackwardsFlag = false;
                return stepCounter-1;
            }
            return 0;
        }
    }
    else
    {
        stepCounter++;
    }
    
    
}

async function startDFS(waitUntilForwardClicked,startFromStep=-1){
    //stepCounter = 0;

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

    for (var e of canvasGraph[currentCanvasId].edges) {
        e.color = "black"
    }

    //canvasGraph[currentCanvasId].startingNode.distance = 0;
    //updateNodeInformationQuadrantIForNodeInCanvas(canvasGraph[currentCanvasId].startingNode);

    time = 0;

    drawTreeDFS();

    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            
            if(stepCounter > startFromStep)
            {
                if(stopFlag != true)
                {
                    await waitUntilForwardClicked;
                    waitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        stopFlag = false;
                        stepBackwardsFlag = false;
                        return stepCounter-1;
                    }
                    return 0;
                }
            }
            else
            {
                stepCounter++;
            }
            
            var result = await DFS_visit(u,waitUntilForwardClicked,startFromStep);

            if(result == 0)
            {
                console.log("DFS has been stopped or restarted");

                console.log("result je: "+result);
                canvasGraph[currentCanvasId].visitedEdges = [];
                canvasGraph[currentCanvasId].selectedNodes = [];
                for(var node of canvasGraph[currentCanvasId].nodes)
                {
                    containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
                }

                drawEdges(canvasGraph[currentCanvasId].edges);
                destroyCurrentVisNetwork();
                clearBFSGrid();

                disableNodeInformationQuadrantIVisibility();
            }
            else if (result > 0)
            {
                console.log("Returning one step back, to step number: "+result-3);
                canvasGraph[currentCanvasId].visitedEdges = [];
                canvasGraph[currentCanvasId].selectedNodes = [];

                for(var node of canvasGraph[currentCanvasId].nodes)
                {
                    containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
                }

                drawEdges(canvasGraph[currentCanvasId].edges);
                destroyCurrentVisNetwork();
                clearBFSGrid();

                stepCounter = 0;
                await startDFS(waitUntilForwardClicked,result-4);
            }

        }
    }

    //draw edges at the end so that the last selected edge isn't left colored as currently selected
    drawEdges(canvasGraph[currentCanvasId].edges);
    drawTreeDFS();

    if(stopFlag != true)
    {
        await createClickListenerPromise(CurrentRestartButton);
        console.log("Restart button pressed");
        stopFlag = false;
        return 0;
    }
    else
    {
        if(stepBackwardsFlag == true)
        {
            stopFlag = false;
            stepBackwardsFlag = false;
            return stepCounter-1;
        }
        return 0;
    }

    

    


    console.log(path);

    console.log(nodes);

};