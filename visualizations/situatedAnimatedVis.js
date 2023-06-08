function situatedAnimatedChart(data, div, title) {
  const margin = {top: 40, right: 20, bottom: 40, left: 100};

  const visWidth = 700;
  const visHeight = 400;

  let x;
  let xAxis;
  let xAxisgroup;
  let bars;
  let barwidth;

  function chart() {
    const svg = div.append('svg')
        .attr('width', visWidth)
        .attr('height', visHeight);

    svg.append("clipPath")
        .attr("id", "border")
      .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", visWidth - margin.left - margin.right)
        .attr("height", visHeight - margin.top - margin.bottom)
        .attr("fill", "white");

    const barsgroup = svg.append("g")
      .attr("clip-path", "url(#border)");

    // add title

    svg.append("text")
      .attr("x", visWidth / 2)
      .attr("y", 5)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .text(title);

    // create scales

    x = d3.scaleLinear()
      .domain([0.5, 10.5])
      .range([margin.left, visWidth - margin.right]);

    const y = d3.scaleLinear()
      .domain([0,100])
      .range([visHeight - margin.bottom, margin.top]);
    
    // create and add axes

    xAxis = d3.axisBottom(x).ticks(10);

    xAxisgroup = svg.append("g")
      .attr("transform", `translate(0,${visHeight - margin.bottom})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(y);

    const yAxisgroup = svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    // draw bars

    barwidth = x(1) - x(0) - 2;

    bars = barsgroup.selectAll("rect")
      .data(data)
      .join("rect")
        .attr("x", d => x(d.index) - barwidth/2)
        .attr("y", d => y(d.rand))
        .attr("width", barwidth)
        .attr("height", d => y(0) - y(d.rand))
        .attr("fill", "steelblue");

  }

  chart.update = function (step, duration) {
    x.domain([0.5 + step, 10.5 + step]);
    const t = d3.transition().duration(duration);
    bars.transition(t).attr("x", d => x(d.index) - barwidth/2);
    xAxisgroup.transition(t).call(xAxis);
  }

  return chart;
}