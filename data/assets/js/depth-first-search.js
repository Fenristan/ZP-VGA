var nodes = [];
var time;
//var canvasGraphs[currentCanvasId].stepCounter = 0;

var thisWaitUntilForwardClicked = null;

function resetDFS()
{
    canvasGraphs[currentCanvasId].visitedEdges = [];
    canvasGraphs[currentCanvasId].selectedNodes = [];
    for(var node of canvasGraphs[currentCanvasId].nodes)
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+node.id).image=nodeImage;
    }

    drawEdges(canvasGraphs[currentCanvasId].edges);
    destroyCurrentVisNetwork();
    clearDFSGrid();
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = false;
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
async function DFS_visit(u,startAfterStep=-1)
{
    //console.log("printing u.id: "+u.id);

    time += 1;
    u.timeDiscovered = time;
    updateNodeInformationQuadrantIForNodeInCanvas(u);
            
    for (var v of adjacencyList[u.id]) {
        //every time we go from this node to another, highlight it as the currently selected Node
        u.color = "RED";
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=selectedNodeImage;
        update=true;
        drawTreeDFS();

        if(canvasGraphs[currentCanvasId].stepCounter > startAfterStep)
        { console.log("canvasGraphs[currentCanvasId].stepCounter je: "+canvasGraphs[currentCanvasId].stepCounter);
            if(canvasFlags[currentCanvasId].stopFlag != true)
            {
                console.log("waiting");
                await thisWaitUntilForwardClicked;
                thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                canvasGraphs[currentCanvasId].stepCounter++;
            }
            else
            {
                if(stepBackwardsFlag == true)
                {
                    canvasFlags[currentCanvasId].stopFlag = false;
                    stepBackwardsFlag = false;
                    return canvasGraphs[currentCanvasId].stepCounter;
                }
                return 0;
            }
        }
        else
        {
            console.log("canvasGraphs[currentCanvasId].stepCounter je: "+ canvasGraphs[currentCanvasId].stepCounter + " a startAfterStep je: "+ startAfterStep + " takze skipuji krok");
            canvasGraphs[currentCanvasId].stepCounter++;
        }
        
        /*console.log("jdu z: "+u.id+" do: "+v);
        console.log(nodes);*/
        if(getNodeUsingId(v).color=="BLUE")
        {

            console.log("norim do: "+getNodeUsingId(v).id);
            console.log("jeho color je: "+getNodeUsingId(v).color);

            //highlight edge between these nodes red
            canvasGraphs[currentCanvasId].selectedNodes.push(canvasGraphs[currentCanvasId].nodes[u.id]);
            canvasGraphs[currentCanvasId].selectedNodes.push(canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);
            u.color = "RED";
            getNodeUsingId(v).color = "PURPLE";
            drawEdges(canvasGraphs[currentCanvasId].edges);

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
            
            if(canvasGraphs[currentCanvasId].stepCounter > startAfterStep)
            { console.log("canvasGraphs[currentCanvasId].stepCounter je: "+canvasGraphs[currentCanvasId].stepCounter);
                if(canvasFlags[currentCanvasId].stopFlag != true)
                {
                    console.log("waiting");
                    await thisWaitUntilForwardClicked;
                    thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    canvasGraphs[currentCanvasId].stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        canvasFlags[currentCanvasId].stopFlag = false;
                        stepBackwardsFlag = false;
                        return canvasGraphs[currentCanvasId].stepCounter;
                    }
                    return 0;
                }
            }
            else
            {
                console.log("canvasGraphs[currentCanvasId].stepCounter je: "+ canvasGraphs[currentCanvasId].stepCounter + " a startAfterStep je: "+ startAfterStep + " takze skipuji krok");
                canvasGraphs[currentCanvasId].stepCounter++;
            }
            

            //highlight the origin node as visited, draw edges again so that the currently selected edge is no longer highlighted as such.
            u.color = "PURPLE";
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=visitedNodeImage;
            update=true;
            drawEdges(canvasGraphs[currentCanvasId].edges);
            drawTreeDFS();

            /*if(u.id != canvasGraphs[currentCanvasId].startingNode.id && u.distance == null)
            {
                getNodeUsingId(v).distance = null;
            }
            else
            {
                getNodeUsingId(v).distance = u.distance+1;
                updateNodeInformationQuadrantIForNodeInCanvas(getNodeUsingId(v));
            }*/

            
            
            
            var result = await DFS_visit(getNodeUsingId(v),startAfterStep);
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
            
            /*if(canvasGraphs[currentCanvasId].stepCounter > startAfterStep)
            { console.log("canvasGraphs[currentCanvasId].stepCounter je: "+canvasGraphs[currentCanvasId].stepCounter);
                if(canvasFlags[currentCanvasId].stopFlag != true)
                {
                    await thisWaitUntilForwardClicked;
                    thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    canvasGraphs[currentCanvasId].stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        canvasFlags[currentCanvasId].stopFlag = false;
                        stepBackwardsFlag = false;
                        return canvasGraphs[currentCanvasId].stepCounter;
                    }
                    return 0;
                }
            }
            else
            {
                console.log("canvasGraphs[currentCanvasId].stepCounter je: "+ canvasGraphs[currentCanvasId].stepCounter + " a startAfterStep je: "+ startAfterStep + " takze skipuji krok");
                canvasGraphs[currentCanvasId].stepCounter++;
            }*/
            
            
        }
        else 
        {
            canvasGraphs[currentCanvasId].selectedNodes.push(canvasGraphs[currentCanvasId].nodes[u.id]);
            canvasGraphs[currentCanvasId].selectedNodes.push(canvasGraphs[currentCanvasId].nodes[getNodeUsingId(v).id]);

            doParenthesisForEdgeBetweenNodes(canvasGraphs[currentCanvasId].selectedNodes[0],canvasGraphs[currentCanvasId].selectedNodes[1]);

            drawEdges(canvasGraphs[currentCanvasId].edges);
            drawTreeDFS();
            canvasGraphs[currentCanvasId].visitedEdges.pop();
            

            
            if(canvasGraphs[currentCanvasId].stepCounter > startAfterStep)
            { console.log("canvasGraphs[currentCanvasId].stepCounter je: "+canvasGraphs[currentCanvasId].stepCounter);
                if(canvasFlags[currentCanvasId].stopFlag != true)
                {
                    await thisWaitUntilForwardClicked;
                    thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
                    canvasGraphs[currentCanvasId].stepCounter++;
                }
                else
                {
                    if(stepBackwardsFlag == true)
                    {
                        canvasFlags[currentCanvasId].stopFlag = false;
                        stepBackwardsFlag = false;
                        return canvasGraphs[currentCanvasId].stepCounter;
                    }
                    return 0;
                }
            }
            else
            {
                console.log("canvasGraphs[currentCanvasId].stepCounter je: "+ canvasGraphs[currentCanvasId].stepCounter + " a startAfterStep je: "+ startAfterStep + " takze skipuji krok");
                canvasGraphs[currentCanvasId].stepCounter++;
            }
            

            drawEdges(canvasGraphs[currentCanvasId].edges);
            drawTreeDFS();
        }
        /*
        await thisWaitUntilForwardClicked;
        thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
        */
    }

    
    u.color = "GREEN";
    containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=completedNodeImage;
    update=true;
    drawTreeDFS();

    time += 1;
    u.timeCompleted = time;
    updateNodeInformationQuadrantIForNodeInCanvas(u);

    if(canvasGraphs[currentCanvasId].stepCounter > startAfterStep)
    { console.log("canvasGraphs[currentCanvasId].stepCounter je: "+canvasGraphs[currentCanvasId].stepCounter);
        if(canvasFlags[currentCanvasId].stopFlag != true)
        {
            await thisWaitUntilForwardClicked;
            thisWaitUntilForwardClicked=createClickListenerPromise(CurrentStepForwardButton);
            canvasGraphs[currentCanvasId].stepCounter++;
        }
        else
        {
            if(stepBackwardsFlag == true)
            {
                canvasFlags[currentCanvasId].stopFlag = false;
                stepBackwardsFlag = false;
                return canvasGraphs[currentCanvasId].stepCounter;
            }
            return 0;
        }
    }
    else
    {
        console.log("canvasGraphs[currentCanvasId].stepCounter je: "+ canvasGraphs[currentCanvasId].stepCounter + " a startAfterStep je: "+ startAfterStep + " takze skipuji krok");
        canvasGraphs[currentCanvasId].stepCounter++;
    }

    
    
}

async function startDFS(waitUntilForwardClicked,startAfterStep=-1){
    //canvasGraphs[currentCanvasId].stepCounter = 0;

    canvasFlags[currentCanvasId].running = true;

    toggleNodeInformationQuadrantIVisibility();
    showCurrentVisNetwork();

    thisWaitUntilForwardClicked = waitUntilForwardClicked;



    nodes = canvasGraphs[currentCanvasId].nodes.slice();
    //var spliced = nodes.splice(canvasGraphs[currentCanvasId].startingNode.id)
    //spliced.reverse().forEach((node) => nodes.unshift(node));

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
        e.color = "black"
    }

    //canvasGraphs[currentCanvasId].startingNode.distance = 0;
    //updateNodeInformationQuadrantIForNodeInCanvas(canvasGraphs[currentCanvasId].startingNode);

    time = 0;

    drawTreeDFS();

    for (var u of nodes) {
        if(u.color == "BLUE")
        {
            var result = await DFS_visit(u,startAfterStep);

            if(result == 0)
            {
                console.log("DFS has been stopped or restarted");

                resetDFS();
                
                if(canvasFlags[currentCanvasId].restartFlag == true)
                {
                    console.log("canvasFlags[currentCanvasId].restartFlag byl pressed");
                    canvasFlags[currentCanvasId].restartFlag = false;
                    canvasFlags[currentCanvasId].stopFlag = false;
                    await startDFS(waitUntilForwardClicked);
                }

                disableNodeInformationQuadrantIVisibility();
                return 0;
            }
            else if (result > 0)
            {
                //result -1 because I start at step 0, -1 because canvasGraphs[currentCanvasId].stepCounter > startAfterStep, -2 because I don't want to start at the same step that I am currently at, but the step before
                console.log("Current step is: "+canvasGraphs[currentCanvasId].stepCounter + "Returning one step back, to step number: "+(result-4));
                resetDFS();
                await startDFS(waitUntilForwardClicked,result-4);

                return 0;
            }

            //canvasGraphs[currentCanvasId].stepCounter--;

        }
    }

    //draw edges at the end so that the last selected edge isn't left colored as currently selected
    drawEdges(canvasGraphs[currentCanvasId].edges);
    drawTreeDFS();

    if(canvasFlags[currentCanvasId].stopFlag != true)
    {
        await Promise.race([createClickListenerPromise(CurrentRestartButton), createClickListenerPromise(CurrentStartStopButton), createClickListenerPromise(LoadButton), createClickListenerPromise(CurrentStepBackwardsButton)]);
        console.log("Restart or stop button or backwards button pressed");

        var lastStep = canvasGraphs[currentCanvasId].stepCounter;

        resetDFS();

        if(stepBackwardsFlag == true)
        {
            console.log("starting new simulation from next to last step");
            canvasFlags[currentCanvasId].stopFlag = false;
            stepBackwardsFlag = false;
            await startDFS(waitUntilForwardClicked,lastStep-4);
        }
        else if(canvasFlags[currentCanvasId].restartFlag == true)
        {
            canvasFlags[currentCanvasId].stopFlag = false;
            canvasFlags[currentCanvasId].restartFlag = false;

            await startDFS(waitUntilForwardClicked);
        }
        else if(canvasFlags[currentCanvasId].stopFlag == true)
        {
            return 0;
        }
        
        return 0;
    }
    /*else
    {
        if(stepBackwardsFlag == true)
        {
            canvasFlags[currentCanvasId].stopFlag = false;
            stepBackwardsFlag = false;
            return canvasGraphs[currentCanvasId].stepCounter;
        }
        return 0;
    }*/

    

    


    //console.log(path);

    console.log(nodes);

};