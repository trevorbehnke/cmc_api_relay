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

  function update(set) {
    //   create a switch statement to determine which data set to use
    let dataSet;
    switch (set) {
      case "mc":
        dataSet = data.map((d) => ({
          x: d.name,
          y: d.quote.USD.market_cap,
        }));
        break;
      case "mp":
        dataSet = data.map((d) => ({
          x: d.name,
          y: d.num_market_pairs,
        }));
        break;
      default:
        break;
    }

    // Update the X axis
    xScale.domain(dataSet.map((d) => d.x));
    xAxis
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Update the Y axis
    yScale.domain([0, d3.max(dataSet, (d) => d.y)]);
    yAxis.transition().call(d3.axisLeft(yScale));

    let u = svg.selectAll("rect").data(dataSet);

    u.join("rect")
      .transition()
      .attr("x", (d) => xScale(d.x))
      .attr("y", () => yScale(0))
      .attr("width", xScale.bandwidth())
      .attr("height", () => height - yScale(0))
      .attr("fill", "#00DAC5")
      .transition()
      .attr("y", (d) => yScale(d.y))
      .attr("height", (d) => height - yScale(d.y))
      .delay((d, i) => {
        return i * 25;
      });
  }

  update("mc");

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

  ////////
  //    Update Buttons
  ////////

  // market cap button
  const market_cap_btn = document.getElementById("market_cap_btn");
  market_cap_btn.addEventListener("click", () => update("mc"));

  // market pairs button
  const market_pairs_btn = document.getElementById("market_pairs_btn");
  market_pairs_btn.addEventListener("click", () => update("mp"));
});
