
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
    set x(x) {
        this._x=x;
    }
    get y() {
        return this._y;
    }
    get color() {
        return this._color;
    }

    set y(y) {
        this._y=y;
    }
    get size()
    {
        return this._size;
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
}
Edge.prototype.toJSON = function () {
return {
    id: this.id,
    nodes: this.nodes,
    weight: this.weight,
    color: this.color,
    label: this.label
};
};

/*const CanvasStorage = {
    nodes: [],
    edges: [],
}*/

var canvasGraphs = [];

var g;

var mouseTarget;	// the display object currently under the mouse, or being dragged
var dragStarted;	// indicates whether we are currently in a drag operation
var offset;
var update = true;
var addNodeFlag = false;
var addEdgeFlag = false;
var removeNodeFlag = false;
var removeEdgeFlag = false;
var selectedNodesNumber = 0;
var selectedNodes = [];
var textoffset = 3;
var node_image = "./assets/images/node.png";
var add_edge_image = "./assets/images/addedge.png";
var containers = [];
var selectedEdge;
var stepForwardFlag = false;
//var stopFlag = false;
//var canvasFlags[currentCanvasId].stepBackwardsFlag = false;
//var restartFlag = false;

var nodeRadius;

var nodeImage = new Image();
var completedNodeImage = new Image();
var selectedNodeImage = new Image();
var visitedNodeImage = new Image();
var articulationNodeImage = new Image();

var playImage = new Image();
var stopImage = new Image();

var playAutoImage = new Image();
var pauseAutoImage = new Image();

function init() {
    examples.showDistractor();
    // create stage and point it to the canvas:
    //canvas = document.getElementById("currentCanvas"+1);
    currentCanvas = canvases[currentCanvasId];
    context = currentCanvas.getContext("2d");
    //stage = new createjs.Stage(currentCanvas);

    // enable touch interactions if supported on the current device:
    createjs.Touch.enable(stage[currentCanvasId]);

    // enabled mouse over / out events
    stage[currentCanvasId].enableMouseOver(10);
    stage[currentCanvasId].mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

    // load the source image and call handleImageLoad which will create a few nodes with edges between them in the first canvas, as a starting point
    var image = new Image();
    image.src = "./assets/images/node.png";
    image.onload = handleImageLoad;

    nodeImage.src = "./assets/images/node.png";
    completedNodeImage.src = "./assets/images/nodeCompleted.png";
    selectedNodeImage.src = "./assets/images/nodeSelected2.png";
    visitedNodeImage.src = "./assets/images/nodeVisited.png";
    articulationNodeImage.src = "./assets/images/nodeArticulation.png";

    playImage.src = "./assets/images/start_icon.png";
    stopImage.src = "./assets/images/stop_icon.png";

    playAutoImage.src = "./assets/images/play_auto_icon.png";
    pauseAutoImage.src = "./assets/images/pause_auto_icon.png";
    
}

function stop() {
    createjs.Ticker.removeEventListener("tick", tick);
}

function edgeBetweenNodes(nodeA, nodeB, edges)
{
    //edges = canvasGraphs[currentCanvasId].edges
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
    //edges = canvasGraphs[currentCanvasId].edges
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
function edgeFromNodeToNode(nodeA, nodeB, edges)
{
    for(let i = 0; i<edges.length;i++)
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
    console.log(nodeA);
    console.log(nodeB);
    for(var edge of canvasGraphs[currentCanvasId].edges)
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
    console.log(nodeA);
    console.log(nodeB);
    for(var edge of canvasGraphs[currentCanvasId].edges)
    {

        if((nodeA.id == edge.nodes[0].id)&&(nodeB.id == edge.nodes[1].id))
        {
            return edge;
        }
        if((nodeA.id == edge.nodes[1].id)&&(nodeB.id == edge.nodes[0].id))
        {

            console.log(" poradi nodes bylo: " + edge.nodes[0].text + edge.nodes[1].text);
            var tmpNode = edge.nodes.slice(0,1)[0];
            edge.nodes[0] = edge.nodes[1];
            edge.nodes[1] = tmpNode;

            console.log(" poradi nodes je nyni: " + edge.nodes[0].text + edge.nodes[1].text);
            
            return edge;
        }
    }
    
}



function drawEdges(edges,oldEdges=edges) {
    g = new createjs.Graphics();
    //g.clear();
    context.beginPath();
    console.log("new length: "+edges.length);
    console.log("old length: "+oldEdges.length);
    console.log(oldEdges);

    currentCanvas = canvases[currentCanvasId];

    for(let i = 0; i<edges.length; i++)
            {
                    let index = edges[i].id
                    //console.log("existing edgeWeight_ is: "+(containers[currentCanvasId].getChildByName("edgeWeight_"+index)));
            }


        for(let i = 0; i<oldEdges.length;i++)
        {
            if(containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id)!=null)
            {
                //console.log("removing: "+(containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id)).name);
                containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id).graphics.clear();
                containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("line_"+oldEdges[i].id));
            }
        }

    for(let i = 0; i<edges.length;i++)
    {
        if(edges[i].nodes.length===2) //if this edge has both nodes, draw
        {
            var r_start = 24;
            var r_end = -24;//(edges[i].nodes[1].size/2)*-1

            var a=edges[i].nodes[1].x-edges[i].nodes[0].x;
            var b=edges[i].nodes[1].y-edges[i].nodes[0].y;
            var dist = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

            /*var start_x = a/dist;
            var start_y = b/dist;*/

            var start_x = edges[i].nodes[0].x + r_start*a/dist;
            var start_y = edges[i].nodes[0].y + r_start*b/dist;

            var end_x = edges[i].nodes[1].x + r_end*a/dist;
            var end_y = edges[i].nodes[1].y + r_end*b/dist;

            //console.log("selectedNodes: ");
            //console.log(canvasGraphs[currentCanvasId].selectedNodes);

            //console.log("visitedEdges: ");
            //console.log(canvasGraphs[currentCanvasId].visitedEdges);
            
            /*if(canvasGraphs[currentCanvasId].visitedEdges.includes(edges[i]))
            {
                //console.log("yep already there");
                g.beginStroke("purple");
                edges[i].color = "purple";
            }



            //if the edge that is about to be draw is the one, that we have just visited, then change color. Check if there are selectedNodes, if so, they will be painted red
            else if(canvasGraphs[currentCanvasId].selectedNodes[0] != null && canvasGraphs[currentCanvasId].selectedNodes[1] != null)
            {
                // 
                if(currentCanvas.directed == true)
                {
                    if((canvasGraphs[currentCanvasId].selectedNodes[0].id == edges[i].nodes[0].id)&&(canvasGraphs[currentCanvasId].selectedNodes[1].id == edges[i].nodes[1].id))
                    {
                        g.beginStroke("red");
                        edges[i].color = "red";
                        if(!(edges[i] in canvasGraphs[currentCanvasId].visitedEdges))
                        {
                            canvasGraphs[currentCanvasId].visitedEdges.push(edges[i]);
                        }
                        canvasGraphs[currentCanvasId].selectedNodes.shift();
                        canvasGraphs[currentCanvasId].selectedNodes.shift();
                    }
                    else 
                    {
                        g.beginStroke("black");
                        edges[i].color = "black";
                    } 
                    
                }
                else
                {
                    //if undirected, then the edge can go from nodes A to B or B to A
                    if((canvasGraphs[currentCanvasId].selectedNodes[0].id == edges[i].nodes[0].id)&&(canvasGraphs[currentCanvasId].selectedNodes[1].id == edges[i].nodes[1].id)||(canvasGraphs[currentCanvasId].selectedNodes[0].id == edges[i].nodes[1].id)&&(canvasGraphs[currentCanvasId].selectedNodes[1].id == edges[i].nodes[0].id))
                    {
                        g.beginStroke("red");
                        edges[i].color = "red";
                        if(!(edges[i] in canvasGraphs[currentCanvasId].visitedEdges))
                        {
                            canvasGraphs[currentCanvasId].visitedEdges.push(edges[i]);
                        }
                        canvasGraphs[currentCanvasId].selectedNodes.shift();
                        canvasGraphs[currentCanvasId].selectedNodes.shift();
                    }
                    else 
                    {
                        g.beginStroke("black");
                        edges[i].color = "black";
                    }     
                }      
            }
            else
            {
                g.beginStroke("black");
                //edges[i].color = "black";
            }*/



            
            g.beginStroke( edges[i].color );
            
            
            if(edges[i].nodes[0].id == edges[i].nodes[1].id)
            {
                //console.log("This edge leads to the same node where it started, doing bezier");

                g.setStrokeStyle(3);

                var start_x = edges[i].nodes[0].x-nodeRadius/2;
                var start_y = edges[i].nodes[0].y;

                var end_x = edges[i].nodes[0].x
                var end_y = edges[i].nodes[0].y-nodeRadius/2;

                g.moveTo(start_x,start_y);

                //I do nodeRadius *2 simply because I cannot draw a quartic bezier curve, I am limited to a guadratic one, therefore I make the curve at least a bit more pronounced this way
                var cp1_x = start_x - nodeRadius*2;
                var cp1_y = start_y;

                var cp3_x = end_x;
                var cp3_y = end_y - nodeRadius*2;

                var cp2_x = cp1_x;
                var cp2_y = cp3_y;

                g.bezierCurveTo(cp1_x,cp1_y,cp3_x,cp3_y,end_x,end_y);

                //calculate end points for arrows of bezier
                var dx = end_x - cp3_x;
                var dy = end_y - cp3_y;

                //calculate points where I will place the edge weight text element
                var mp_x = cp2_x + nodeRadius;
                var mp_y = cp2_y + nodeRadius;


                var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                edgeWeightDom.x = mp_x;
                edgeWeightDom.y = mp_y;
                

            }
            //if multigraph, do bezier
            else if(edgeBetweenNodesBothWays(edges[i].nodes[0],edges[i].nodes[1],edges))
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
                //var dx = end_x - start_x
                //var dy = end_y - start_y
                //var n = [-(dy),dx]

                //calculate middle point between nodes
                var mp_x = (start_x + end_x)/2;
                var mp_y = (start_y + end_y)/2;

                var s = 1/Math.sqrt(3);

                //calculate control point
                var cp_x = mp_x + s*(end_y - mp_y);
                var cp_y = mp_y + s*(mp_x - end_x);

                g.bezierCurveTo(cp_x,cp_y,cp_x,cp_y,end_x,end_y);

                //calculate end points for arrows of bezier
                var dx = end_x - cp_x;
                var dy = end_y - cp_y;

                //change location of edge weight texts
                //console.log("drawing edgeWeight for bezier: "+"edgeWeight_"+edges[i].id);
                var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                edgeWeightDom.x = cp_x;
                edgeWeightDom.y = cp_y;
                

            }
            else //draw a regular edge
            {
                g.setStrokeStyle(3);
                
                /*g.moveTo(edges[i].nodes[0].x,edges[i].nodes[0].y);
                g.lineTo(edges[i].nodes[1].x,edges[i].nodes[1].y);*/
                //g.moveTo(edges[i].nodes[0].x,edges[i].nodes[0].y)
                g.moveTo(start_x,start_y);
                g.lineTo(end_x,end_y);

                //calculate end points for arrows of regular edges
                var dx = edges[i].nodes[0].x - edges[i].nodes[1].x;
                var dy = edges[i].nodes[0].y - edges[i].nodes[1].y;

                var mp_x = (start_x + end_x)/2
                var mp_y = (start_y + end_y)/2

                //console.log("moving: "+"edgeWeight_"+edges[i].id)
                //console.log(edgeWeightDom)
                var edgeWeightDom = containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id);
                edgeWeightDom.x = mp_x;
                edgeWeightDom.y = mp_y;
                    
                
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

                var length = Math.sqrt(dx * dx + dy * dy);

                start_x = start_x - Math.round(dx / ((length / (15))));
                start_y = start_y - Math.round(dy / ((length / (15))));
                end_x = end_x + Math.round(dx / ((length / (15))));
                end_y = end_y + Math.round(dy / ((length / (15))));

                //arrows of bezier point to a different spot and the degree is inverse
                if(edgeBetweenNodesBothWays(edges[i].nodes[0],edges[i].nodes[1],edges))
                {
                    //extend the end point so that it points to the edge of the node
                    end_x = end_x + Math.round(dx / ((length / (11))));
                    end_y = end_y + Math.round(dy / ((length / (11))));

                    //rotate the end point around the center of the node
                    var radians = (Math.PI / 180) * 180;
                    cos = Math.cos(radians);
                    sin = Math.sin(radians);
                    end_x = (cos * (end_x - edges[i].nodes[1].x)) + (sin * (end_y - edges[i].nodes[1].y)) + edges[i].nodes[1].x;
                    end_y = (cos * (end_y - edges[i].nodes[1].y)) - (sin * (end_x - edges[i].nodes[1].x)) + edges[i].nodes[1].y;

                    // calculate the angle of the edge
                    var deg = (Math.atan(dy / dx)) * 180.0 / Math.PI;
                    if (dx < 0) {
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
                    var deg = (Math.atan(dy / dx)) * 180.0 / Math.PI;
                    if (dx < 0) {
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
                var arrowx = [];
                var arrowy = [];
                arrowx[0] = end_x;
                arrowy[0] = end_y;
                arrowx[1] = Math.round(end_x + 12 * Math.sin(deg1));
                arrowy[1] = Math.round(end_y - 12 * Math.cos(deg1));
                arrowx[2] = Math.round(end_x + 12 * Math.sin(deg2));
                arrowy[2] = Math.round(end_y - 12 * Math.cos(deg2));
                

                g.beginFill("white");
                g.moveTo(arrowx[0], arrowy[0]);
                g.lineTo(arrowx[1], arrowy[1]);
                g.lineTo(arrowx[2], arrowy[2]);
                g.lineTo(arrowx[0], arrowy[0]);
                g.endFill();

                
            }
            var line = new createjs.Shape(g);
            line.id=edges[i].id;
            line.name="line_"+edges[i].id;
            
            containers[currentCanvasId].addChild(line);
            containers[currentCanvasId].setChildIndex( line, 0);

        }
    }
    update = true;
}

function updateEdgeWeights()
{
    for(edge of canvasGraphs[currentCanvasId].edges)
    {
        edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+edge.id);
        edgeWeightText.innerHTML = ""+edge.weight;
    }
}

function addNodeToBitmap(node,container,bitmap) {
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
    node.size=(bitmap.getBounds().width);

    nodeRadius = bitmap.image.width / 2;
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

    container.addChild(bitmap,textName);

    var textInformationQuadrantI = new createjs.Text("∞","16px Arial","red");
    textInformationQuadrantI.x = node.x+(bitmap.image.width/3)
    textInformationQuadrantI.y = node.y-(bitmap.image.height/3)
    textInformationQuadrantI.id = node.id;
    textInformationQuadrantI.name = "nodeInformationQuadrantIText_" + node.id;
    textInformationQuadrantI.visible = false;

    container.addChild(bitmap,textInformationQuadrantI);

}

function addEdgeBetweenNodes(nodes,edges)
{
    if(edgeFromNodeToNode(nodes[0],nodes[1],edges))
    {
        console.log("there already is an edge between these nodes");
    }
    else if(currentCanvas.directed == false && edgeFromNodeToNode(nodes[1],nodes[0],edges))
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

        drawEdges(edges);
    }
    
    
}
function removeEdgeBetweenNodes(nodes,edges)
{
    let oldEdges = edges.slice(0);
    //var edge = new Edge(edges.length,nodes);
    for(let i = 0; i<edges.length; i++)
    {
        //if((edges[i].nodes[0]==nodes[0]||edges[i].nodes[0]==nodes[1])&&(edges[i].nodes[1]==nodes[0]||edges[i].nodes[1]==nodes[1])) //check if edge exists
        if((edges[i].nodes[0].id==nodes[0].id) && (edges[i].nodes[1].id==nodes[1].id))
        {
            /*for(let j = edges[i].id; j < edges.length-1; j++)
            {
                let edgeWeight = stage[currentCanvasId].getChildByName("edgeWeight_"+edges[j].id)
                edgeWeight = stage[currentCanvasId].getChildByName("edgeWeight_"+edges[j+1])
                edgeWeight.id = (stage[currentCanvasId].getChildByName("edgeWeight_"+edges[j].id))-1
                this.parent.addChild(edgeWeight);

            }*/
            console.log("removing edge: "+edges[i].id)
            console.log("removing "+(containers[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id)).name)
            //stage[currentCanvasId].removeChild(stage[currentCanvasId].getChildByName("edgeWeight_"+edges[i].length));

            //let text = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+edges[i].id);
            //text.parentNode.removeChild(text);

            //drawEdges(edges,oldEdges);


            /*for(let j = edges[i].id+1; j < edges.length-1; j++)
            {
                
                console.log("id je:"+j)
                
                //tohle je špatně
                stage[currentCanvasId].removeChild(stage[currentCanvasId].getChildByName("edgeWeight_"+edges[i].id));

                let edgeWeight = stage[currentCanvasId].getChildByName("edgeWeight_"+edges[j].id);
                edgeWeight.id = edgeWeight.id-1;
                edgeWeight.name = "edgeWeight_" + edges[j].id-1;
                stage[currentCanvasId].addChild(edgeWeight);
                
                
                let text = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+edges[j].id);
                let index = edges[j].id+1
                console.log("zkousim edgeWeightText_:"+index);
                console.log("edges length: "+edges.length);
                let nextTextInnerHTML = (document.getElementById("edgeWeightText_"+currentCanvasId+"_"+(index))).innerHTML;
                text.innerHTML = nextTextInnerHTML;

                text.id = "edgeWeightText_"+currentCanvasId+"_"+edgeWeight.id;

            }*/
            let indexDeleted = edges[i].id;
            console.log("indexDeleted je:"+indexDeleted)
            console.log("edges length je:"+edges.length)

            

            let edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+indexDeleted);
            //text.parentNode.removeChild(text)
            console.log("deleting : "+edgeWeightText.id)
            edgeWeightText.remove();
            
            containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("edgeWeight_"+indexDeleted));
            

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

            }

            for(let j = edges[i].id; j < edges.length-1; j++)
            {
                

                edges[j]=edges[j+1];
                edges[j].id=(edges[j].id)-1;

                
                /*let selectedLine = this.parent.getChildByName("line_"+(i+1));
                selectedLine.id=selectedLine.id-1;
                selectedLine.name="bmpNode_"+i;
                this.parent.addChild(selectedLine);*/
            }
            
            
            
            //containers[currentCanvasId].removeChild(containers[currentCanvasId].getChildByName("edgeWeight_"+edges.length-1));

            //let index = edges.length-1
            //let edgeWeightText = document.getElementById("edgeWeightText_"+currentCanvasId+"_"+index);
            //edgeWeightText.remove();
            

            edges.pop();
            console.log(edges);
            


            

            
            //this.parent.removeChild(this.parent.getChildByName("line_"+edges[i].id));
        }
    }
    drawEdges(edges,oldEdges);
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
            console.log("delam")
            edgesToBeRemoved.push(edges[i]);
        }
    }

    for(let i = 0; i<edgesToBeRemoved.length; i++)
    {
        removeEdgeBetweenNodes(edgesToBeRemoved[i].nodes,edges);
    }

    drawEdges(edges,oldEdges);
}

function removeNode(bitmap, nodes, edges)
{
    var oldEdges = edges.slice(0);
    var parent = bitmap.parent;
            console.log(nodes)
            removeAllEdgesFromNode(nodes[bitmap.id],nodes,edges);
            //drawEdges(edges);
            for(var i = bitmap.id; i < nodes.length-1; i++)
            {
                console.log("stalo se");
                nodes[i]=nodes[i+1];
                nodes[i].id=(nodes[i].id)-1;
                var selectedBitmap = parent.getChildByName("bmpNode_"+(i+1));
                selectedBitmap.id=selectedBitmap.id-1;
                selectedBitmap.name="bmpNode_"+i;
                parent.addChild(selectedBitmap);

                var textName = parent.getChildByName("nodeNameText_"+selectedBitmap.id);
                textName.x=selectedBitmap.x-textoffset;
                textName.y=selectedBitmap.y-textoffset-3;
                parent.addChild(textName);

                var textInformationQuadrantI =  parent.getChildByName("nodeInformationQuadrantIText_"+selectedBitmap.id);
                textInformationQuadrantI.x = selectedBitmap.x+(bitmap.image.width/3)
                textInformationQuadrantI.y = selectedBitmap.y-(bitmap.image.height/3)
                parent.addChild(textInformationQuadrantI);

            }
            nodes.pop();

            //cleanupnu smycku vytvorenou mezi smazanym edgem
            for(var i = 0; i<edges.length; i++)
            {
                if((edges[i].nodes[0].id===edges[i].nodes[1].id))
                {
                    console.log("HALO HALO");
                    for(var j = edges[i].id; j < edges.length-1; j++)
                    {
                        edges[j]=edges[j+1];
                        edges[j].id=(edges[j].id)-1;
                    }
                    edges.pop();
                }
            }

            drawEdges(edges,oldEdges);

            parent.removeChild(parent.getChildByName("nodeNameText_"+nodes.length));
            var textName = document.getElementById("nodeNameText_"+currentCanvasId+"_"+nodes.length);
            textName.parentNode.removeChild(textName);

            parent.removeChild(parent.getChildByName("nodeInformationQuadrantIText_"+nodes.length));
            
            parent.removeChild(bitmap);
}

function getNodeUsingId(id)
{
    for(var i = 0; i < canvasGraphs[currentCanvasId].nodes.length; i++)
    {
        if(canvasGraphs[currentCanvasId].nodes[i].id == id)
        {
            return canvasGraphs[currentCanvasId].nodes[i];
        }
    }
    return null;
}


function toggleNodeInformationQuadrantIVisibility()
{
    canvasGraphs[currentCanvasId].nodes.forEach(node => {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).visible ^= true;
    });
}

function disableNodeInformationQuadrantIVisibility()
{
    canvasGraphs[currentCanvasId].nodes.forEach(node => {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).visible = false;
    });
}

function clearNodeInformationQuadrantIText()
{
    canvasGraphs[currentCanvasId].nodes.forEach(node => {
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
        console.log("time discovered completed text: "+timeDiscoveredCompletedText);
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
        console.log("time discovered completed text: "+timeDiscoveredCompletedText);
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

function updateNodeInformationQuadrantIForBiconnectivity(node)
{
    if(node.lowpt!=null)
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "[" + node.lowpt +"]";
        if(node.number!=null)
        {
            containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text += "/" +node.number;
        }
    }
    else
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    }
    
    update=true;
}

function clearNodesInformationQuadrantIForNodeInCanvas()
{
    for(node of canvasGraphs[currentCanvasId].nodes)
    {
        containers[currentCanvasId].getChildByName("nodeInformationQuadrantIText_"+node.id).text = "";
    }    
    update=true;
}

function toggleWeightedEdgesVisibility()
{
    canvases[currentCanvasId].visible ^= true;
    drawEdges(canvasGraphs[currentCanvasId].edges);
}

function bindFunctionalityToBitmap(node,bitmap,edges,nodes) {

    bitmap.on("mousedown", function (evt) {
        //this.parent.addChild(this);
        console.log(""+bitmap.id);
        console.log(""+this.name)
        console.log(edges)
        console.log(nodes);
        
        this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        if(addEdgeFlag==true)
        {
            if(selectedNodesNumber<1)
            {
                selectedNodesNumber++;
                selectedNodes.push(nodes[bitmap.id]);
            }
            else
            {
                selectedNodes.push(nodes[bitmap.id]);
                addEdgeBetweenNodes(selectedNodes,edges);
                selectedNodesNumber=0;
                selectedNodes = []
                addEdgeFlag=false;
            }
        }
        else if(removeNodeFlag==true)
        {
            console.log("this je v tomhle pripade:");
            console.log(this);
            removeNode(bitmap,nodes,edges);
        }
        else if(removeEdgeFlag==true)
        {
            if(selectedNodesNumber<1)
            {
                selectedNodesNumber++;
                selectedNodes.push(nodes[bitmap.id]);
            }
            else
            {
                selectedNodes.push(nodes[bitmap.id]);
                removeEdgeBetweenNodes(selectedNodes,edges);
                selectedNodesNumber=0;
                selectedNodes = []
                removeEdgeFlag=false;
            }
        }
        update=true;
        removeNodeFlag=false;
    });

    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    bitmap.on("pressmove", function (evt) {

        node.x=evt.stageX + this.offset.x;
        node.y=evt.stageY + this.offset.y;
        this.x = node.x
        this.y = node.y

        for(var i = 0; i < edges.length; i++)
        {
            if(node.id===edges[i].nodes[0].id)
            {
                g.clear();
                edges[i].nodes[0]=node
                drawEdges(edges);
            }
            else if(node.id===edges[i].nodes[1].id)
            {
                g.clear();
                edges[i].nodes[1]=node
                drawEdges(edges);
            }
        }
        var textName = this.parent.getChildByName("nodeNameText_"+this.id);
        textName.x=node.x-textoffset;//textoffset;
        textName.y=node.y-textoffset-3;//textoffset;
        this.parent.addChild(textName);

        var textInformationQuadrantI = this.parent.getChildByName("nodeInformationQuadrantIText_"+this.id);
        textInformationQuadrantI.x = node.x+(bitmap.image.width/3)
        textInformationQuadrantI.y = node.y-(bitmap.image.height/3)
        this.parent.addChild(textInformationQuadrantI);

        // indicate that the stage should be updated on the next tick:
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
    bitmap.on("dblclick", function (evt) {
        
        for(var i = 0; i<canvasGraphs[currentCanvasId].nodes.length; i++)
        {
            containers[currentCanvasId].getChildByName("bmpNode_"+i).image=nodeImage;
        }
        this.image = selectedNodeImage;
        canvasGraphs[currentCanvasId].startingNode=node;
        update = true;
    });
}

function handleImageLoad(event) {
    var textoffset = 3;
    var bitmap;
    
    for(let i = 0; i < stage.length; i++)
    {
        containers[i] = new createjs.Container();
    }
    var text;
    

    for(let i = 0; i < stage.length; i++)
    {
        stage[i].addChild(containers[i]);
    }


    //const nodes = [];
    //const edges = [];

    for(var i = 0; i < 5; i++)
    {
        canvasGraphs[currentCanvasId].nodes.push(new Node(i,i,(currentCanvas.width * Math.random() | 0),(currentCanvas.height * Math.random() | 0)));
    }

    //canvasGraphs[currentCanvasId].edges.push(new Edge(0,[canvasGraphs[currentCanvasId].nodes[0],canvasGraphs[currentCanvasId].nodes[1]],1));
    //canvasGraphs[currentCanvasId].edges.push(new Edge(1,[canvasGraphs[currentCanvasId].nodes[1],canvasGraphs[currentCanvasId].nodes[2]],1));

    canvasGraphs[currentCanvasId].edges = [];

    addEdgeBetweenNodes([canvasGraphs[currentCanvasId].nodes[0],canvasGraphs[currentCanvasId].nodes[1]],canvasGraphs[currentCanvasId].edges);
    addEdgeBetweenNodes([canvasGraphs[currentCanvasId].nodes[1],canvasGraphs[currentCanvasId].nodes[2]],canvasGraphs[currentCanvasId].edges);

    for (var i = 0; i < canvasGraphs[currentCanvasId].nodes.length; i++) {

        bitmap = new createjs.Bitmap(node_image);
        addNodeToBitmap(canvasGraphs[currentCanvasId].nodes[i],containers[currentCanvasId],bitmap);

        // using "on" binds the listener to the scope of the currentTarget by default
        // in this case that means it executes in the scope of the button.
        bindFunctionalityToBitmap(canvasGraphs[currentCanvasId].nodes[i],bitmap,canvasGraphs[currentCanvasId].edges, canvasGraphs[currentCanvasId].nodes);
    }
    for(let i = 0; i < stage.length; i++)
    {
        stage[i].on("stagemousedown", function(evt) {
            if(addNodeFlag==true)
            {
                var newNode = new Node(canvasGraphs[currentCanvasId].nodes.length,canvasGraphs[currentCanvasId].nodes.length,(evt.stageX),(evt.stageY))
                canvasGraphs[currentCanvasId].nodes.push(newNode);
                console.log(newNode);
                console.log(canvasGraphs[currentCanvasId].nodes);
                var bitmap = new createjs.Bitmap(node_image);
                addNodeToBitmap(newNode,containers[currentCanvasId],bitmap);
                bindFunctionalityToBitmap(newNode,bitmap,canvasGraphs[currentCanvasId].edges,canvasGraphs[currentCanvasId].nodes);
                addNodeFlag=false;
                update = true;
            }
            /*else if(addEdge==true)
            {
                selectedNodesNumber++;
                selectedNodes.push()

                var newEdge = new Edge(edges.length,)
            }*/
            stage[currentCanvasId].update(event)
            /*for(let i =0; i<edges.length;i++)
            {
                console.log(""+stage.getChildByName("line_"+edges[i].id));
            }*/
            console.log("clicked in canvas "+currentCanvasId);
            //drawEdges(edges);

        });
    }


    drawEdges(canvasGraphs[currentCanvasId].edges);

    examples.hideDistractor();
    createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
    // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
    if (update) {
        update = false; // only update once
        stage[currentCanvasId].update(event);
    }
}

function addNodeBtnClicked() {
    addNodeFlag=!addNodeFlag;
}
function addEdgeBtnClicked() {
    addEdgeFlag=!addEdgeFlag;
}
function removeNodeBtnClicked() {
    removeNodeFlag=!removeNodeFlag;
}
function removeEdgeBtnClicked() {
    removeEdgeFlag=!removeEdgeFlag;
}
function stepForwardBtnClicked() {
    stepForwardFlag=true;
}
/*function startSimulation() {
    console.log("starting simulation");

    if(currentCanvasId == 0)
    {
        startBSF();
    }
}*/

