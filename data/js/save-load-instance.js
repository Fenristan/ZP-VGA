SaveButton.addEventListener("click", function(){
    if(currentCanvasFlags.runningFlag)
    {
        return;
    }
    saveInstanceToFile();
});

LoadButton.addEventListener("click", function(){
    //if there is a runningFlag simulation, stop it first
    //RestartButton.click();
    if(canvasFlags[currentCanvasId].runningFlag == true)
    {
        console.log("simulation was running");
        canvasFlags[currentCanvasId].stopFlag = true;
        CurrentStepForwardButton.click();
        toggleCurrentStartStopButton();
    }
    
    
    file.click();
    //console.log(document.getElementById('file').innerText);
});


file.addEventListener("change", function(){
    var reader = new FileReader();

    reader.addEventListener('load', function() {

        var fileText = this.result;
        //console.log(fileText);
        const loadedGraphParsed = JSON.parse(fileText);

        var loadedGraph = new Graph();

        Object.assign(loadedGraph,loadedGraphParsed);
        
        //update = true;
        
        //console.log(currentCanvasGraph);
        //console.log("test edges:");


        if(currentCanvasGraph.nodes.length != 0)
        {
            for(var i = currentCanvasGraph.nodes.length-1; i>=0; i--)
            {
                var node = currentCanvasGraph.nodes[i]
                var bitmap = containers[currentCanvasId].getChildByName("bmpNode_"+(node.id));
                //console.log(bitmap);
                currentCanvasGraph.removeNode(bitmap)
            }
        }
        
        
        loadedGraph.nodes.forEach(node => {
            var bitmap = new createjs.Bitmap(nodeImage);
            currentCanvasGraph.nodes.push(node);
            createNodeBitmap(node,containers[currentCanvasId],bitmap);
            //bindFunctionalityToBitmap(bitmap);

            //I make sure to check that every edge in the loaded canvas, which posesses this node, references this actual node.
            for(var i = 0; i < loadedGraph.edges.length; i++)
            {
                if(node.id===loadedGraph.edges[i].nodes[0].id)
                {
                    loadedGraph.edges[i].nodes[0]=node;
                }
                else if(node.id===loadedGraph.edges[i].nodes[1].id)
                {
                    loadedGraph.edges[i].nodes[1]=node;
                }
            }

        });


        loadedGraph.edges.forEach(edge => {

            currentCanvasGraph.addEdgeBetweenNodes(edge.nodes);
            currentCanvasGraph.edges[currentCanvasGraph.edges.length-1].weight = edge.weight;
        });
        
        updateEdgeWeights();

        //when loading an indirected graph into a directed one, transform it onto a directed one.
        if(loadedGraph.directed == false && currentCanvasGraph.directed == true)
        {
            alert("Loading undirected graph as a directed one.");
            currentCanvasGraph.transformUndirectedToDirected();
        }


    });

    reader.readAsText(file.files[0]);


    
});

function saveInstanceToFile()
{

    //if the simulation hasn't been started for the graph we are trying to save, it will not have it's nodes named and edges weighted.
    for(node of currentCanvasGraph.nodes)
    {
        currentCanvasGraph.nodes[node.id].text = document.getElementById("nodeNameText_"+currentCanvasId+"_"+node.id).innerHTML;
    }
    for(edge of currentCanvasGraph.edges)
    {
        currentCanvasGraph.edges[edge.id].weight = Number(document.getElementById("edgeWeightText_"+currentCanvasId+"_"+edge.id).innerHTML);
    }

    //add information to the saved json file, whether or not the graph was directed
    //currentCanvasGraph.directed = currentCanvasGraph.directed;

    var directedStr;
    if(currentCanvasGraph.directed)
    {
        directedStr = "directed";
    }
    else
    {
        directedStr = "undirected";
    }


    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCanvasGraph));

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minute = today.getMinutes();

    today = yyyy + '_' + mm + '_' + dd + '-' + hour + '_' + minute;

    


    var exportName = "graph"+"-"+today+"-"+directedStr;
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
}   
