




/*const CanvasStorage = {
    nodes: [],
    edges: [],
}*/



var g;
var offset;
var update = true;

//var selectedNodes.length = 0;
//var selectedNodes = [];
var textoffset = 3;
//var node_image = "data/assets/node.png";
//var add_edge_image = "data/assets/addedge.png";

var selectedEdge;


var nodeRadius;

var nodeImage = new Image();
var greenNodeImage = new Image();
var redNodeImage = new Image();
var purpleNodeImage = new Image();
var yellowNodeImage = new Image();

var playImage = new Image();
var stopImage = new Image();

var playAutoImage = new Image();
var pauseAutoImage = new Image();

function init() {
    //examples.showDistractor();

    // create stages and point it to the canvas:
    currentCanvas = canvases[currentCanvasId];
    context = currentCanvas.getContext("2d");

    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(stages[currentCanvasId]);

    // enabled mouse over / out events
    stages[currentCanvasId].enableMouseOver(10);
    stages[currentCanvasId].mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    createjs.Ticker.addEventListener("tick", tick);

    // load the source image and call handleImageLoad which will create a few nodes with edges between them in the first canvas, as a starting point

    nodeImage.src = "data/assets/node.png";
    greenNodeImage.src = "data/assets/nodeGreen.png";
    redNodeImage.src = "data/assets/nodeRed.png";
    purpleNodeImage.src = "data/assets/nodePurple.png";
    yellowNodeImage.src = "data/assets/nodeYellow.png";

    playImage.src = "data/assets/start_icon.png";
    stopImage.src = "data/assets/stop_icon.png";

    playAutoImage.src = "data/assets/play_auto_icon.png";
    pauseAutoImage.src = "data/assets/pause_auto_icon.png";
    
    for(var i = 0; i < stages.length; i++)
    {
        stages[i].on("stagemousedown", function(evt) {
 
            if(currentCanvasFlags.addNodeFlag==true)
            {
                var newNode = new Node(currentCanvasGraph.nodes.length,currentCanvasGraph.nodes.length,(evt.stageX),(evt.stageY))
                currentCanvasGraph.addNode(newNode);
                update = true;
            }
            
        });
    }
}

function stop() {
    createjs.Ticker.removeEventListener("tick", tick);
}


function drawEdges(oldEdges=currentCanvasGraph.edges) {
    
    var edges = currentCanvasGraph.edges;
    currentCanvas = canvases[currentCanvasId];

    for(var i = 0; i<oldEdges.length;i++)
    {
        if(oldEdges[i].changed == true)
        {
            if(containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id)!=null)
            {
                containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id).graphics.clear();
                containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id));
            }
        }
        
    }

    for(var i = 0; i<edges.length;i++)
    {
        
        if(edges[i].changed == true)
        {
            if(edges[i].nodes.length===2) //if this edge has both nodes, draw
            {
                g = new createjs.Graphics();
                context.beginPath();

                g.beginStroke( edges[i].color );

                var isMultigraph = currentCanvasGraph.edgeBetweenNodesBothWays(edges[i].nodes[0],edges[i].nodes[1]);
                
                
                if(edges[i].nodes[0].id == edges[i].nodes[1].id)
                {

                    g.setStrokeStyle(3);

                    console.log("node radius: "+nodeRadius)
                    var start_x = edges[i].nodes[0].x-nodeRadius;
                    var start_y = edges[i].nodes[0].y;

                    var end_x = edges[i].nodes[0].x
                    var end_y = edges[i].nodes[0].y-nodeRadius;

                    g.moveTo(start_x,start_y);

                    //I do nodeRadius *3 simply because I cannot draw a quartic bezier curve, I am limited to a guadratic one, therefore I make the curve at least a bit more pronounced this way
                    var cp1_x = start_x - nodeRadius*3;
                    var cp1_y = start_y;

                    var cp3_x = end_x;
                    var cp3_y = end_y - nodeRadius*3;

                    var cp2_x = cp1_x;
                    var cp2_y = cp3_y;

                    g.bezierCurveTo(cp1_x,cp1_y,cp3_x,cp3_y,end_x,end_y);

                    //calculate points where I will place the edge weight text element
                    var mp_x = cp2_x + nodeRadius*2;
                    var mp_y = cp2_y + nodeRadius*2;

                    var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                    edgeWeightDom.x = mp_x;
                    edgeWeightDom.y = mp_y;
                    
                    var d_x = cp3_x - end_x;
                    var d_y = cp3_y - end_y;

                }
                //if multigraph, do bezier
                else if(isMultigraph)
                {
                    g.setStrokeStyle(3);
                    

                    var start_x = edges[i].nodes[0].x;
                    var start_y = edges[i].nodes[0].y;

                    var end_x = edges[i].nodes[1].x
                    var end_y = edges[i].nodes[1].y

                    g.moveTo(start_x,start_y);

                    //calculate middle point between nodes
                    var mp_x = (start_x + end_x)/2;
                    var mp_y = (start_y + end_y)/2;

                    var s = 1/Math.sqrt(3);

                    //calculate control point
                    var cp_x = mp_x + s*(end_y - mp_y);
                    var cp_y = mp_y + s*(mp_x - end_x);

                    g.bezierCurveTo(cp_x,cp_y,cp_x,cp_y,end_x,end_y);

                    //change location of edge weight texts
                    //console.log("drawing edgeWeight for bezier: "+"edgeWeight_"+edges[i].id);
                    var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                    edgeWeightDom.x = cp_x;
                    edgeWeightDom.y = cp_y;

                    //calculate end points for arrows of bezier
                    var d_x = end_x - cp_x;
                    var d_y = end_y - cp_y;
                    

                }
                else //draw a regular edge
                {
                    g.setStrokeStyle(3);

                    var r_start = nodeRadius;
                    var r_end = -nodeRadius;//(edges[i].nodes[1].size/2)*-1

                    var a=edges[i].nodes[1].x-edges[i].nodes[0].x;
                    var b=edges[i].nodes[1].y-edges[i].nodes[0].y;
                    var dist = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));


                    var start_x = edges[i].nodes[0].x + r_start*a/dist;
                    var start_y = edges[i].nodes[0].y + r_start*b/dist;

                    var end_x = edges[i].nodes[1].x + r_end*a/dist;
                    var end_y = edges[i].nodes[1].y + r_end*b/dist;
                    

                    g.moveTo(start_x,start_y);
                    g.lineTo(end_x,end_y);

                    
                    var mp_x = (start_x + end_x)/2;
                    var mp_y = (start_y + end_y)/2;

                    var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                    edgeWeightDom.x = mp_x;
                    edgeWeightDom.y = mp_y;

                    var d_x = edges[i].nodes[0].x - edges[i].nodes[1].x;    
                    var d_y = edges[i].nodes[0].y - edges[i].nodes[1].y;
                        
                    
                }

                //set visibility of weighted edges
                edgeWeightDom.visible = currentCanvasGraph.weighted;
                containers[currentCanvasId].addChild(edgeWeightDom);
                
                //if directed, draw arrows
                if(currentCanvasGraph.directed == true)
                {

                    var length = Math.sqrt(d_x * d_x + d_y * d_y);

                    //arrows of bezier point to a different spot and the degree is inverse
                    if(isMultigraph)
                    {
                        //retract the end point so that it points to the edge of the node
                        end_x = end_x - Math.round(d_x / ((length / nodeRadius)));
                        end_y = end_y - Math.round(d_y / ((length / nodeRadius)));


                        // calculate the angle of the edge
                        var deg = (Math.atan(d_y / d_x)) * 180.0 / Math.PI;
                        if (d_x < 0) {
                            deg -= 180.0;
                        }
                        if (deg < 0) {
                            deg -= 360.0;
                        }
                        // calculate the angle for the two triangle points
                        var deg1 = ((deg - 25 - 90) % 360) * Math.PI * 2 / 360.0;
                        var deg2 = ((deg - 335 - 90) % 360) * Math.PI * 2 / 360.0;
                    }
                    else
                    {
                        // calculate the angle of the edge
                        var deg = (Math.atan(d_y / d_x)) * 180.0 / Math.PI;
                        if (d_x < 0) {
                            deg += 180.0;
                        }
                        if (deg < 0) {
                            deg += 360.0;
                        }
                        // calculate the angle for the two triangle points
                        var deg1 = ((deg + 25 + 90) % 360) * Math.PI * 2 / 360.0;
                        var deg2 = ((deg + 335 + 90) % 360) * Math.PI * 2 / 360.0;
                        
                    }

                    // calculate the triangle points
                    var arrow_x = [];
                    var arrow_y = [];
                    var arrowSize = 15;
                    arrow_x[0] = end_x;
                    arrow_y[0] = end_y;
                    arrow_x[1] = Math.round(end_x + arrowSize * Math.sin(deg1));
                    arrow_y[1] = Math.round(end_y - arrowSize * Math.cos(deg1));
                    arrow_x[2] = Math.round(end_x + arrowSize * Math.sin(deg2));
                    arrow_y[2] = Math.round(end_y - arrowSize * Math.cos(deg2));
                    

                    g.beginFill("white");
                    g.moveTo(arrow_x[0], arrow_y[0]);
                    g.lineTo(arrow_x[1], arrow_y[1]);
                    g.lineTo(arrow_x[2], arrow_y[2]);
                    g.lineTo(arrow_x[0], arrow_y[0]);
                    g.endFill();

                    
                }
                var line = new createjs.Shape(g);
                line.id=edges[i].id;
                line.name="line_"+edges[i].id;
                
                containers[currentCanvasId].addChild(line);
                containers[currentCanvasId].setChildIndex( line, 0);

                
            }
            edges[i].changed = false;
            
        }
        
    }
    update = true;
}

function updateEdgeWeights()
{
    for(edge of currentCanvasGraph.edges)
    {
        edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+edge.id);
        edgeWeightText.innerHTML = ""+edge.weight;
    }
}

function createNodeBitmap(node,container) {

    var bitmap = new createjs.Bitmap(nodeImage);

    bitmap.x = node.x;
    bitmap.y = node.y;

    bitmap.regX = bitmap.image.width / 2 | 0;
    bitmap.regY = bitmap.image.height / 2 | 0;

    bitmap.scale = 0.7;
    bitmap.name = "bmpNode_" + node.id;
    bitmap.id = (node.id);
    bitmap.cursor = "pointer";


    nodeRadius = ((bitmap.image.width)*bitmap.scale) / 2;


    var html = document.createElement("div");
    html.innerHTML = ""+node.text;
    html.id = "nodeNameText_"+currentCanvasId+"_"+node.id;
    html.style.contenteditable="true";

    canvasContainers[currentCanvasId].getElementsByClassName("editableText")[0].appendChild(html).contentEditable = "true";

    var textName = new createjs.DOMElement(html);
    textName.id = node.id;
    textName.name = "nodeNameText_" + node.id;
    textName.cursor = "pointer";
    textName.x = node.x-textoffset;
    textName.y = node.y-textoffset-3;


    var textInformationQuadrantI = new createjs.Text("∞","16px Arial","red");
    textInformationQuadrantI.x = node.x+(bitmap.image.width/3)
    textInformationQuadrantI.y = node.y-(bitmap.image.height/3)
    textInformationQuadrantI.id = node.id;
    textInformationQuadrantI.name = "nodeInformationQuadrantIText_" + node.id;
    textInformationQuadrantI.visible = false;

    container.addChild(bitmap,textInformationQuadrantI,textName);

    bindFunctionalityToBitmap(bitmap)

}

function createEdgeVisualisationElements(edge)
{
    var html = document.createElement("div");
    html.innerHTML = ""+edge.weight;
    html.id = "edgeWeightText_"+currentCanvasId+"_"+edge.id;
    html.style.contenteditable="true";

    canvasContainers[currentCanvasId].getElementsByClassName("editableText")[0].appendChild(html).contentEditable = "true";

    var edgeWeightDom = new createjs.DOMElement(html);
    edgeWeightDom.id = edge.id;
    edgeWeightDom.name = "edgeWeight_" + edge.id;
    edgeWeightDom.cursor = "pointer";

    
    containers[currentCanvasId].addChild(edgeWeightDom);

    // if there is already an edge in the opposite direction - we are creating a multigraph, set this edge as changed, so that is it also drawn as a multigraph
    var edgeOppositeDirection = currentCanvasGraph.getEdgeFromNodeToNode(edge.nodes[1],edge.nodes[0])
    if(edgeOppositeDirection != null)
    {
        edgeOppositeDirection.changed = true;
    }

    drawEdges();
}


function removeNodeBitmap(bitmap)
{
    var parent = bitmap.parent;
    parent.removeChild(parent.getChildByName("nodeNameText_"+bitmap.id));

    var htmlTextName = document.getElementById("nodeNameText_"+currentCanvasId+"_"+bitmap.id);
    htmlTextName.remove();

    parent.removeChild(parent.getChildByName("nodeInformationQuadrantIText_"+bitmap.id));
    
    parent.removeChild(bitmap);
}

function removeEdgeVisualisationElements(edge)
{
    let indexDeleted = edge.id;

    let edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+indexDeleted);
    edgeWeightText.remove();
    
    containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("edgeWeight_"+indexDeleted));

    containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("line_"+indexDeleted));
}

function toggleNodeInformationQuadrantIVisibility()
{
    currentCanvasGraph.nodes.forEach(node => {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).visible ^= true;
    });
}

function disableNodeInformationQuadrantIVisibility()
{
    currentCanvasGraph.nodes.forEach(node => {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).visible = false;
    });
}

function clearNodeInformationQuadrantIText()
{
    currentCanvasGraph.nodes.forEach(node => {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    });
}


function updateNodeInformationQuadrantIForDFS(node)
{
    if(node.timeDiscovered!=null)
    {
        var timeDiscoveredCompletedText = "" + node.timeDiscovered + "/";
        if(node.timeCompleted!=null)
        {
            timeDiscoveredCompletedText += "" + node.timeCompleted;
        }
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = timeDiscoveredCompletedText;
    }
    else
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    }
    
    update=true;
}

function updateNodeInformationQuadrantIForBFS(node)
{
    if(node.distance!=null)
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "" + node.distance;
    }
    else
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    }
    
    update=true;
}

function updateNodeInformationQuadrantIForDijkstra(node)
{
    if(node.distance!=null)
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "" + node.distance;
    }
    else
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    }
    
    update=true;
}

function updateNodeInformationQuadrantIForDFS_Tarjan(node)
{
    var text = "";
    if(node.timeDiscovered != null)
    {
        text += node.timeDiscovered;
        if(node.lowlink!=null)
        {
            text += " [" + node.lowlink +"]";
        }
    }
    containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = text;
    
    update=true;
}

function updateNodeInformationQuadrantIForBiconnectivity(node)
{
    var text = "";
    if(node.number != null)
    {
        text += node.number;
        if(node.lowpt!=null)
        {
            text += " [" + node.lowpt +"]";
        }
    }
    containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = text;
    
    update=true;

}

function clearNodesInformationQuadrantIForNodeInCanvas()
{
    for(node of currentCanvasGraph.nodes)
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    }    
    update=true;
}

function toggleWeightedEdgesVisibility()
{
    canvases[currentCanvasId].visible ^= true;
    drawEdges();
}

function bindFunctionalityToBitmap(bitmap) {

    //var edges = currentCanvasGraph.edges;
    var nodes = currentCanvasGraph.nodes;
    bitmap.on("mousedown", function (evt) {

        
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        if(currentCanvasFlags.addEdgeFlag==true)
        {
            if(currentCanvasGraph.selectedNodes.length<1)
            {
                //currentCanvasGraph.selectedNodes.length++;
                currentCanvasGraph.selectedNodes.push(nodes[bitmap.id]);
            }
            else
            {
                currentCanvasGraph.selectedNodes.push(nodes[bitmap.id]);
                currentCanvasGraph.addEdgeBetweenNodes(currentCanvasGraph.selectedNodes);
                //currentCanvasGraph.selectedNodes.length=0;
                currentCanvasGraph.selectedNodes = []
                //currentCanvasFlags.addEdgeFlag=false;
                //highlightSelectedMenuTool();
            }
        }
        else if(currentCanvasFlags.removeNodeFlag==true)
        {
            currentCanvasGraph.removeNode(nodes[bitmap.id]);
            //currentCanvasFlags.removeNodeFlag=false;
            //highlightSelectedMenuTool();
        }
        else if(currentCanvasFlags.removeEdgeFlag==true)
        {
            if(currentCanvasGraph.selectedNodes.length<1)
            {
                //currentCanvasGraph.selectedNodes.length++;
                currentCanvasGraph.selectedNodes.push(nodes[bitmap.id]);
            }
            else
            {
                currentCanvasGraph.selectedNodes.push(nodes[bitmap.id]);
                currentCanvasGraph.removeEdgeBetweenNodes(currentCanvasGraph.selectedNodes);
                //currentCanvasGraph.selectedNodes.length=0;
                currentCanvasGraph.selectedNodes = [];
                //currentCanvasFlags.removeEdgeFlag=false;
                //highlightSelectedMenuTool();
            }
        }
        update=true;
    });

    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    bitmap.on("pressmove", function (evt) {


        //I have to check this, because there is a chance, that someone could try to delete a node and instead of only clicking, they also pressmove at the same time. And when that happens, the original node is deleted, but I am still trying to manipulate it.
        if(this.parent != null)
        {
            var node = currentCanvasGraph.nodes[bitmap.id];
            node.x=evt.stageX + this.offset.x;
            node.y=evt.stageY + this.offset.y;
            this.x = node.x;
            this.y = node.y;

            var textName = this.parent.getChildByName("nodeNameText_"+this.id);
            textName.x=node.x-textoffset;//textoffset;
            textName.y=node.y-textoffset-3;//textoffset;
            this.parent.addChild(textName);

            var textInformationQuadrantI = this.parent.getChildByName("nodeInformationQuadrantIText_"+this.id);
            textInformationQuadrantI.x = node.x+(bitmap.image.width/3)
            textInformationQuadrantI.y = node.y-(bitmap.image.height/3)
            this.parent.addChild(textInformationQuadrantI);

            // indicate that the stages should be updated on the next tick:
            update = true;

            for(var nodeB of currentCanvasGraph.nodes)
            {
                
                var edge = currentCanvasGraph.getEdgeFromNodeToNode(node,nodeB);
                if(edge != null)
                {
                    edge.changed = true;
                    drawEdges();
                }
                
                edge = currentCanvasGraph.getEdgeFromNodeToNode(nodeB,node);
                if(edge != null)
                {
                    edge.changed = true;
                    drawEdges();
                }
            }

            
        }

    });

    bitmap.on("dblclick", function (evt) {
        var node = currentCanvasGraph.nodes[bitmap.id];
        for(var i = 0; i<currentCanvasGraph.nodes.length; i++)
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+i).image=nodeImage;
        }
        this.image = redNodeImage;
        currentCanvasGraph.startingNode=node;
        update = true;
    });

    bitmap.on("rollover", function (evt) {
        //this.scale = this.originalScale * 1.2;
        update = true;
    });

    bitmap.on("rollout", function (evt) {
        //this.scale = this.originalScale;
        update = true;
    });

    
}

function updateNodeBitmapColor(u)
{
    switch(u.color)
    {
        case "BLUE":
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
            break;
        case "RED":
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=redNodeImage;
            break;
        case "PURPLE":
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=purpleNodeImage;
            break;  
        case "GREEN":
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=greenNodeImage;
            break;  
        case "ORANGE":
            containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=yellowNodeImage;
            break;
        default:
                
    }
}

function resetGraph()
{
    for(var u of currentCanvasGraph.nodes)
    {
        updateNodeBitmapColor(u);
    }   

    for(var edge of currentCanvasGraph.edges)
    {
        edge.changed = true;
    }

    drawEdges();

    destroyCurrentVisNetwork();
    
    clearNodesInformationQuadrantIForNodeInCanvas();
    toggleNodeInformationQuadrantIVisibility();
    //disableNodeInformationQuadrantIVisibility();

    currentCanvasGraph.stepCounter = 0;

    canvasFlags[currentCanvasId].runningFlag = false;

    

    containers[currentCanvasId].getChildByName("bmpNode_"+currentCanvasGraph.startingNode.id).image=redNodeImage;

    canvasContainers[currentCanvasId].getElementsByClassName("canvas-container-row")[0].style.pointerEvents = "auto";
}


function tick(event) {
    // this set makes it so the stages only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stages[currentCanvasId].update(event);
    }
}




