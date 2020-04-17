/* global divideTicks */
/* exported sparkline */

function sparkline(dataset, ele){
  var width = 30;
  var height = 24;
  var x = d3.scaleLinear().range([0, width - 6]);
  var y = d3.scaleLinear().range([height - 6, 0]);

  var parseDate = d3.timeParse("%Q");
  // var parseDate = d3.timeParse("%Y-%m-%d");

  var xMax = d3.max(dataset, (d)=>d.date)
  var xMin = d3.min(dataset, (d)=>d.date)
  var ticks_count = dataset.length < 5 ? dataset.length : 5
  var ticks = divideTicks(xMin, xMax, ticks_count)

  dataset.forEach(function(d) {
      d.date = parseDate(d.date);
      d.number = +d.number;
  });

  var line = d3.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.number); });


  x.domain(d3.extent(dataset, function(d) { return d.date; }));
  y.domain(d3.extent(dataset, function(d) { return d.number; }));

  var svg = d3.select(ele)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0, 3)')
  svg.append('path')
      .datum(dataset)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', '7px')
      .style('opacity', '0.15')
  svg.append('path')
      .datum(dataset)
      .attr('class', 'sparkline')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', '1.5px')
  svg.append('circle')
      .attr('class', 'sparkcircle')
      .attr('cx', x(dataset[dataset.length-1].date))
      .attr('cy', y(dataset[dataset.length-1].number))
      .attr('r', 3)
      .attr('fill', 'blue')
      .attr('stroke', '#fff')
}
