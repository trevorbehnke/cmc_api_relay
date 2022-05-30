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
    .call(responsivefy)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //  X axis
  const xScale = d3.scaleBand().padding(0.2).range([0, width]);

  const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);

  // Y axis
  const yScale = d3.scaleLinear().range([height, 0]);

  const yAxis = svg.append("g").attr("class", "myYaxis");

  ////////
  //  Update Function
  ////////

  function update(data) {
    // Update the X axis
    xScale.domain(data.map((d) => d.name));
    xAxis
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Update the Y axis
    yScale.domain([0, d3.max(data, (d) => d.quote.USD.market_cap)]);
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

    var u = svg.selectAll("rect").data(data);

    u.join("rect")
      .transition()
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(0))
      .attr("width", xScale.bandwidth())
      .attr("height", () => height - yScale(0))
      .attr("fill", "#69b3a2")
      .transition()
      .attr("y", (d) => yScale(d.quote.USD.market_cap))
      .attr("height", (d) => height - yScale(d.quote.USD.market_cap))
      .delay((d, i) => {
        return i * 25;
      });
  }

  update(data);

  ////////
  //    Responsive Function
  ////////

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

  ////////
  //    Color Buttons
  ////////

  // green button
  const green_btn = document.getElementById("green_btn");
  green_btn.addEventListener("click", () => changeColor("#00DAC5"));

  // purple button
  const purple_btn = document.getElementById("purple_btn");
  purple_btn.addEventListener("click", () => changeColor("#BB86FC"));

  function changeColor(color) {
    d3.selectAll("rect").transition().style("fill", color);
  }
});
