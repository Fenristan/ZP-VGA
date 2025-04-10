
class Node {
    constructor(id, text, x, y) {
        this._id = id;
        this._text=text;
        this._x=x;
        this._y=y;
        this._color="BLUE";
    }
    get text() {
        return this._text;
    }
    get id() {
        return this._id;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get size()
    {
        return this._size;
    }
    get color() {
        return this._color;
    }


    set x(x) {
        this._x=x;
    }
    set y(y) {
        this._y=y;
    }
    set size(size)
    {
        this._size=size;
    }
    set id(id)
    {
        this._id=id;
    }
    set text(text){
        this._text=text;
    }
    set color(color) {
        this._color=color;
    }

}
Node.prototype.toJSON = function () {
return {
    id: this.id,
    text: this.text,
    x: this.x,
    y: this.y,
    size: this.size,
    color: this.color
};
};

class Edge{
    constructor(id, nodes, weight) {
        this._id = id;
        this._nodes=nodes;
        this._weight=weight;
        this._color="black";
        this._label="";
        this._changed=true;
    }
    get id() {
        return this._id;
    }
    get nodes() {
        return this._nodes;
    }
    get weight() {
        return this._weight;
    }
    get color() {
        return this._color;
    }
    get label() {
        return this._label;
    }
    get changed() {
        return this._changed;
    }


    set nodes(value) {
        this._nodes = value;
    }

    set id(id)
    {
        this._id=id;
    }
    set weight(weight)
    {
        this._weight=weight;
    }
    set color(color) {
        this._color=color;
    }
    set label(label) {
        this._label=label;
    }
    set changed(changed) {
        this._changed=changed;
    }
}
Edge.prototype.toJSON = function () {
return {
    id: this.id,
    nodes: this.nodes,
    weight: this.weight,
    color: this.color,
    label: this.label,
    changed: this.changed
};
};


/*const CanvasStorage = {
    nodes: [],
    edges: [],
}*/



var g;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;

var selectedNodesNumber = 0;
var selectedNodes = [];
var textoffset = 3;
var node_image = "./assets/images/node.png";
var add_edge_image = "./assets/images/addedge.png";
var containers = [];
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
    examples.showDistractor();
    // create stages and point it to the canvas:
    //canvas = document.getElementById("currentCanvas"+1);
    currentCanvas = canvases[currentCanvasId];
    context = currentCanvas.getContext("2d");
    //stages = new createjs.stages(currentCanvas);

    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(stages[currentCanvasId]);

    // enabled mouse over / out events
    stages[currentCanvasId].enableMouseOver(10);
    stages[currentCanvasId].mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    // load the source image and call handleImageLoad which will create a few nodes with edges between them in the first canvas, as a starting point
    var image = new Image();
    image.src = "./assets/images/node.png";
    image.onload = handleImageLoad;

    nodeImage.src = "./assets/images/node.png";
    greenNodeImage.src = "./assets/images/nodeGreen.png";
    redNodeImage.src = "./assets/images/nodeRed.png";
    purpleNodeImage.src = "./assets/images/nodePurple.png";
    yellowNodeImage.src = "./assets/images/nodeYellow.png";

    playImage.src = "./assets/images/start_icon.png";
    stopImage.src = "./assets/images/stop_icon.png";

    playAutoImage.src = "./assets/images/play_auto_icon.png";
    pauseAutoImage.src = "./assets/images/pause_auto_icon.png";
    
    for(var i = 0; i < stages.length; i++)
    {
        stages[i].on("stagemousedown", function(evt) {

            console.log("clicked in canvas "+currentCanvasId);
            
            if(currentCanvasFlags.addNodeFlag==true)
            {
                var newNode = new Node(currentCanvasGraph.nodes.length,currentCanvasGraph.nodes.length,(evt.stageX),(evt.stageY))
                currentCanvasGraph.nodes.push(newNode);
                console.log(newNode);
                console.log(currentCanvasGraph.nodes);
                var bitmap = new createjs.Bitmap(node_image);
                createNodeBitmap(newNode,containers[currentCanvasId],bitmap);
                bindFunctionalityToBitmap(bitmap);
                currentCanvasFlags.addNodeFlag=false;
                highlightSelectedMenuTool();
                update = true;
            }
            //stages[currentCanvasId].update(event)
            
        });
    }
}

function stop() {
    createjs.Ticker.removeEventListener("tick", tick);
}

function edgeBetweenNodes(nodeA, nodeB, edges)
{
    //edges = currentCanvasGraph.edges
    for(let i = 0; i<edges.length;i++)
    {
        if((edges[i].nodes[0].id==nodeA.id||edges[i].nodes[0].id==nodeB.id)&&(edges[i].nodes[1].id==nodeA.id||edges[i].nodes[1].id==nodeB.id))
        {
            return true
        }
        else
        {
            return false
        }
    }
    
}
function edgeBetweenNodesBothWays(nodeA, nodeB, edges)
{
    //edges = currentCanvasGraph.edges
    var counter = 0
    for(let i = 0; i<edges.length;i++)
    {
        if(edges[i].nodes[0].id != edges[i].nodes[1].id)
        {
            if((edges[i].nodes[0].id==nodeA.id||edges[i].nodes[0].id==nodeB.id)&&(edges[i].nodes[1].id==nodeA.id||edges[i].nodes[1].id==nodeB.id))
            {
                counter++;
            }
        }
        
    }
    if(counter>1)
    {
        return true
    }
    else
    {
        return false
    }
    
}
function edgeFromNodeToNode(nodeA, nodeB)
{
    var edges = currentCanvasGraph.edges;
    for(var i = 0; i<edges.length;i++)
    {
        if((edges[i].nodes[0].id==nodeA.id) &&(edges[i].nodes[1].id==nodeB.id))
        {
            return true
        }
    }
    return false
}

function getEdgeFromNodeToNode(nodeA, nodeB)
{
    for(var edge of currentCanvasGraph.edges)
    {
        if(canvases[currentCanvasId].directed == true)
        {
            if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id))
            {
                return edge;
            }
        }
        else
        {
            if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id)||(nodeA.id == edge.nodes[1].id)&&(nodeB.id == edge.nodes[0].id))
            {
                return edge;
            }
        }
    }
    
}

function getEdgeFromNodeToNodeUndirectedOrderMatters(nodeA, nodeB)
{
    for(var edge of currentCanvasGraph.edges)
    {

        if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id))
        {
            return edge;
        }
        if((nodeA.id == edge.nodes[1].id)&&(nodeB.id == edge.nodes[0].id))
        {

            var tmpNode = edge.nodes.slice(0,1)[0];
            edge.nodes[0] = edge.nodes[1];
            edge.nodes[1] = tmpNode;
            
            return edge;
        }
    }
    
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
                //console.log("removing: "+(containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id)).name);
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

                var isMultigraph = edgeBetweenNodesBothWays(edges[i].nodes[0],edges[i].nodes[1],edges);
                
                
                if(edges[i].nodes[0].id == edges[i].nodes[1].id)
                {
                    //console.log("This edge leads to the same node where it started, doing bezier");

                    g.setStrokeStyle(3);

                    console.log("node radius: "+nodeRadius)
                    var start_x = edges[i].nodes[0].x-nodeRadius;
                    var start_y = edges[i].nodes[0].y;

                    var end_x = edges[i].nodes[0].x
                    var end_y = edges[i].nodes[0].y-nodeRadius;

                    g.moveTo(start_x,start_y);

                    //I do nodeRadius *2 simply because I cannot draw a quartic bezier curve, I am limited to a guadratic one, therefore I make the curve at least a bit more pronounced this way
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
                    
                    //calculate end points for arrows of bezier
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

                    //console.log("there is already an edge between these nodes, doing bezier")
                    g.moveTo(start_x,start_y);

                    /*
                        x1 = mp_x, y1 = mp_y
                        x2 = end_x, y2 = end_y
                        
                    */

                    //calculate vector from node to node
                    //var v = [end_x-start_x,end_y-start_y]
                    //calculate normal 
                    //var d_x = end_x - start_x
                    //var d_y = end_y - start_y
                    //var n = [-(d_y),d_x]

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

                    var r_start = 24;
                    var r_end = -24;//(edges[i].nodes[1].size/2)*-1

                    var a=edges[i].nodes[1].x-edges[i].nodes[0].x;
                    var b=edges[i].nodes[1].y-edges[i].nodes[0].y;
                    var dist = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));


                    var start_x = edges[i].nodes[0].x + r_start*a/dist;
                    var start_y = edges[i].nodes[0].y + r_start*b/dist;

                    var end_x = edges[i].nodes[1].x + r_end*a/dist;
                    var end_y = edges[i].nodes[1].y + r_end*b/dist;
                    

                    g.moveTo(start_x,start_y);
                    g.lineTo(end_x,end_y);

                    
                    var mp_x = (start_x + end_x)/2
                    var mp_y = (start_y + end_y)/2

                    var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                    edgeWeightDom.x = mp_x;
                    edgeWeightDom.y = mp_y;

                    //calculate end points for arrows of regular edges
                    var d_x = edges[i].nodes[0].x - edges[i].nodes[1].x;
                    var d_y = edges[i].nodes[0].y - edges[i].nodes[1].y;
                        
                    
                }

                //set visibility of weighted edges
                edgeWeightDom.visible = canvases[currentCanvasId].weighted;
                containers[currentCanvasId].addChild(edgeWeightDom);
                
                //if directed, draw arrows
                if(currentCanvas.directed == true)
                {
                        /*start_x = edges[i].nodes[0].x;
                        start_y = edges[i].nodes[0].y;

                        end_x = edges[i].nodes[1].x;
                        end_y = edges[i].nodes[1].y;*/

                    var length = Math.sqrt(d_x * d_x + d_y * d_y);

                    //start_x = start_x - Math.round(d_x / ((length / (15))));
                    //start_y = start_y - Math.round(d_y / ((length / (15))));
                    //end_x = end_x + Math.round(d_x / ((length / (15))));
                    //end_y = end_y + Math.round(d_y / ((length / (15))));

                    /*if(edges[i].nodes[0].id == edges[i].nodes[1].id)
                    {
                        
                    }*/
                    //arrows of bezier point to a different spot and the degree is inverse
                    if(isMultigraph)
                    {
                        //retract the end point so that it points to the edge of the node
                        end_x = end_x - Math.round(d_x / ((length / nodeRadius)));
                        end_y = end_y - Math.round(d_y / ((length / nodeRadius)));


                        //rotate the end point around the center of the node
                        /*var radians = (Math.PI / 180) * 180;
                        cos = Math.cos(radians);
                        sin = Math.sin(radians);
                        end_x = (cos * (end_x - edges[i].nodes[1].x)) + (sin * (end_y - edges[i].nodes[1].y)) + edges[i].nodes[1].x;
                        end_y = (cos * (end_y - edges[i].nodes[1].y)) - (sin * (end_x - edges[i].nodes[1].x)) + edges[i].nodes[1].y;*/

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

function createNodeBitmap(node,container,bitmap) {
    bitmap.x = node.x;
    bitmap.y = node.y;
    //bitmap.rotation = 360 * Math.random() | 0;
    bitmap.regX = bitmap.image.width / 2 | 0;
    bitmap.regY = bitmap.image.height / 2 | 0;
    //bitmap.scale = bitmap.originalScale = Math.random() * 0.4 + 0.6;
    bitmap.scale = 0.7;
    bitmap.name = "bmpNode_" + node.id;
    bitmap.id = (node.id);
    bitmap.cursor = "pointer";
    //node.size=(bitmap.getBounds().width);

    nodeRadius = ((bitmap.image.width)*bitmap.scale) / 2;
    console.log("nodeRadius je: "+nodeRadius);
    //nodeRadius=(bitmap.getBounds().width/2);
    /*text.x = node.x-textoffset;
    text.y = node.y-textoffset;
    text.name = "nodeNameText_" + node.id;
    text.id = (node.id);
    text.cursor = "pointer";
    text.scale = 1.5;*/

    var html = document.createElement("div");
    html.innerHTML = ""+node.text;
    html.id = "nodeNameText_"+currentCanvasId+"_"+node.id;
    html.style.contenteditable="true";
    //html.id="nodeNameText_"+node.id;
    //html.id="nodeNameText_"+node.id;
    //html.style.height = '50px';
    //html.style.width = '100px';
    //html.style.backgroundColor = '#000000';
    /*html.style.position = "absolute";
    html.style.top = (0).toString();
    html.style.left = (0).toString();*/
    //html.style.bottom = node.y;

    //var content = document.createTextNode(""+node.id);
    //html.appendChild(content);*/
    document.getElementById("editableTextCanvas"+currentCanvasId).appendChild(html).contentEditable = "true";

    var textName = new createjs.DOMElement(html);
    textName.id = node.id;
    textName.name = "nodeNameText_" + node.id;
    textName.cursor = "pointer";
    textName.x = node.x-textoffset;
    textName.y = node.y-textoffset-3;

    //container.addChild(bitmap,textName);

    var textInformationQuadrantI = new createjs.Text("∞","16px Arial","red");
    textInformationQuadrantI.x = node.x+(bitmap.image.width/3)
    textInformationQuadrantI.y = node.y-(bitmap.image.height/3)
    textInformationQuadrantI.id = node.id;
    textInformationQuadrantI.name = "nodeInformationQuadrantIText_" + node.id;
    textInformationQuadrantI.visible = false;

    container.addChild(bitmap,textInformationQuadrantI,textName);

}

function addEdgeBetweenNodes(nodes)
{
    var edges = currentCanvasGraph.edges;
    if(edgeFromNodeToNode(nodes[0],nodes[1]))
    {
        console.log("there already is an edge between these nodes");
    }
    else if(canvases[currentCanvasId].directed == false && edgeFromNodeToNode(nodes[1],nodes[0]))
    {
        console.log("undirected graph - there is already an edge between these nodes");
    }
    else
    {
        var edge = new Edge(edges.length,nodes,1);
        edges.push(edge);

        var html = document.createElement("div");
        html.innerHTML = ""+edge.weight;
        html.id = "edgeWeightText_"+currentCanvasId+"_"+edge.id;
        html.style.contenteditable="true";

        document.getElementById("editableTextCanvas"+currentCanvasId).appendChild(html).contentEditable = "true";

        console.log("creating edgeWeight_"+edge.id);
        var edgeWeightDom = new createjs.DOMElement(html);
        edgeWeightDom.id = edge.id;
        edgeWeightDom.name = "edgeWeight_" + edge.id;
        edgeWeightDom.cursor = "pointer";

        console.log(edgeWeightDom.name);
        

        containers[currentCanvasId].addChild(edgeWeightDom);
        console.log("edge Weight Dom name: "+edgeWeightDom.name)

        // if there is already an edge in the opposite direction - we are creating a multigraph, set this edge as changed, so that is it also drawn as a multigraph
        var edgeOppositeDirection = getEdgeFromNodeToNode(nodes[1],nodes[0])
        if(edgeOppositeDirection != null)
        {
            edgeOppositeDirection.changed = true;
        }

        drawEdges();
    }
    
    
}
function removeEdgeBetweenNodes(nodes)
{
    var edges = currentCanvasGraph.edges;
    let oldEdges = edges.slice(0);
    //var edge = new Edge(edges.length,nodes);
    for(let i = 0; i<edges.length; i++)
    {
        var deleteThisEdge = false;
        if(canvases[currentCanvasId].directed == true)
        {
            deleteThisEdge = (edges[i].nodes[0].id==nodes[0].id) && (edges[i].nodes[1].id==nodes[1].id);
        }
        else
        {
            deleteThisEdge = (nodes[0].id == edges[i].nodes[0].id)&&(nodes[1].id == edges[i].nodes[1].id)||(nodes[0].id == edges[i].nodes[1].id)&&(nodes[1].id == edges[i].nodes[0].id);
        }
        //if((edges[i].nodes[0]==nodes[0]||edges[i].nodes[0]==nodes[1])&&(edges[i].nodes[1]==nodes[0]||edges[i].nodes[1]==nodes[1])) //check if edge exists
        if(deleteThisEdge)
        {
            // if there is already an edge in the opposite direction, a multigraph, we have to make sure, so that it updates when we draw edges so that it can be drawn as a regular edge, isntead of a curve
            var edgeOppositeDirection = getEdgeFromNodeToNode(edges[i].nodes[1],edges[i].nodes[0])
            if(edgeOppositeDirection != null)
            {
                edgeOppositeDirection.changed = true;
            }

            //oldEdges[i].changed = true;
            //edges[i].changed = true;

            console.log("removing edge: "+edges[i].id)
            console.log("removing "+(containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id)).name)

            let indexDeleted = edges[i].id;
            console.log("indexDeleted je:"+indexDeleted)
            console.log("edges length je:"+edges.length)

            

            let edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+indexDeleted);
            //text.parentNode.removeChild(text)
            console.log("deleting : "+edgeWeightText.id)
            edgeWeightText.remove();
            
            containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("edgeWeight_"+indexDeleted));

            containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("line_"+indexDeleted));
            

            for(let j = edges[i].id+1; j < edges.length; j++)
            {
                
                console.log("id je:"+j)
                
                let edgeWeight = containers[currentCanvasId].getChildByName("edgeWeight_"+j);
                //edgeWeight.id = edgeWeight.id-1;
                let index = j-1
                edgeWeight.name = "edgeWeight_" + index;
                containers[currentCanvasId].addChild(edgeWeight);
                

                
                
                let text = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+j);
                let indexNext = j-1
                console.log("zkousim edgeWeightText_:"+indexNext);
                console.log("edges length: "+edges.length);
                //let nextTextInnerHTML = (document.getElementById("edgeWeightText_"+currentCanvasId+"_"+(indexDeleted))).innerHTML;
                //text.innerHTML = nextTextInnerHTML;

                text.id = "edgeWeightText_"+currentCanvasId+"_"+indexNext;

                let line = containers[currentCanvasId].getChildByName("line_"+j);
                line.name = "line_"+(indexNext);

            }

            for(let j = edges[i].id; j < edges.length-1; j++)
            {
                

                edges[j]=edges[j+1];
                edges[j].id=(edges[j].id)-1;

                
                /*let selectedLine = this.parent.getChildByName("line_"+(j+1));
                selectedLine.id=selectedLine.id-1;
                selectedLine.name="bmpNode_"+i;
                this.parent.addChild(selectedLine);*/
            }
            
            
            
            //containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("edgeWeight_"+edges.length-1));

            //let index = edges.length-1
            //let edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+index);
            //edgeWeightText.remove();
            

            var poppedEdge = edges.pop();

            
        
            //poppedEdge.changed = true;
            console.log(edges);
            //console.log("mazu line "+(oldEdges.length-1));
            //containers[currentCanvasId].getChildByName("line_"+(oldEdges.length-1)).graphics.clear();
            //containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("line_"+(oldEdges.length-1)));

            //this.parent.removeChild(this.parent.getChildByName("line_"+edges[i].id));
        }
    }
    drawEdges();
}
function removeAllEdgesFromNode(node,nodes,edges)
{
    //var edge = new Edge(edges.length,nodes);
    let oldEdges = edges.slice(0);
    var edgesToBeRemoved = []
    /*for(let i = 0; i<edges.length; i++)
    {
        console.log("id ndoe predaneho"+node.id);
        
        //if((edges[i].nodes[0].id==node.id||edges[i].nodes[1].id==node.id))
        if((edges[i].nodes[0]==node||edges[i].nodes[1]==node))
        {
            //edgesToBeRemoved.push(edges[i])
            /*for(let j = edges[i].id; j < edges.length-1; j++)
            {
                edges[j]=edges[j+1];
                edges[j].id=(edges[j].id)-1;
            }
            //containers.removeChild(containers.getChildByName("line_"+edges[i].id));
            edges.pop();
            //console.log(edges);

        }
        for(let i = 0; i<edgesToBeRemoved.length; i++)
        {
            //removeEdgeBetweenNodes(edgesToBeRemoved[i].nodes,edges);
        }
        
    }*/

    for(let i = edges.length-1; i>=0; i--)
    {
        if((edges[i].nodes[0].id==node.id||edges[i].nodes[1].id==node.id))
        {
            edgesToBeRemoved.push(edges[i]);
        }
    }

    for(let i = 0; i<edgesToBeRemoved.length; i++)
    {
        removeEdgeBetweenNodes(edgesToBeRemoved[i].nodes);
    }

    drawEdges();
}

function removeNode(bitmap)
{
    var nodes = currentCanvasGraph.nodes;
    var edges = currentCanvasGraph.edges;
    var oldEdges = edges.slice(0);
    var parent = bitmap.parent;
    var nodeId = bitmap.id;

    removeAllEdgesFromNode(nodes[bitmap.id],nodes,edges);

    //remove this node, it's bitmap and everything else
    nodes.splice(bitmap.id,1);
    
    parent.removeChild(parent.getChildByName("nodeNameText_"+bitmap.id));

    var htmlTextName = document.getElementById("nodeNameText_"+currentCanvasId+"_"+bitmap.id);
    htmlTextName.remove();

    parent.removeChild(parent.getChildByName("nodeInformationQuadrantIText_"+bitmap.id));
    
    parent.removeChild(bitmap);

    //shift the ids of all nodes that come after the one that was deleted.
    for(var i = nodes.length-1; i >= nodeId ; i--)
    {
        var selectedBitmap = parent.getChildByName("bmpNode_"+(nodes[i].id));
        selectedBitmap.id -= 1;
        selectedBitmap.name = "bmpNode_"+(selectedBitmap.id);
        //parent.addChild(selectedBitmap);

        var textName = parent.getChildByName("nodeNameText_"+nodes[i].id);
        textName.name = "nodeNameText_"+(selectedBitmap.id);
        //parent.addChild(textName);

        var htmlTextName = document.getElementById("nodeNameText_"+currentCanvasId+"_"+nodes[i].id);
        htmlTextName.id = "nodeNameText_"+currentCanvasId+"_"+(selectedBitmap.id);

        var textInformationQuadrantI =  parent.getChildByName("nodeInformationQuadrantIText_"+nodes[i].id);
        textInformationQuadrantI.name = "nodeInformationQuadrantIText_"+(selectedBitmap.id);
        //parent.addChild(textInformationQuadrantI);

        nodes[i].id-=1;
    }

    drawEdges();
    
}

function getNodeUsingId(id)
{
    for(var i = 0; i < currentCanvasGraph.nodes.length; i++)
    {
        if(currentCanvasGraph.nodes[i].id == id)
        {
            return currentCanvasGraph.nodes[i];
        }
    }
    return null;
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

function updateNodeInformationQuadrantIForNodeInCanvas(node)
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
    else if(node.distance!=null)
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "" + node.distance;
    }
    
    update=true;
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

    var edges = currentCanvasGraph.edges;
    var nodes = currentCanvasGraph.nodes;
    bitmap.on("mousedown", function (evt) {

        console.log(""+bitmap.id);
        console.log(""+this.name)
        console.log(edges)
        console.log(nodes);
        
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        if(currentCanvasFlags.addEdgeFlag==true)
        {
            if(selectedNodesNumber<1)
            {
                selectedNodesNumber++;
                selectedNodes.push(nodes[bitmap.id]);
            }
            else
            {
                selectedNodes.push(nodes[bitmap.id]);
                addEdgeBetweenNodes(selectedNodes);
                selectedNodesNumber=0;
                selectedNodes = []
                currentCanvasFlags.addEdgeFlag=false;
                highlightSelectedMenuTool();
            }
        }
        else if(currentCanvasFlags.removeNodeFlag==true)
        {
            removeNode(bitmap);
            currentCanvasFlags.removeNodeFlag=false;
            highlightSelectedMenuTool();
        }
        else if(currentCanvasFlags.removeEdgeFlag==true)
        {
            if(selectedNodesNumber<1)
            {
                selectedNodesNumber++;
                selectedNodes.push(nodes[bitmap.id]);
            }
            else
            {
                selectedNodes.push(nodes[bitmap.id]);
                removeEdgeBetweenNodes(selectedNodes);
                selectedNodesNumber=0;
                selectedNodes = []
                currentCanvasFlags.removeEdgeFlag=false;
                highlightSelectedMenuTool();
            }
        }
        update=true;
    });

    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    bitmap.on("pressmove", function (evt) {

        console.log(this);

        //I have to check this, because there is a chance, that someone could try to delete a node and instead of only clicking, they also pressmove at the same time. And when that happens, the original node is deleted, but I am still trying to manipulate it.
        if(this.parent != null)
        {
            var node = currentCanvasGraph.nodes[bitmap.id];
            node.x=evt.stageX + this.offset.x;
            node.y=evt.stageY + this.offset.y;
            this.x = node.x;
            this.y = node.y;

            /*for(var i = 0; i < edges.length; i++)
            {
                if(node.id===edges[i].nodes[0].id)
                {
                    g.clear();
                    edges[i].nodes[0]=node;
                    drawEdges();
                }
                else if(node.id===edges[i].nodes[1].id)
                {
                    g.clear();
                    edges[i].nodes[1]=node;
                    drawEdges();
                }
            }*/
            

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
                
                var edge = getEdgeFromNodeToNode(node,nodeB);
                if(edge != null)
                {
                    edge.changed = true;
                    console.log("meni se edge mezi node s id "+node.id+" a node "+nodeB.id);
                    drawEdges();
                }
                
                edge = getEdgeFromNodeToNode(nodeB,node);
                if(edge != null)
                {
                    edge.changed = true;
                    console.log("meni se edge mezi node s id "+node.id+" a node "+nodeB.id);
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

    bitmap.parent.getChildByName("nodeNameText_"+bitmap.id).on("dblclick", function (evt)
    {
        let textName = this;
        textName.text = "";
    });
    
}

function updateNodeBitmapColor(u)
{
    if(u.color == "BLUE")
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=nodeImage;
    }
    else if(u.color == "RED")
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=redNodeImage;
    }
    else if(u.color == "PURPLE")
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=purpleNodeImage;
    }
    else if(u.color == "GREEN")
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=greenNodeImage;
    }
    else if(u.color == "ORANGE")
    {
        containers[currentCanvasId].getChildByName("bmpNode_"+u.id).image=yellowNodeImage;
    }
}

function transformUndirectedToDirected()
{
    var edgesCopy = currentCanvasGraph.edges.slice();
    for(edge of edgesCopy)
    {
        //if there is no edge going the opposite direction, add it
        if(!edgeFromNodeToNode(edge.nodes[1],edge.nodes[0]))
        {
            var newEdgeNodes = [];
            newEdgeNodes.push(edge.nodes[1])
            newEdgeNodes.push(edge.nodes[0]);
            console.log("pridavam edge z do");
            console.log(newEdgeNodes[0]);
            console.log(newEdgeNodes[1]);
            console.log("a graf je directed?:  "+canvases[currentCanvasId].directed);
            addEdgeBetweenNodes(newEdgeNodes);
        }
    }
}

function transformDirectedToUndirected()
{
    var edgesCopy = currentCanvasGraph.edges.slice();
    for(edge of currentCanvasGraph.edges)
    {
        //if there is a multigraph, delete one of the edges
        if(edgeFromNodeToNode(edge.nodes[1],edge.nodes[0]))
        {
            var nodesOfEdgeToBeRemoved = [];
            nodesOfEdgeToBeRemoved.push(edge.nodes[1]);
            nodesOfEdgeToBeRemoved.push(edge.nodes[0]);
            removeEdgeBetweenNodes(nodesOfEdgeToBeRemoved);
        }
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

function handleImageLoad(event) {
    var textoffset = 3;
    var bitmap;
    currentCanvasGraph = canvasGraphs[0];
    
    for(let i = 0; i < stages.length; i++)
    {
        containers[i] = new createjs.Container();
    }
    var text;
    

    for(let i = 0; i < stages.length; i++)
    {
        stages[i].addChild(containers[i]);
    }


    //const nodes = [];
    //const edges = [];

    for(var i = 0; i < 5; i++)
    {
        currentCanvasGraph.nodes.push(new Node(i,i,(currentCanvas.width * Math.random() | 0),(currentCanvas.height * Math.random() | 0)));
    }

    //currentCanvasGraph.edges.push(new Edge(0,[currentCanvasGraph.nodes[0],currentCanvasGraph.nodes[1]],1));
    //currentCanvasGraph.edges.push(new Edge(1,[currentCanvasGraph.nodes[1],currentCanvasGraph.nodes[2]],1));

    currentCanvasGraph.edges = [];

    addEdgeBetweenNodes([currentCanvasGraph.nodes[0],currentCanvasGraph.nodes[1]]);
    addEdgeBetweenNodes([currentCanvasGraph.nodes[1],currentCanvasGraph.nodes[2]]);

    for (var i = 0; i < currentCanvasGraph.nodes.length; i++) {

        bitmap = new createjs.Bitmap(node_image);
        createNodeBitmap(currentCanvasGraph.nodes[i],containers[currentCanvasId],bitmap);

        // using "on" binds the listener to the scope of the currentTarget by default
        // in this case that means it executes in the scope of the button.
        bindFunctionalityToBitmap(bitmap);
    }

    drawEdges(currentCanvasGraph.edges);

    examples.hideDistractor();
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    // this set makes it so the stages only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stages[currentCanvasId].update(event);
    }
}


function highlightSelectedMenuTool()
{
    for(var i=0; i<4; i++)
    {
        canvasContainers[currentCanvasId].getElementsByTagName('input')[i].style.outline = "none";
    }
    
    if(currentCanvasFlags.addNodeFlag)
    {
        canvasContainers[currentCanvasId].getElementsByTagName('input')[0].style.outline = "2px solid orange";
    }
    else if(currentCanvasFlags.addEdgeFlag)
    {
        canvasContainers[currentCanvasId].getElementsByTagName('input')[1].style.outline = "2px solid orange";
    }
    else if(currentCanvasFlags.removeNodeFlag)
    {
        canvasContainers[currentCanvasId].getElementsByTagName('input')[2].style.outline = "2px solid orange";
    }
    else if(currentCanvasFlags.removeEdgeFlag)
    {
        canvasContainers[currentCanvasId].getElementsByTagName('input')[3].style.outline = "2px solid orange";
    }

}

function addNodeBtnClicked() {
    currentCanvasFlags.addEdgeFlag=false;
    currentCanvasFlags.removeNodeFlag=false;
    currentCanvasFlags.removeEdgeFlag=false;

    currentCanvasFlags.addNodeFlag=!currentCanvasFlags.addNodeFlag;

    highlightSelectedMenuTool();
}
function addEdgeBtnClicked() {
    currentCanvasFlags.addNodeFlag=false;
    currentCanvasFlags.removeNodeFlag=false;
    currentCanvasFlags.removeEdgeFlag=false;

    currentCanvasFlags.addEdgeFlag=!currentCanvasFlags.addEdgeFlag;

    highlightSelectedMenuTool();
}
function removeNodeBtnClicked() {
    currentCanvasFlags.addNodeFlag=false;
    currentCanvasFlags.addEdgeFlag=false;
    currentCanvasFlags.removeEdgeFlag=false;

    currentCanvasFlags.removeNodeFlag=!currentCanvasFlags.removeNodeFlag;

    highlightSelectedMenuTool();
}
function removeEdgeBtnClicked() {
    currentCanvasFlags.addNodeFlag=false;
    currentCanvasFlags.addEdgeFlag=false;
    currentCanvasFlags.removeNodeFlag=false;

    currentCanvasFlags.removeEdgeFlag=!currentCanvasFlags.removeEdgeFlag;

    highlightSelectedMenuTool();
}
/*function stepForwardBtnClicked() {
    stepForwardFlag=true;
}*/
/*function startSimulation() {
    console.log("starting simulation");

    if(currentCanvasId == 0)
    {
        startBSF();
    }
}*/

function getCurrentGraphCopy()
{
    graphCopy = JSON.parse(JSON.stringify(currentCanvasGraph));
    console.log("graphCopy:");
    console.log(graphCopy);
    /*for(var node of graphCopy.nodes)
    {
        node = Object.assign(new Node,node);
    }*/
    for(var edge of graphCopy.edges)
    {
        //edge = Object.assign(new Edge,edge);

        //Since references are lost when parsing json, make it so that the nodes forming the edge reference the correct nodes.
        edge.nodes[0] = graphCopy.nodes[edge.nodes[0].id];
        edge.nodes[1] = graphCopy.nodes[edge.nodes[1].id];
    }
    return graphCopy;
}
