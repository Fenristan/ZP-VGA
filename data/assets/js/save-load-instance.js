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
        const loadedGraph = JSON.parse(fileText);
        
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
                removeNode(bitmap)
            }
        }
        
        
        loadedGraph.nodes.forEach(node => {
            var bitmap = new createjs.Bitmap(node_image);
            currentCanvasGraph.nodes.push(node);
            createNodeBitmap(node,containers[currentCanvasId],bitmap);
            bindFunctionalityToBitmap(bitmap);

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

        //add edges. If the loaded graph was undirected and we are trying to load it as directed, then don't add any edges.
        /*if(!(loadedGraph.directed == false && canvases[currentCanvasId].directed == true))
        {
            loadedGraph.edges.forEach(edge => {
                console.log("pridavam edge");
                console.log(edge);
                
                addEdgeBetweenNodes(edge.nodes,currentCanvasGraph.edges);
                currentCanvasGraph.edges[currentCanvasGraph.edges.length-1].weight = edge.weight;
            });
            
            updateEdgeWeights();
        }
        else
        {
            alert("You have tried to load an undirected graph as a directed one. Nodes will be loaded, but the edges will not.");
        }*/
        
        //if(loadedGraph.directed == canvases[currentCanvasId].directed)
        //{
        loadedGraph.edges.forEach(edge => {
            //console.log("pridavam edge");
            //console.log(edge);
            
            addEdgeBetweenNodes(edge.nodes);
            currentCanvasGraph.edges[currentCanvasGraph.edges.length-1].weight = edge.weight;
        });
        
        updateEdgeWeights();
        //}
        /*if(loadedGraph.directed == true && canvases[currentCanvasId].directed == false)
        {
            transformDirectedToUndirected();
        }
        else */
        //when loading an indirected graph into a directed one, transform it onto a directed one.
        if(loadedGraph.directed == false && canvases[currentCanvasId].directed == true)
        {
            alert("Loading undirected graph as a directed one.");
            transformUndirectedToDirected();
        }


        
        
        /*for (var i = 0; i < currentCanvasGraph.nodes.length; i++) {
            bitmap = new createjs.Bitmap(node_image);
            addNodeToBitmap(currentCanvasGraph.nodes[i],containers[currentCanvasId],bitmap);
        }*/

    });

    reader.readAsText(file.files[0]);


    
});

function saveInstanceToFile()
{
    /*let currentNodes = currentCanvasGraph.nodes;
    let currentEdges = currentCanvasGraph.edges;
    for(var i=0; i < currentNodes.length; i++)
    {
        console.log(JSON.stringify(currentNodes[i]));
    }
    for(var i=0; i < currentEdges.length; i++)
    {
        console.log(JSON.stringify(currentEdges[i]));
    }*/

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
    currentCanvasGraph.directed = canvases[currentCanvasId].directed;
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCanvasGraph));

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minute = today.getMinutes();

    today = yyyy + '_' + mm + '_' + dd + '-' + hour + '_' + minute;


    var exportName = "graph"+"-"+today;
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
}   
