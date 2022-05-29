// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 100 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.json("http://localhost:5001/api").then(function (data) {
  let top10 = data.data.slice(0, 10);

  // market cap dataset
  const mc_ds = top10.map((d) => ({
    name: d.name,
    market_cap: d.quote.USD.market_cap,
  }));

  // market pairs dataset
  const mp_ds = top10.map((d) => ({
    name: d.name,
    num_market_pairs: d.num_market_pairs,
  }));

  console.log(mp_ds);

  // X axis
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(top10.map((d) => d.name))
    .padding(0.2);

  // const xAxis = svg.append("g").attr("transform", `translate(0,${height})`);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Add Y axis
  const y = d3
    .scaleLinear()
    // .domain([
    //   0,
    //   d3.max(d, (d) => {
    //     d.quote.USD.market_cap;
    //   }),
    // ])
    .range([height, 0]);
  // svg.append("g").call(d3.axisLeft(y));

  const yAxis = svg.append("g").attr("class", "myYaxis");

  // // Bars
  // svg
  //   .selectAll("mybar")
  //   .data(top10)
  //   .join("rect")
  //   .attr("x", (d) => x(d.name))
  //   .attr("y", () => y(0))
  //   .attr("width", x.bandwidth())
  //   .attr("height", () => height - y(0))
  //   .attr("fill", "#69b3a2");

  // // Animation
  // svg
  //   .selectAll("rect")
  //   .transition()
  //   .duration(800)
  //   .attr("y", (d) => y(d.quote.USD.market_cap))
  //   .attr("height", (d) => height - y(d.quote.USD.market_cap))
  //   .delay((d, i) => {
  //     return i * 100;
  //   });

  // blue button
  const blue_btn = document.getElementById("blue_btn");
  blue_btn.addEventListener("click", () => changeColor("blue"));

  // red button
  const red_btn = document.getElementById("red_btn");
  red_btn.addEventListener("click", () => changeColor("red"));

  // market cap button
  const market_cap_btn = document.getElementById("market_cap_btn");
  market_cap_btn.addEventListener("click", () => update(mc_ds, "market_cap"));

  // market pairs button
  const market_pairs_btn = document.getElementById("market_pairs_btn");
  market_pairs_btn.addEventListener("click", () =>
    update(mp_ds, "num_market_pairs")
  );

  function changeColor(color) {
    d3.selectAll("rect").transition().duration(1000).style("fill", color);
  }

  function update(data, yValue) {
    // Update the X axis
    // x.domain(data.map((d) => d.name));
    // xAxis.call(d3.axisBottom(x));
    // svg
    //   .append("g")
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(d3.axisBottom(x))
    //   .selectAll("text")
    //   .attr("transform", "translate(-10,0)rotate(-45)")
    //   .style("text-anchor", "end");

    // Update the Y axis
    y.domain([0, d3.max(data, (d) => d[yValue])]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    var u = svg.selectAll("rect").data(data);

    u.join("rect") // Add a new rect for each new elements
      .transition()
      .duration(1000)
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d[yValue]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[yValue]))
      .attr("fill", "#69b3a2");
  }

  // Initialize the plot with the first dataset
  // update(mc_ds, "market_cap");
  update(mc_ds, "market_cap");
});
