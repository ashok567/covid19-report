/* exported draw_sparkline */

function draw_sparkline(dataset, ele, color){
  var date  = _.keys(dataset[0])[0],
      count  = _.keys(dataset[0])[1]
  var width = 80;
  var height = 30;
  var x = d3.scaleLinear().range([0, width - 6]);
  var y = d3.scaleLinear().range([height - 6, 0]);

  var parseDate = d3.timeParse("%m");

  dataset.forEach(function(d) {
      d[date] = parseDate(d[date]);
      d[count] = +d[count];
  });

  var line = d3.line()
              .x(function(d) { return x(d[date]); })
              .y(function(d) { return y(d[count]); });


  x.domain(d3.extent(dataset, function(d) { return d[date]; }));
  y.domain(d3.extent(dataset, function(d) { return d[count]; }));

  var svg = d3.select(ele)
      .append('svg')
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
      .attr('stroke', 'blue')
      .attr('stroke-width', '5px')
      .style('opacity', '0.15')
  svg.append('path')
      .datum(dataset)
      .attr('class', 'sparkline')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', '1.5px')
  svg.append('circle')
      .attr('class', 'sparkcircle')
      .attr('cx', x(dataset[dataset.length-1][date]))
      .attr('cy', y(dataset[dataset.length-1][count]))
      .attr('r', 3)
      .attr('fill', color)
      .attr('stroke', '#fff')
}
