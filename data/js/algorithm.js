class Algorithm
{
    constructor()
    {
        this.graphStepsHistory = [];
        this.originalGraph = null;
    }

    saveStepToHistory()
    {
        var canvasGraphCopy = getCurrentGraphCopy();
        this.graphStepsHistory.push(canvasGraphCopy);
        currentCanvasGraph.stepCounter++;
    }
}