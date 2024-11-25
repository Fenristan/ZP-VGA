const canvas0 = document.getElementById('canvas0');
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const canvas4 = document.getElementById('canvas4');
const canvas5 = document.getElementById('canvas5');

canvas0.directed = false;
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

for(let i = 0; i < canvases.length; i++)
{
    stage.push(new createjs.Stage(canvases[i]));
    canvasStorages.push({ nodes: [], edges: [] });
}

for(let i = 0; i < stage.length; i++)
{

}


const menuCardsContainer = document.getElementsByClassName("menu-cards-container")[0];
const BackToMenuButton = document.getElementById('back');

var currentCanvasId = 0;
var canvas;
var context;

BackToMenuButton.addEventListener("click", function(){
    menuCardsContainer.classList.remove('canvas-container-hidden');
    BackToMenuButton.classList.add('back');

    canvasContainers.forEach(function (canvasContainer){
            canvasContainer.classList.remove('canvas-container-visible');
            canvasContainer.classList.add('canvas-container-hidden');
    });

});

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
    currentCanvasId = evt.currentTarget.index;

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
