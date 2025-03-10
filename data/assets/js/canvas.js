

const canvas0 = document.getElementById('canvas0');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const canvas4 = document.getElementById('canvas4');
const canvas5 = document.getElementById('canvas5');

canvas0.directed = true;
canvas1.directed = true;
canvas2.directed = true;
canvas3.directed = true;
canvas4.directed = true;
canvas5.directed = true;

canvas0.weighted = false;
canvas1.weighted = false;
canvas2.weighted = true;
canvas3.weighted = false;
canvas4.weighted = false;
canvas5.weighted = false;

const canvases = [];
canvases.push(canvas0);
canvases.push(canvas1);
canvases.push(canvas2);
canvases.push(canvas3);
canvases.push(canvas4);
canvases.push(canvas5);


const canvasContainer0 = document.getElementById('canvas-container0');
const canvasContainer1 = document.getElementById('canvas-container1');
const canvasContainer2 = document.getElementById('canvas-container2');
const canvasContainer3 = document.getElementById('canvas-container3');
const canvasContainer4 = document.getElementById('canvas-container4');
const canvasContainer5 = document.getElementById('canvas-container5');

const canvasContainers = [];
canvasContainers.push(canvasContainer0);
canvasContainers.push(canvasContainer1);
canvasContainers.push(canvasContainer2);
canvasContainers.push(canvasContainer3);
canvasContainers.push(canvasContainer4);
canvasContainers.push(canvasContainer5);


const menuOption1 = document.querySelector("#menuOption0");
const menuOption2 = document.querySelector("#menuOption1");
const menuOption3 = document.querySelector("#menuOption2");
const menuOption4 = document.querySelector("#menuOption3");
const menuOption5 = document.querySelector("#menuOption4");
const menuOption6 = document.querySelector("#menuOption5");

const menuOptions = [];

menuOptions.push(menuOption1);
menuOptions.push(menuOption2);
menuOptions.push(menuOption3);
menuOptions.push(menuOption4);
menuOptions.push(menuOption5);
menuOptions.push(menuOption6);

var stage = []

var canvasFlags = [];

for(let i = 0; i < canvases.length; i++)
{
    stage.push(new createjs.Stage(canvases[i]));
    canvasGraphs.push({ nodes: [], edges: [], selectedNodes: [], visitedEdges: [], startingNode: null, stepCounter: 0 });
    canvasFlags.push({ stopFlag: false, restartFlag: false, running: false});
}


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

var CurrentRestartButton = null;
var CurrentStartStopButton = null;
var CurrentStepForwardButton = null;
var CurrentStepBackwardsButton = null;

var currentCanvasId = 0;
var canvas;
var context;

var startStopButtonsStates = [];




BackToMenuButton.addEventListener("click", function(){
    menuCardsContainer.classList.remove('canvas-container-hidden');
    BackToMenuButton.classList.add('back');
    SaveButton.classList.add('save');
    LoadButton.classList.add('load');
    //StopButton.classList.add('restart');
    //StartStopButton.classList.add('start');
    //StepForwardButton.classList.add('stepforward');

    canvasContainers.forEach(function (canvasContainer){
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
    });

});

function createClickListenerPromise (target) {
    
    return new Promise((resolve) => target.addEventListener('click', resolve))
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

for (i = 0; i < StartStopButtons.length; i++)
{
    
    var StartStopButton = StartStopButtons[i];

    startStopButtonsStates[i] = false;

    StartStopButton.addEventListener("click", function(){

        CurrentStepForwardButton = StepForwardButtons[currentCanvasId];
        CurrentStepBackwardsButton = StepBackwardsButtons[currentCanvasId];

        // after the start simulation button has been clicked, each node is assigned it's given name (text)
        canvasGraphs[currentCanvasId].nodes.forEach(node => {
            console.log("assigning name to node: "+node.id);
            canvasGraphs[currentCanvasId].nodes[node.id].text = document.getElementById("nodeNameText_"+currentCanvasId+"_"+node.id).innerHTML;
            node.text = document.getElementById("nodeNameText_"+currentCanvasId+"_"+node.id).innerHTML;
            console.log("node is now called: " + canvasGraphs[currentCanvasId].nodes[node.id].text);
        });
    
        console.log("starting simulation");
        
        canvasFlags[currentCanvasId].stopFlag = false;

        

        if(startStopButtonsStates[currentCanvasId] == false)
        {
            if(currentCanvasId == 0)
            {
                startDFS(createClickListenerPromise(CurrentStepForwardButton));
            }
            else if(currentCanvasId == 1)
            {
                startBFS(createClickListenerPromise(CurrentStepForwardButton));
            }
        }
        else
        {
            //StopButton.click();
            canvasFlags[currentCanvasId].stopFlag = true;
            CurrentStepForwardButton.click();
        }
        
        toggleCurrentStartStopButton();
        
    });
}

/*for(var StopButton of StopButtons)
{
    StopButton.addEventListener("click", function(){
        //if there is a running simulation, stop it
        stopFlag = true;
        CurrentStepForwardButton.click();
    
    
    });
}*/

for(var RestartButton of RestartButtons)
    {
        RestartButton.addEventListener("click", function(){
            //if there is a running simulation, stop it
            //canvasFlags[currentCanvasId].stopFlag = true;
            canvasFlags[currentCanvasId].restartFlag = true;
            //CurrentStepForwardButton.click();
        
        });
    }

for(var StepBackwardsButton of StepBackwardsButtons)
{
    StepBackwardsButton.addEventListener("click", function(){
        //if there is a running simulation, stop it and set stepBackwardsFlag to true.
        //canvasFlags[currentCanvasId].stopFlag = true;
        stepBackwardsFlag = true;
        //CurrentStepForwardButton.click(); 
    });
}

  

/*StepForwardButton.addEventListener("click", function(){

    stepForwardFlag = true;
});*/

function setFunctionToMenuOption(menuOption, index)
{
    menuOption.addEventListener("click",displayCanvas);
    menuOption.index = index;
}   

menuOptions.forEach(setFunctionToMenuOption)

/*window.onload = function() {
    //loadCanvas()
}*/
function displayCanvas(evt)
{
    menuCardsContainer.classList.add('canvas-container-hidden');
    BackToMenuButton.classList.remove('back');
    SaveButton.classList.remove('save');
    LoadButton.classList.remove('load');
    //StopButton.classList.remove('restart');
    //StartStopButton.classList.remove('start');
    //StepForwardButton.classList.remove('stepforward');
    currentCanvasId = evt.currentTarget.index;

    CurrentRestartButton = RestartButtons[currentCanvasId];
    CurrentStartStopButton = StartStopButtons[currentCanvasId];
    CurrentStepForwardButton = StepForwardButtons[currentCanvasId];
    CurrentStepBackwardsButton = StepBackwardsButtons[currentCanvasId];

    let canvasContainerId = "canvas-container" + evt.currentTarget.index;
    console.log("canvas: "+evt.currentTarget.index);

    canvas = canvases[currentCanvasId];
    context = canvas.getContext("2d");

    stage[currentCanvasId].enableMouseOver(10);
    stage[currentCanvasId].mouseMoveOutside = true;

    canvasContainers.forEach(function (canvasContainer){
        if(canvasContainer.id != canvasContainerId)
        {
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
        }
    });

    document.getElementById(canvasContainerId).classList.remove('canvas-container-hidden');
    document.getElementById(canvasContainerId).classList.add('canvas-container-visible') ;

    console.log(evt.currentTarget.index);
    img = new Image();
    //const canvas = canvases[evt.currentTarget.index].getContext('2d');
    //img.src = "assets/images/image.png";
    //canvas.drawImage(img, 0,0);

    update = true;
};

function checkBoxDirectedClicked(evt)
{
    for(node of canvasGraphs[currentCanvasId].nodes)
    {
        removeAllEdgesFromNode(node,canvasGraphs[currentCanvasId].nodes,canvasGraphs[currentCanvasId].edges);
    }
    
    canvases[currentCanvasId].directed ^= true;
    console.log(canvases)
    update=true;
}

function setFunctionToCheckboxDirected(checkboxDirected)
{
    checkboxDirected.addEventListener("click",checkBoxDirectedClicked);
}   

function checkBoxWeightedClicked(evt)
{
    canvases[currentCanvasId].weighted ^= true;
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