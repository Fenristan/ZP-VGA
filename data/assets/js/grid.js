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

function renderDijkstraGrid()
{
    var gridDistanceData = [];
    var gridParentData = [];

    for(var u of canvasGraphs[currentCanvasId].nodes)
    {

        gridDistanceData.push([u.text,u.distance]);


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

        var newDistanceGrid = new gridjs.Grid({
            columns: [
                { 
                  name: 'Distance',
                  columns: [{
                    name: 'Name'
                  }, {
                    name: 'Distance'
                  }]
                },
            ],
            data: gridDistanceData
        }).render(document.getElementById("sidebarDistanceGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newDistanceGrid);

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
            data:gridDistanceData
        });
        grids[currentCanvasId][1].updateConfig({
            data:gridParentData
        });

        grids[currentCanvasId][0].forceRender();
        grids[currentCanvasId][1].forceRender();
    }
    
}

function renderTarjanGrid()
{
    var gridVisitedData = [];
    var gridParentData = [];
    var gridStackData = [];
    var gridSCCData = [];

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

    for(var u of canvasGraphs[currentCanvasId].stack)
    {
        gridStackData.push([u.text]);
    }

    for(var C of canvasGraphs[currentCanvasId].SCC)
    {
        var C_text = "{";
        var len = C.length;
        var index = 0;
        for(var u of C)
        {
            C_text += u.text
            if(index != len-1)
            {
                C_text += ", ";
            }
            index ++;
        }
        C_text += "}";
        gridSCCData.push([C_text]);
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

        var newStackGrid = new gridjs.Grid({
            columns: ['Stack'],
            data: gridStackData
        }).render(document.getElementById("sidebarStackGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newStackGrid);

        var newSCCGrid = new gridjs.Grid({
            columns: ['SCC'],
            data: gridSCCData
        }).render(document.getElementById("sidebarSCCGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newSCCGrid);
    }
    else
    {
        // Tarjan has four grids
        grids[currentCanvasId][0].updateConfig({
            data:gridVisitedData
        });
        grids[currentCanvasId][1].updateConfig({
            data:gridParentData
        });
        grids[currentCanvasId][2].updateConfig({
            data:gridStackData
        });
        grids[currentCanvasId][3].updateConfig({
            data:gridSCCData
        });

        grids[currentCanvasId][0].forceRender();
        grids[currentCanvasId][1].forceRender();
        grids[currentCanvasId][2].forceRender();
        grids[currentCanvasId][3].forceRender();
    }
    
}

function renderBiconnectivityGrid()
{
    var gridComponentsData = [];

    console.log("components: ");
    console.log(canvasGraphs[currentCanvasId].components);
    for(var c of canvasGraphs[currentCanvasId].components)
    {
        var c_text = "{";
        var len = c.length;
        var index = 0;
        var cNodes = [];
        
        for(var e of c)
        {
            for(u of e.nodes)
            {
                if (cNodes.findIndex(node => node.id === u.id) == -1) {
                    cNodes.push(u);
                }
            }
            
        }

        for(var u of cNodes)
        {
            c_text += u.text
            if(index != len)
            {
                c_text += ", ";
            }
            index ++;
        }
        c_text += "}";
        gridComponentsData.push([c_text]);
    }

    if(grids[currentCanvasId] == null)
    {
        grids[currentCanvasId] = [];

        var newComponentsGrid = new gridjs.Grid({
            columns: ['Components'],
            data: gridComponentsData
        }).render(document.getElementById("sidebarComponentsGridCanvas"+currentCanvasId));

        grids[currentCanvasId].push(newComponentsGrid);

    }
    else
    {
        grids[currentCanvasId][0].updateConfig({
            data:gridComponentsData
        });

        grids[currentCanvasId][0].forceRender();
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

function clearDijkstraGrid()
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

function clearTarjanGrid()
{
    grids[currentCanvasId][0].updateConfig({
        data:[]
    });
    grids[currentCanvasId][1].updateConfig({
        data:[]
    });
    grids[currentCanvasId][2].updateConfig({
        data:[]
    });
    grids[currentCanvasId][3].updateConfig({
        data:[]
    });

    grids[currentCanvasId][0].forceRender();
    grids[currentCanvasId][1].forceRender();
    grids[currentCanvasId][2].forceRender();
    grids[currentCanvasId][3].forceRender();
}

function clearBiconnectivityGrid()
{
    grids[currentCanvasId][0].updateConfig({
        data:[]
    });


    grids[currentCanvasId][0].forceRender();

}