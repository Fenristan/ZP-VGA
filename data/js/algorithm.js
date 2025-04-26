class Algorithm
{
    constructor()
    {
        this.graphStepsHistory = [];
        this.originalGraph = null;
    }

    saveStepToHistory()
    {
        var canvasGraphCopy = currentCanvasGraph.getCurrentGraphCopy();
        this.graphStepsHistory.push(canvasGraphCopy);
        currentCanvasGraph.stepCounter++;
    }

    resetGraph()
    {
        currentCanvasGraph = this.originalGraph;
        
        this.graphStepsHistory = [];
    
        clearGrid();
    
        resetGraph();
    }
}