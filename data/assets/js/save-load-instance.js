SaveButton.addEventListener("click", function(){
    saveInstanceToFile();
});

LoadButton.addEventListener("click", function(){
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
        console.log(loadedCanvas);
        console.log("old canvas:");
        console.log(canvasStorages[currentCanvasId]);
        //canvasStorages[currentCanvasId]= loadedCanvas; // tady kdyžtak nezapomeň
        
        update = true;
        console.log("new canvas:");
        console.log(canvasStorages[currentCanvasId]);
        console.log("test edges:");

        //drawEdges(canvasStorages[currentCanvasId].edges); //ok so basically potřebuju nějak postupně přidat nodes, pak edges mezi nima, jinak to nepůjde.

        //console.log(canvasStorages[currentCanvasId]);

        /*canvasStorages[currentCanvasId].nodes.forEach(node => {
            console.log("mazu stare nodes");
            console.log(node);
            
            //console.log("test bitmap parent");
            //console.log(stage[currentCanvasId]);
            var bitmap = containers[currentCanvasId].getChildByName("bmp_"+(node.id));
            console.log(bitmap);
            removeNode(bitmap,canvasStorages[currentCanvasId].nodes,canvasStorages[currentCanvasId].edges)

        });*/

        for(var i = canvasStorages[currentCanvasId].nodes.length-1; i>=0; i--)
        {
            var node = canvasStorages[currentCanvasId].nodes[i]
            console.log("mazu stare nodes");
            console.log(node);
            
            //console.log("test bitmap parent");
            //console.log(stage[currentCanvasId]);
            var bitmap = containers[currentCanvasId].getChildByName("bmp_"+(node.id));
            console.log(bitmap);
            removeNode(bitmap,canvasStorages[currentCanvasId].nodes,canvasStorages[currentCanvasId].edges)
        }
        
        loadedCanvas.nodes.forEach(node => {
            console.log("pridavam node");
            console.log(node);
            
            //console.log(stage[currentCanvasId]);
            var bitmap = new createjs.Bitmap(node_image);
            canvasStorages[currentCanvasId].nodes.push(node);
            addNodeToBitmap(node,containers[currentCanvasId],bitmap);
            bindFunctionalityToBitmap(node,bitmap,canvasStorages[currentCanvasId].edges,canvasStorages[currentCanvasId].nodes);
            //update = true;
            //stage[currentCanvasId].update(new Event("stagemousedown"));
        });
        loadedCanvas.edges.forEach(edge => {
            console.log("pridavam edge");
            console.log(edge);
            
            addEdgeBetweenNodes(edge.nodes,canvasStorages[currentCanvasId].edges);
            //update = true;
            //stage[currentCanvasId].update(new Event("stagemousedown"));
        });
        update = true;
        /*for (var i = 0; i < canvasStorages[currentCanvasId].nodes.length; i++) {
            bitmap = new createjs.Bitmap(node_image);
            addNodeToBitmap(canvasStorages[currentCanvasId].nodes[i],containers[currentCanvasId],bitmap);
        }*/

    });
    reader.readAsText(file.files[0]);
    
});

function saveInstanceToFile()
{
    /*let currentNodes = canvasStorages[currentCanvasId].nodes;
    let currentEdges = canvasStorages[currentCanvasId].edges;
    for(var i=0; i < currentNodes.length; i++)
    {
        console.log(JSON.stringify(currentNodes[i]));
    }
    for(var i=0; i < currentEdges.length; i++)
    {
        console.log(JSON.stringify(currentEdges[i]));
    }*/

    
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(canvasStorages[currentCanvasId]));

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