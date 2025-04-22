const canvases = document.getElementsByClassName("canvas");

const canvasContainersDOMs = document.getElementsByClassName("canvas-container-hidden");
const canvasContainers = [];
for(let i = 0; i < canvasContainersDOMs.length; i++)
{
    canvasContainers.push(canvasContainersDOMs[i]);
}

const menuOptionsDOMs = document.getElementsByClassName("menuOption");
const menuOptions = [];
for(let i = 0; i < menuOptionsDOMs.length; i++)
{
    menuOptions.push(menuOptionsDOMs[i]);
}

var stages = [];
var containers = [];

var canvasGraphs = [];
var canvasFlags = [];

for(let i = 0; i < canvases.length; i++)
{
    stages.push(new createjs.Stage(canvases[i]));
    canvasGraphs.push(new Graph(i));
    canvasFlags.push({ addNodeFlag: false, addEdgeFlag: false, removeNodeFlag: false, removeEdgeFlag: false, stopFlag: false, restartFlag: false, runningFlag: false, automaticAdvanceFlag: false});
    containers[i] = new createjs.Container();
}

for(let i = 0; i < stages.length; i++)
{
    stages[i].addChild(containers[i]);
}

canvasGraphs[0].directed = true;
canvasGraphs[1].directed = true;
canvasGraphs[2].directed = true;
canvasGraphs[3].directed = true;
canvasGraphs[4].directed = false;
canvasGraphs[5].directed = true;

canvasGraphs[0].weighted = false;
canvasGraphs[1].weighted = false;
canvasGraphs[2].weighted = true;
canvasGraphs[3].weighted = false;
canvasGraphs[4].weighted = false;
canvasGraphs[5].weighted = false;

canvasGraphs[0].algorithm = new Depth_First_Search;
canvasGraphs[1].algorithm = new Breadth_First_Search;
canvasGraphs[2].algorithm = new Dijkstra;
canvasGraphs[3].algorithm = new Tarjan;
canvasGraphs[4].algorithm = new Biconnectivity;



const menuCardsContainer = document.getElementsByClassName("menu-cards-container")[0];
const BackToMenuButton = document.getElementById('back');
const SaveButton = document.getElementById('save');
const LoadButton = document.getElementById("load");
const file = document.getElementById("file");
//const StopButton = document.getElementById('restart');
//const StartStopButton = document.getElementById('start');
//const StepForwardButton = document.getElementById('stepforward');

const RestartButtons = document.getElementsByClassName("restart");
const StartStopButtons = document.getElementsByClassName("start");
const StepForwardButtons = document.getElementsByClassName("stepforward");
const StepBackwardsButtons = document.getElementsByClassName("stepback");
const PlayPauseAutoButtons = document.getElementsByClassName("play_auto");

var CurrentRestartButton = null;
var CurrentStartStopButton = null;
var CurrentStepForwardButton = null;
var CurrentStepBackwardsButton = null;
var CurrentPlayPauseAutoButton = null;

var currentCanvasId = 0;
var currentCanvasGraph = null;
var currentCanvasFlags = null;
var canvas;
var context;

var startStopButtonsStates = [];
var playPauseAutoButtonsStates = [];

var timeIntervalSliderInputs = document.getElementsByClassName("time-interval-slider-input");





function createClickListenerPromise (target) {
    
    return new Promise((resolve) => target.addEventListener('click', resolve))
}

function toggleCurrentPlayPauseAutoButton()
{
    playPauseAutoButtonsStates[currentCanvasId] ^= true;

    if(playPauseAutoButtonsStates[currentCanvasId] == true)
    {
        PlayPauseAutoButtons[currentCanvasId].src = pauseAutoImage.src;
    }
    else
    {
        PlayPauseAutoButtons[currentCanvasId].src = playAutoImage.src;
    }
}

function toggleCurrentStartStopButton()
{
    startStopButtonsStates[currentCanvasId] ^= true;

    if(startStopButtonsStates[currentCanvasId] == true)
    {
        StartStopButtons[currentCanvasId].src = stopImage.src;
    }
    else
    {
        StartStopButtons[currentCanvasId].src = playImage.src;
    }
}

async function startAutomaticAdvance()
{
    
    var timeInterval = canvases[currentCanvasId].automaticAdvanceTimeInterval;
    var myFunction = function() {
        if(canvasFlags[currentCanvasId].automaticAdvanceFlag == false)
        {
            return;
        }

        CurrentStepForwardButton.click();

        timeInterval = canvases[currentCanvasId].automaticAdvanceTimeInterval;
        setTimeout(myFunction, timeInterval);
    }
    setTimeout(myFunction, timeInterval);
}

function setTimeInterval()
{
    canvases[currentCanvasId].automaticAdvanceTimeInterval = (6-Number(timeIntervalSliderInputs[currentCanvasId].value))*300;
}

function setFunctionToMenuOption(menuOption, index)
{
    menuOption.addEventListener("click",displayCanvas);
    menuOption.index = index;
}   

function displayCanvas(evt)
{
    menuCardsContainer.classList.add('canvas-container-hidden');
    BackToMenuButton.classList.remove('back-hidden');
    SaveButton.classList.remove('save-hidden');
    LoadButton.classList.remove('load-hidden');
    //StopButton.classList.remove('restart');
    //StartStopButton.classList.remove('start');
    //StepForwardButton.classList.remove('stepforward');
    currentCanvasId = evt.currentTarget.index;

    currentCanvasGraph = canvasGraphs[currentCanvasId];
    currentCanvasFlags = canvasFlags[currentCanvasId];

    CurrentRestartButton = RestartButtons[currentCanvasId];
    CurrentStartStopButton = StartStopButtons[currentCanvasId];
    CurrentStepForwardButton = StepForwardButtons[currentCanvasId];
    CurrentStepBackwardsButton = StepBackwardsButtons[currentCanvasId];
    CurrentPlayPauseAutoButton = PlayPauseAutoButtons[currentCanvasId];

    let canvasContainerId = "canvas-container" + evt.currentTarget.index;
    console.log("canvas: "+evt.currentTarget.index);

    //canvas = canvases[currentCanvasId];
    //context = canvas.getContext("2d");

    stages[currentCanvasId].enableMouseOver(10);
    //stages[currentCanvasId].mouseMoveOutside = true;

    /*canvasContainers.forEach(function (canvasContainer){
        if(canvasContainer.id != canvasContainerId)
        {
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
        }
    });*/

    document.getElementById(canvasContainerId).classList.remove('canvas-container-hidden');
    document.getElementById(canvasContainerId).classList.add('canvas-container-visible') ;

    //console.log(evt.currentTarget.index);
    //img = new Image();
    //const canvas = canvases[evt.currentTarget.index].getContext('2d');
    //img.src = "assets/images/image.png";
    //canvas.drawImage(img, 0,0);

    //update = true;
};

function checkBoxDirectedClicked(evt)
{
    //if canvas was undirected and I am switching to a directed graph, make sure that all edges are now multigraphs
    if(currentCanvasGraph.directed == false)
    {
        //alert("You are switching from an undirected graph to a directed one. If there are any edges, they will be deleted.");
        /*for(node of currentCanvasGraph.nodes)
        {
            removeAllEdgesFromNode(node,currentCanvasGraph.nodes,currentCanvasGraph.edges);
        }*/
        currentCanvasGraph.directed ^= true;
        transformUndirectedToDirected();
    }
    else
    {
        
        transformDirectedToUndirected();
        currentCanvasGraph.directed ^= true;
    }
    
    for(edge of currentCanvasGraph.edges)
    {
        edge.changed = true;
    }
    
    drawEdges();
}

function setFunctionToCheckboxDirected(checkboxDirected)
{
    checkboxDirected.addEventListener("click",checkBoxDirectedClicked);
}   

function checkBoxWeightedClicked(evt)
{
    currentCanvasGraph.weighted ^= true;
    toggleWeightedEdgesVisibility();
    update=true;
}

function setFunctionToCheckboxWeighted(checkboxWeighted)
{
    checkboxWeighted.addEventListener("click",checkBoxWeightedClicked);
}   


canvasContainers.forEach(function (canvasContainer){
    checkboxDirected = canvasContainer.querySelector("#checkboxDirected");
    setFunctionToCheckboxDirected(checkboxDirected);

    checkboxWeighted = canvasContainer.querySelector("#checkboxWeighted");
    setFunctionToCheckboxWeighted(checkboxWeighted);
});

function showCurrentVisNetwork()
{
    var visNetwork = document.getElementById("visNetworkCanvas"+currentCanvasId);
    visNetwork.classList.remove('hidden');
    visNetwork.classList.add('visNetwork');

}

function hideCurrentVisNetwork()
{
    var visNetwork = document.getElementById("visNetworkCanvas"+currentCanvasId);
    visNetwork.classList.remove('visNetwork');
    visNetwork.classList.add('hidden');
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

    currentCanvasGraph.selectedNodes = [];
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

    currentCanvasGraph.selectedNodes = [];
}

menuOptions.forEach(setFunctionToMenuOption)

BackToMenuButton.addEventListener("click", function(){
    menuCardsContainer.classList.remove('canvas-container-hidden');
    BackToMenuButton.classList.add('back-hidden');
    SaveButton.classList.add('save-hidden');
    LoadButton.classList.add('load-hidden');
    //StopButton.classList.add('restart');
    //StartStopButton.classList.add('start');
    //StepForwardButton.classList.add('stepforward');

    /*canvasContainers.forEach(function (canvasContainer){
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
    });*/

    canvasContainers[currentCanvasId].classList.remove('canvas-container-visible');
    canvasContainers[currentCanvasId].classList.add('canvas-container-hidden');

    if(canvasFlags[currentCanvasId].automaticAdvanceFlag == true)
    {
        toggleCurrentPlayPauseAutoButton();
        canvasFlags[currentCanvasId].automaticAdvanceFlag = false;
    }

});

for (i = 0; i < StartStopButtons.length; i++)
{
    
    var StartStopButton = StartStopButtons[i];

    startStopButtonsStates[i] = false;
    playPauseAutoButtonsStates[i] = false;

    canvasFlags[currentCanvasId].automaticAdvanceFlag = false;

    StartStopButton.addEventListener("click", function(){

        CurrentStepForwardButton = StepForwardButtons[currentCanvasId]; //ummm asi ne
        CurrentStepBackwardsButton = StepBackwardsButtons[currentCanvasId];

        // after the start simulation button has been clicked, each node is assigned it's given name (text)
        currentCanvasGraph.nodes.forEach(node => {
            currentCanvasGraph.nodes[node.id].text = document.getElementById("nodeNameText_"+currentCanvasId+"_"+node.id).innerHTML;
            node.text = document.getElementById("nodeNameText_"+currentCanvasId+"_"+node.id).innerHTML;
        });
        //the same is true for weighted edges
        for(edge of currentCanvasGraph.edges)
        {
            currentCanvasGraph.edges[edge.id].weight = Number(document.getElementById("edgeWeightText_"+currentCanvasId+"_"+edge.id).innerHTML);
        }
    
        console.log("starting simulation");
        
        canvasFlags[currentCanvasId].stopFlag = false;
        //canvasFlags[currentCanvasId].automaticAdvanceFlag = false;
        

        if(startStopButtonsStates[currentCanvasId] == false)
        {
            //set the div housing the current canvas and it's controls as uninteractible.
            canvasContainers[currentCanvasId].getElementsByClassName("canvas-container-row")[0].style.pointerEvents = "none";

            if(currentCanvasGraph.startingNode == null)
            {
                currentCanvasGraph.startingNode = currentCanvasGraph.nodes[0];
            }

            currentCanvasGraph.algorithm.startAlgorithm();

            /*switch(currentCanvasId)
            {
                case 0:
                    currentCanvasGraph.algorithm.startAlgorithm();
                    break;
                case 1:
                    startBFS();
                    break;
                case 2:
                    startDijkstra();
                    break;  
                case 3:
                    startTarjan();
                    break;  
                case 4:
                    startBiconnectivity();
                    break;
                default:
                     
            }*/
        }
        else
        {
            //StopButton.click();
            canvasFlags[currentCanvasId].stopFlag = true;
            //when the search is supposed to end, check if automatic Advance wasn't runningFlag, if so, click the button, making it pause
            if(canvasFlags[currentCanvasId].automaticAdvanceFlag == true)
            {
                CurrentPlayPauseAutoButton.click();
            }
            CurrentStepForwardButton.click();
        }
        
        toggleCurrentStartStopButton();
        
    });
}



for(var RestartButton of RestartButtons)
{
    RestartButton.addEventListener("click", function(){
        canvasFlags[currentCanvasId].restartFlag = true;
    });
}

for(var StepBackwardsButton of StepBackwardsButtons)
{
    StepBackwardsButton.addEventListener("click", function(){
        canvasFlags[currentCanvasId].stepBackwardsFlag = true;
    });
}

for(var StartPauseAutoButton of PlayPauseAutoButtons)
{
    StartPauseAutoButton.addEventListener("click", function(){

        setTimeInterval();

        canvasFlags[currentCanvasId].automaticAdvanceFlag ^= true;
        if(canvasFlags[currentCanvasId].automaticAdvanceFlag == true)
        {
            startAutomaticAdvance();
        }
        toggleCurrentPlayPauseAutoButton();
    });
 
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