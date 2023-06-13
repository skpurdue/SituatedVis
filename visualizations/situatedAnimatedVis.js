function situatedAnimatedChart(data, title, width = 700, height = 400) {
  const margin = { top: 40, right: 20, bottom: 40, left: 60 };

  const numbars = 10;
  const offset = 0.5;

  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height);

  const clipPath = svg.append("clipPath")
      .attr("id", "border")
    .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "white");

  const barsgroup = svg.append("g")
      .attr("clip-path", "url(#border)");

  // add title

  const titleText = svg.append("text")
    .attr("x", width / 2)
    .attr("y", 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text(title);

  // create scales

  const x = d3.scaleLinear()
    .domain([offset, numbars + offset])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  // create and add axes

  const xAxis = d3.axisBottom(x).ticks(numbars);

  const xAxisgroup = svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(y);

  const yAxisgroup = svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  // draw bars

  let barwidth = x(1) - x(0) - 2;

  const bars = barsgroup.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.index) - barwidth / 2)
    .attr("y", d => y(d.rand))
    .attr("width", barwidth)
    .attr("height", d => y(0) - y(d.rand))
    .attr("fill", d => d.index === numbars ? "red" : "steelblue");

  function update(step, duration) {
    x.domain([offset + step, numbars + offset + step]);
    const t = d3.transition("transmove").duration(duration);
    const t2 = d3.transition("transfill").duration(750);
    bars.transition(t)
      .attr("x", d => x(d.index) - barwidth / 2);
    xAxisgroup.transition(t).call(xAxis);
    bars.transition(t2).attr("fill", d => d.index === numbars + step ? "red" : "steelblue");
  }

  function resize(w, h) {
    width = w;
    height = h;

    svg.attr("width", width)
        .attr("height", height);

    x.range([margin.left, width - margin.right]);
    y.range([height - margin.bottom, margin.top]);

    clipPath.attr("width", width - margin.left - margin.right)
        .attr("height", height - margin.top - margin.bottom);

    title.attr("x", width / 2);

    barwidth = x(1) - x(0) - 2;

    bars.attr("x", d => x(d.index) - barwidth / 2)
        .attr("y", d => y(d.rand))
        .attr("width", barwidth)
        .attr("height", d => y(0) - y(d.rand))

    xAxisgroup.call(xAxis);
    yAxisgroup.call(yAxis);
  }

  Object.assign(svg.node(), {update, resize});

  return svg.node();
}