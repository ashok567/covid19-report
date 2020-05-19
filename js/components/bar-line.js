/* exported draw_bar */

function draw_bar(data){
  var div_width = $('#bar_div').width()
  var margin = {top: 20, right: 40, bottom: 30, left: 50},
      width = div_width - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%m"),
  col_list = _.keys(data[0]),
  date = col_list[0],
  bar = col_list[1],
  line1 = col_list[2],
  line2 = col_list[3],
  line3 = col_list[4]

  data.forEach(function(d) {
    d[date] = parseTime(d[date]);
  });

  // set the ranges
  var xScale = d3.scaleBand().range([0, width]).paddingInner(0.6).paddingOuter(0.3);
  var yScale = d3.scaleLinear().range([height, 0]);

  xScale.domain(data.map(function(d) { return d[date]; }));
  var y_max_val = d3.max(data, function(d) { return d[line1]; })
  yScale.domain([0, y_max_val]);

  var svg = d3.select("#bar_div").append("svg")
    .attr('viewBox', [0, 0, div_width, height + margin.top + margin.bottom])
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  var rect = svg.selectAll("rect")
  .data(data)

  rect.enter().append("rect")
    .attr("class", "bar")
    .style("stroke", "none")
    .style("fill", "#ccc")
    .style("opacity", 0.8)
    .attr("x", function(d){ return xScale(d[date]); })
    .attr("width", xScale.bandwidth())
    .attr("y", function(d){ return  yScale(d[bar]);})
    .attr("height", function(d){ return height - yScale(d[bar]); });

  // var valueFormat = d3.format("~s")

  // rect.enter().append("text")
  //   .attr("text-anchor", "middle")
  //   .attr("x", function(d) { return xScale(d[date]) })
  //   .attr("y", function(d) { return yScale(y_max_val); })
  //   .attr("dy", ".35em")
  //   .style("font-size", "9px")
  //   .text(function(d) { return valueFormat(d[bar]); });

  line_colors = ['#3b5998', '#d95043', '#26c281']

  _.each(['Total Confirmed', 'Total Recovered', 'Total Deceased'], function(k, i){
    // define the 1st line
    var valueline = d3.line()
        .x(function(d) { return xScale(d[date])+ xScale.bandwidth()/2; })
        .y(function(d) { return yScale(d[k]); });

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", `line${i}`)
        .style("stroke", line_colors[i])
        .style("stroke-width", '2px')
        .attr("d", valueline)
        .attr("fill", "none");

    var points = svg.selectAll(`circle.point${i}`)
    .data(data)

    points.enter().append("circle")
        .attr("class", `point${i}`)
        .style("stroke", '#fff')
        .style("stroke-width", "1px")
        .style("fill", line_colors[i])
        .attr("cx", function(d){ return xScale(d[date]) + xScale.bandwidth()/2; })
        .attr("cy", function(d){ return yScale(d[k]); })
        .attr("r", "3px");
  })

  // Add the X Axis
  svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b')).tickSize(0).tickPadding(8));

  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(yScale).ticks(3).tickSize(-width).tickFormat(d3.format("~s")).tickPadding(8));

  svg.append('text')
      .attr('class', 'yaxis label')
      .attr('text-anchor', 'middle')
      .attr('x', -height/2)
      .attr('y', -margin.right)
      .attr('font-size', '12px')
      .attr('transform', 'rotate(-90)')
      .text('Count');

  svg.selectAll('.yaxis text')
  .style('fill', '#000')

  svg.selectAll('.xaxis text')
  .style('fill', '#000')
  .style('font-size', '12px')

  svg.selectAll('path.domain')
  .style('stroke', 'none')


  d3.selectAll('.yaxis .tick').each(function(d) {
    d3.select(this).select("line").style("stroke-dasharray", function() {
      return d==0 ? '0':'5 5'
    })
    d3.select(this).select("line").style("opacity", function() {
      return d==0 ? '1':'0.4'
    })
  })
}
