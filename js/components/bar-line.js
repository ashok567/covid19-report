/* exported draw_bar */
var data = [
  {
    "date": 'January',
    "bar": 1640,
    "line1": 31,
    "line2": 12,
    "line3": 21
  },
  {
    "date": 'February',
    "bar": 1130,
    "line1": 23,
    "line2": 05,
    "line3": 41
  },
  {
    "date": 'March',
    "bar": 1190,
    "line1": 34,
    "line2": 12,
    "line3": 32
  },
  {
    "date": 'April',
    "bar": 1200,
    "line1": 21,
    "line2": 36,
    "line3": 18
  },
  {
    "date": 'May',
    "bar": 1000,
    "line1": 44,
    "line2": 21,
    "line3": 31
  }
]

function draw_bar(){
  var div_width = $('#bar_div').width()
  var margin = {top: 20, right: 40, bottom: 30, left: 50},
      width = div_width - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  // parse the date / time
  var parseTime = d3.timeParse("%B");

  data.forEach(function(d) {
    d.date = parseTime(d.date);
  });

  // set the ranges
  var xBar = d3.scaleBand().range([0, width]).paddingInner(0.6).paddingOuter(0.3);
  // var xBar = d3.scaleTime().range([0, width]);
  var xLine = d3.scalePoint().range([0, width]).padding(0.5);
  var yBar = d3.scaleLinear().range([height, 0]);
  var yLine = d3.scaleLinear().range([height, 0]);

  xBar.domain(data.map(function(d) { return d.date; }));
  // xBar.domain(d3.extent(data, (d) => d.date))
  xLine.domain(data.map(function(d) { return d.date; }));
  yBar.domain([0, d3.max(data, function(d) { return d.bar; })]);
  yLine.domain([0, d3.max(data, function(d) {return Math.max(d.line1, d.line2, d.line3); })]);

  var svg = d3.select("#bar_div").append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
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
    .style("opacity", 0.4)
    .attr("x", function(d){ return xBar(d.date); })
    .attr("width", xBar.bandwidth())
    .attr("y", function(d){ return  yBar(d.bar);})
    .attr("height", function(d){ return height - yBar(d.bar); });

  line_colors = ['#3b5998', '#d95043', '#26c281']

  _.each([0,1,2], function(i){
    // define the 1st line
    var valueline = d3.line()
        .x(function(d) { return xLine(d[`date`]); })
        .y(function(d) { return yLine(d[`line${i+1}`]); });

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
        .attr("cx", function(d){ return xLine(d[`date`]); })
        .attr("cy", function(d){ return yLine(d[`line${i+1}`]); })
        .attr("r", "3px");
  })

  // Add the X Axis
  svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xLine).tickFormat(d3.timeFormat('%b')).tickSize(0).tickPadding(8));

  // Add the Y0 Axis
  svg.append("g")
      .attr("class", "lineaxis")
      .call(d3.axisLeft(yLine).ticks(4).tickFormat(d => d + "%").tickSize(-width).tickPadding(8));

  // Add the Y1 Axis
  svg.append("g")
      .attr("class", "baraxis")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(yBar).ticks(5).tickSize(0).tickFormat(d3.format("~s")).tickPadding(8));

  svg.append('text')
      .attr('class', 'lineaxis label')
      .attr('text-anchor', 'middle')
      .attr('x', -height/2)
      .attr('y', -margin.right)
      .attr('font-size', '12px')
      // .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .text('Percentage');

  svg.append('text')
      .attr('class', 'baraxis label')
      .attr('text-anchor', 'middle')
      .attr('x', -height/2)
      .attr('y', width+margin.right)
      .attr('font-size', '12px')
      .style('fill', '#797979')
      // .attr('dy', '.35em')
      .attr('transform', 'rotate(-90)')
      .text('Count');

  svg.selectAll('.lineaxis text')
  .style('fill', '#000')

  svg.selectAll('.xaxis text')
  .style('fill', '#000')
  .style('font-size', '12px')

  svg.selectAll('path.domain')
  .style('stroke', 'none')


  d3.selectAll('.lineaxis .tick').each(function(d) {
    d3.select(this).select("line").style("stroke-dasharray", function() {
      return d==0 ? '0':'5 5'
    })
  })
}
