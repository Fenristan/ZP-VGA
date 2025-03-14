var grids = [];

for(canvas in canvases)
{
    grids.push(null);
}

function renderBFSGrid()
{
    var gridVisitedData = [];
    var gridQueueData = [];

    for(var u of canvasGraphs[currentCanvasId].nodes)
    {
        if(u.color == "BLUE")
        {
            gridVisitedData.push([u.text,"F"]);
        }
        else
        {
            gridVisitedData.push([u.text,"T"]);
        }
    }

    for(var u of canvasGraphs[currentCanvasId].queue)
    {
        gridQueueData.push([u.text]);
    }

    if(grids[currentCanvasId] == null)
    {
        grids[currentCanvasId] = [];

        var newVisitedGrid = new gridjs.Grid({
            columns: [
                { 
                  name: 'Visited',
                  columns: [{
                    name: 'Name'
                  }, {
                    name: 'Visited'
                  }]
                },
            ],
            data: gridVisitedData
        }).render(document.getElementById("sidebarVisitedGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newVisitedGrid);

        var newQueueGrid = new gridjs.Grid({
            columns: ['Queue'],
            data: gridQueueData
        }).render(document.getElementById("sidebarQueueGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newQueueGrid);
    }
    else
    {
        // BFS has two grids
        grids[currentCanvasId][0].updateConfig({
            data:gridVisitedData
        });
        grids[currentCanvasId][1].updateConfig({
            data:gridQueueData
        });

        grids[currentCanvasId][0].forceRender();
        grids[currentCanvasId][1].forceRender();
    }
    
}

function renderDFSGrid()
{
    var gridVisitedData = [];
    var gridParentData = [];

    for(var u of canvasGraphs[currentCanvasId].nodes)
    {
        if(u.color == "BLUE")
        {
            gridVisitedData.push([u.text,"F"]);
        }
        else
        {
            gridVisitedData.push([u.text,"T"]);
        }

        if(u.parent != null)
        {
            gridParentData.push([u.text,u.parent.text]);
        }
        else
        {
            gridParentData.push([u.text,"-"]);
        }
    }

    if(grids[currentCanvasId] == null)
    {
        grids[currentCanvasId] = [];

        var newVisitedGrid = new gridjs.Grid({
            columns: [
                { 
                  name: 'Visited',
                  columns: [{
                    name: 'Name'
                  }, {
                    name: 'Visited'
                  }]
                },
            ],
            data: gridVisitedData
        }).render(document.getElementById("sidebarVisitedGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newVisitedGrid);

        var newParentGrid = new gridjs.Grid({
            columns: [
                { 
                  name: 'Parents',
                  columns: [{
                    name: 'Name'
                  }, {
                    name: 'Parent'
                  }]
                },
            ],
            data: gridParentData
        }).render(document.getElementById("sidebarParentGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newParentGrid);
    }
    else
    {
        // BFS has two grids
        grids[currentCanvasId][0].updateConfig({
            data:gridVisitedData
        });
        grids[currentCanvasId][1].updateConfig({
            data:gridParentData
        });

        grids[currentCanvasId][0].forceRender();
        grids[currentCanvasId][1].forceRender();
    }
    
}

function clearBFSGrid()
{
    grids[currentCanvasId][0].updateConfig({
        data:[]
    });
    grids[currentCanvasId][1].updateConfig({
        data:[]
    });

    grids[currentCanvasId][0].forceRender();
    grids[currentCanvasId][1].forceRender();
}

function clearDFSGrid()
{
    grids[currentCanvasId][0].updateConfig({
        data:[]
    });
    grids[currentCanvasId][1].updateConfig({
        data:[]
    });

    grids[currentCanvasId][0].forceRender();
    grids[currentCanvasId][1].forceRender();
}