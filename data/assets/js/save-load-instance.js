SaveButton.addEventListener("click", function(){
    saveInstanceToFile();
});

LoadButton.addEventListener("click", function(){
    //if there is a running simulation, stop it first
    //RestartButton.click();
    if(canvasFlags[currentCanvasId].running == true)
    {
        console.log("simulation runnovala");
        canvasFlags[currentCanvasId].stopFlag = true;
        CurrentStepForwardButton.click();
        toggleCurrentStartStopButton();
    }
    

    //there might be a vis graph already drawn, so destroy it.
    destroyCurrentVisNetwork();
    file.click();
    console.log(document.getElementById('file').innerText);
});

/*function fromJSON(jsonString){
    var jsonObj = JSON.parse(jsonString);
    var greeter = new Greeter();
    return Object.assign(greeter, jsonObj);
}*/

file.addEventListener("change", function(){
    var reader = new FileReader();
    reader.addEventListener('load', function() {
        //document.getElementById('file').innerText = this.result;
        var fileText = this.result;
        console.log(fileText);
        const loadedGraph = JSON.parse(fileText);
        //const loadedGraph = fromJSON(fileText); 
        console.log("new canvas:");
        console.log(loadedGraph);
        console.log("old canvas:");
        console.log(currentCanvasGraph);
        //currentCanvasGraph= loadedGraph; // tady kdyžtak nezapomeň
        
        update = true;
        
        console.log(currentCanvasGraph);
        console.log("test edges:");

        //drawEdges(currentCanvasGraph.edges); //ok so basically potřebuju nějak postupně přidat nodes, pak edges mezi nima, jinak to nepůjde.

        //console.log(currentCanvasGraph);

        /*currentCanvasGraph.nodes.forEach(node => {
            console.log("mazu stare nodes");
            console.log(node);
            
            //console.log("test bitmap parent");
            //console.log(stage[currentCanvasId]);
            var bitmap = containers[currentCanvasId].getChildByName("bmpNode_"+(node.id));
            console.log(bitmap);
            removeNode(bitmap,currentCanvasGraph.nodes,currentCanvasGraph.edges)

        });*/

        if(currentCanvasGraph.nodes.length != 0)
        {
            for(var i = currentCanvasGraph.nodes.length-1; i>=0; i--)
            {
                var node = currentCanvasGraph.nodes[i]
                console.log("mazu stare nodes");
                console.log(node);
                
                //console.log("test bitmap parent");
                //console.log(stage[currentCanvasId]);
                var bitmap = containers[currentCanvasId].getChildByName("bmpNode_"+(node.id));
                console.log(bitmap);
                removeNode(bitmap,currentCanvasGraph.nodes,currentCanvasGraph.edges)
            }
        }
        
        
        loadedGraph.nodes.forEach(node => {
            console.log("pridavam node");
            console.log(node);
            
            //console.log(stage[currentCanvasId]);
            var bitmap = new createjs.Bitmap(node_image);
            currentCanvasGraph.nodes.push(node);
            addNodeToBitmap(node,containers[currentCanvasId],bitmap);
            bindFunctionalityToBitmap(node,bitmap,currentCanvasGraph.edges,currentCanvasGraph.nodes);

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
            
            //update = true;
            //stage[currentCanvasId].update(new Event("stagemousedown"));
        });

        //add edges. If the loaded graph was undirected and we are trying to load it as directed, then don't add any edges.
        if(!(loadedGraph.directed == false && canvases[currentCanvasId].directed == true))
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
        }
        


        
        
        /*for (var i = 0; i < currentCanvasGraph.nodes.length; i++) {
            bitmap = new createjs.Bitmap(node_image);
            addNodeToBitmap(currentCanvasGraph.nodes[i],containers[currentCanvasId],bitmap);
        }*/

    });
    reader.readAsText(file.files[0]);

    console.log("=======================================================loaded edges:");
    console.log(currentCanvasGraph.edges);


    

    
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

    today = dd + '_' + mm + '_' + yyyy;


    var exportName = "graph"+currentCanvasId+"-"+today;
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
}   

function loadInstanceFromFile()
{
    
}   