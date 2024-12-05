SaveButton.addEventListener("click", function(){
    saveInstanceToFile();
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