// Load the datasets and call the functions to make the visualizations

Promise.all([
  d3.csv('data/NormalSmallStepsDataset.csv'),
  d3.csv('data/NormalJumpDataset.csv'),
  d3.csv('data/NormalSmallStepsDataset.csv'),
  d3.csv('data/NormalSmallStepsDataset.csv'),
  d3.csv('data/NormalSmallStepsDataset.csv'),
  d3.csv('data/NormalSmallStepsDataset.csv')
]).then((datasets) => {
  const container = d3.select("#container");
  
  const buttonsContainer = container.append("div")
    .attr("id", "buttons-container");
  
  const buttonPause = buttonsContainer.append("button")
    .on("click", onPauseClick)
    .text("Pause")
  const buttonRestart = buttonsContainer.append("button")
    .on("click", onRestartClick)
    .text("Restart")

  const chartsContainer = container.append("div")
    .attr("id", "charts-container");
  
  const charts = [];
  const titles = ["Small Steps", "Jump", "Empty", "Nothing", "Filler", "Etc."]
  for (let i = 0; i < datasets.length; i++) {
    const div = chartsContainer.append("div");
    const chart = situatedAnimatedChart(datasets[i], div, titles[i]);
    chart();
    charts.push(chart);
  }
  
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

});
