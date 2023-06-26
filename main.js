// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.csv('data/BasicNormal_Mean50_SD2_5_Set1.csv', d3.autoType),
  d3.csv('data/JumpNormal_Mean50to70_SD2_5_Set6.csv', d3.autoType),
  d3.csv('data/BasicNormal_Mean50_SD2_5_Set2.csv', d3.autoType),
  d3.csv('data/BasicNormal_Mean50_SD2_5_Set3.csv', d3.autoType),
  d3.csv('data/BasicNormal_Mean50_SD2_5_Set4.csv', d3.autoType),
  d3.csv('data/BasicNormal_Mean50_SD2_5_Set5.csv', d3.autoType)
]).then((datasets) => {

  const numCols = 3;
  const numRows = 2;

  const container = d3.select("#container");

  const chartsContainer = container.select("#charts-container")
      .style("grid-template-columns", `repeat(${numCols}, 1fr)`)
      .style("grid-template-rows", `repeat(${numRows}, 1fr)`)

  let gridWidth = chartsContainer.node().clientWidth;
  let gridHeight = chartsContainer.node().clientHeight;

  let cellWidth = gridWidth/numCols;
  let cellHeight = gridHeight/numRows;

  const titles = ["Machine 1", "Machine 2", "Machine 3", "Machine 4", "Machine 5", "Machine 6."]
  const charts = chartsContainer.selectAll("div")
    .data(d3.zip(datasets, titles))
    .join("div")
    .append(([data, title]) => situatedAnimatedChart(data, title, cellWidth, cellHeight))
    .nodes();

  const buttonPause = container.select("#pause")
    .on("click", onPauseClick);
  const buttonRestart = container.select("#restart")
    .on("click", onRestartClick);

  let isRunning = true;
  let intervalId;
  let step = 1;
  let durationTransition = 1500;
  let durationDelay = 3000;

  function animate() {
    for (const chart of charts) {
      chart.update(step, durationTransition);
    }
    step++;
  }

  function onPauseClick() {
    if (isRunning) {
      stopAnimation();
      buttonPause.text("Unpause");
    } else {
      animate();
      startAnimation();
      buttonPause.text("Pause");
    }
    isRunning = !isRunning;
  }

  function onRestartClick() {
    stopAnimation();
    step = 0;
    for (const chart of charts) {
      chart.update(step, durationTransition);
    }
    if (isRunning) {
      animate();
      startAnimation();
    }
  }

  function startAnimation() {
    intervalId = setInterval(animate, durationDelay);
  }
  function stopAnimation() {
    clearInterval(intervalId);
  }
  startAnimation();

  const resizeObserver = new ResizeObserver((entries) => {
    if (!entries) {
      return;
    }
    
    const entry = entries[0];
    
    if (entry.contentBoxSize) {
      const contentBoxSize = entry.contentBoxSize[0];
      gridWidth = contentBoxSize.inlineSize;
      gridHeight = contentBoxSize.blockSize;
    } else {
      gridWidth = entry.contentRect.width;
      gridHeight = entry.contentRect.height;
    }
    
    cellWidth = gridWidth/numCols;
    cellHeight = gridHeight/numRows;

    for (const chart of charts) {
      chart.resize(cellWidth, cellHeight);
    }

  });

  resizeObserver.observe(chartsContainer.node());

});
