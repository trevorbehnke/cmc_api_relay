d3.json("https://cmc-api-relay.herokuapp.com/api").then(function (res) {
  let data = res.data.slice(0, 10);

  const margin = { top: 10, right: 20, bottom: 60, left: 90 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  //   SVG
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy) // this is all it takes to make the chart responsive
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //  X axis
  const xScale = d3
    .scaleBand()
    .padding(0.2)
    .domain(data.map((d) => d.name))
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.quote.USD.market_cap)])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(yScale));

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d.name))
    .attr("y", (d) => yScale(d.quote.USD.market_cap))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - yScale(d.quote.USD.market_cap))
    .attr("fill", "#69b3a2");

  // https://codepen.io/bclinkinbeard/pen/gGPvrz
  function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10),
      aspect = width / height;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {
      const targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }
  }
});
