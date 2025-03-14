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
        const loadedCanvas = JSON.parse(fileText);
        //const loadedCanvas = fromJSON(fileText); 
        console.log("new canvas:");
        console.log(loadedCanvas);
        console.log("old canvas:");
        console.log(canvasGraphs[currentCanvasId]);
        //canvasGraphs[currentCanvasId]= loadedCanvas; // tady kdyžtak nezapomeň
        
        update = true;
        
        console.log(canvasGraphs[currentCanvasId]);
        console.log("test edges:");

        //drawEdges(canvasGraphs[currentCanvasId].edges); //ok so basically potřebuju nějak postupně přidat nodes, pak edges mezi nima, jinak to nepůjde.

        //console.log(canvasGraphs[currentCanvasId]);

        /*canvasGraphs[currentCanvasId].nodes.forEach(node => {
            console.log("mazu stare nodes");
            console.log(node);
            
            //console.log("test bitmap parent");
            //console.log(stage[currentCanvasId]);
            var bitmap = containers[currentCanvasId].getChildByName("bmpNode_"+(node.id));
            console.log(bitmap);
            removeNode(bitmap,canvasGraphs[currentCanvasId].nodes,canvasGraphs[currentCanvasId].edges)

        });*/

        for(var i = canvasGraphs[currentCanvasId].nodes.length-1; i>=0; i--)
        {
            var node = canvasGraphs[currentCanvasId].nodes[i]
            console.log("mazu stare nodes");
            console.log(node);
            
            //console.log("test bitmap parent");
            //console.log(stage[currentCanvasId]);
            var bitmap = containers[currentCanvasId].getChildByName("bmpNode_"+(node.id));
            console.log(bitmap);
            removeNode(bitmap,canvasGraphs[currentCanvasId].nodes,canvasGraphs[currentCanvasId].edges)
        }
        
        loadedCanvas.nodes.forEach(node => {
            console.log("pridavam node");
            console.log(node);
            
            //console.log(stage[currentCanvasId]);
            var bitmap = new createjs.Bitmap(node_image);
            canvasGraphs[currentCanvasId].nodes.push(node);
            addNodeToBitmap(node,containers[currentCanvasId],bitmap);
            bindFunctionalityToBitmap(node,bitmap,canvasGraphs[currentCanvasId].edges,canvasGraphs[currentCanvasId].nodes);

            //I make sure to check that every edge in the loaded canvas, which posesses this node, references this actual node.
            for(var i = 0; i < loadedCanvas.edges.length; i++)
            {
                if(node.id===loadedCanvas.edges[i].nodes[0].id)
                {
                    loadedCanvas.edges[i].nodes[0]=node;
                }
                else if(node.id===loadedCanvas.edges[i].nodes[1].id)
                {
                    loadedCanvas.edges[i].nodes[1]=node;
                }
            }
            
            //update = true;
            //stage[currentCanvasId].update(new Event("stagemousedown"));
        });
        loadedCanvas.edges.forEach(edge => {
            console.log("pridavam edge");
            console.log(edge);
            
            addEdgeBetweenNodes(edge.nodes,canvasGraphs[currentCanvasId].edges);
            //update = true;
            //stage[currentCanvasId].update(new Event("stagemousedown"));
        });

        
        
        /*for (var i = 0; i < canvasGraphs[currentCanvasId].nodes.length; i++) {
            bitmap = new createjs.Bitmap(node_image);
            addNodeToBitmap(canvasGraphs[currentCanvasId].nodes[i],containers[currentCanvasId],bitmap);
        }*/

    });
    reader.readAsText(file.files[0]);

    console.log("=======================================================loaded edges:");
    console.log(canvasGraphs[currentCanvasId].edges);


    

    
});

function saveInstanceToFile()
{
    /*let currentNodes = canvasGraphs[currentCanvasId].nodes;
    let currentEdges = canvasGraphs[currentCanvasId].edges;
    for(var i=0; i < currentNodes.length; i++)
    {
        console.log(JSON.stringify(currentNodes[i]));
    }
    for(var i=0; i < currentEdges.length; i++)
    {
        console.log(JSON.stringify(currentEdges[i]));
    }*/

    
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(canvasGraphs[currentCanvasId]));

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '_' + dd + '_' + yyyy;


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