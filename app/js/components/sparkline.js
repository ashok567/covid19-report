/* exported draw_sparkline */

function draw_sparkline(dataset, ele){
  var date  = _.keys(dataset[0])[0],
      count  = _.keys(dataset[0])[1]
  var width = 100;
  var height = 24;
  var x = d3.scaleLinear().range([0, width - 6]);
  var y = d3.scaleLinear().range([height - 6, 0]);

  var parseDate = d3.timeParse("%d %B");

  dataset.forEach(function(d) {
      d[date] = parseDate(d[date]);
      d[count] = +d[count];
  });

  var line = d3.line()
              .x(function(d) { return x(d[date]); })
              .y(function(d) { return y(d[count]); });


  x.domain(d3.extent(dataset, function(d) { return d[date]; }));
  y.domain(d3.extent(dataset, function(d) { return d[count]; }));

  color_list = {'#confirmed-spark': '#0a67ad', '#active-spark': '#fc6',
  '#recovered-spark': '#26c281', '#fatal-spark': '#d95043'}

  var svg = d3.select(ele)
      .append('svg')
      .attr('class', 'sparkline-svg')
      .style('float', 'right')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 3)')

// // Add the X Axis
//   svg.append("g")
//     .attr("class", "xaxis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x));

// // Add the Y Axis
//   svg.append("g")
//     .attr("class", "yaxis")
//     .call(d3.axisLeft(y));

  svg.append('path')
      .datum(dataset)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color_list[ele])
      .attr('stroke-width', '3px')
      .style('opacity', '0.15')
  svg.append('path')
      .datum(dataset)
      .attr('class', 'sparkline')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color_list[ele])
      .attr('stroke-width', '1.5px')
  svg.append('circle')
      .attr('class', 'sparkcircle')
      .attr('cx', x(dataset[dataset.length-1][date]))
      .attr('cy', y(dataset[dataset.length-1][count]))
      .attr('r', 3)
      .attr('fill', color_list[ele])
      // .attr('stroke', '#fff')
}
