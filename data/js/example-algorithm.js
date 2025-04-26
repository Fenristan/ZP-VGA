
class ExampleAlgorithm extends Algorithm
{
    constructor()
    {
        super();
        //this.someProperty = 0;
    }

    drawStep()
    {
        for(var u of currentCanvasGraph.nodes)
        {

            updateNodeBitmapColor(u);
    
            //updateNodeInformationQuadrantIFor<ExampleAlgorithm>(u);
        }
        for(var edge of currentCanvasGraph.edges)
        {
            edge.changed = true;
        }
        drawEdges();
        //render<ExampleAlgorithm>Grid();
        //drawTree<ExampleAlgorithm>();
    }
    
    
    
    async startAlgorithm(){
    
        this.originalGraph = currentCanvasGraph;

        currentCanvasGraph = currentCanvasGraph.getCurrentGraphCopy();
    
        toggleNodeInformationQuadrantIVisibility();
        showCurrentVisNetwork();
    
        this.ExampleAlgorithm();
    
        canvasFlags[currentCanvasId].runningFlag = true;
        
        var step = 0;
        var lastStep = this.graphStepsHistory.length;
    
        while(canvasFlags[currentCanvasId].stopFlag != true)
        {
    
            currentCanvasGraph = this.graphStepsHistory[step];
    
            this.drawStep();
    
            await Promise.race([createClickListenerPromise(CurrentRestartButton), createClickListenerPromise(CurrentStepBackwardsButton), createClickListenerPromise(CurrentStepForwardButton)]);
    
            if(canvasFlags[currentCanvasId].stepBackwardsFlag == true)
            {
                if(step != 0)
                {
                    step--;
                }
                canvasFlags[currentCanvasId].stepBackwardsFlag = false;
            }
            else if(canvasFlags[currentCanvasId].restartFlag == true)
            {
                step = 0;
                canvasFlags[currentCanvasId].restartFlag = false;
            }

            else
            {
                if(step < lastStep-1)
                {
                    step++;
                }
            }
        }
        this.resetGraph();

    }

    ExampleAlgorithm()
    {
        //implementation of the algorithm goes here
    }
}

