/* exported draw_pie */
function draw_pie(data, ele){
  var div_width = $(ele).width()
  var width = div_width
      height = 200
      margin = 20

  var radius = Math.min(width, height) / 2 - margin
  if(ele=="#pie_div2") inner_radius = radius - 40
  else inner_radius = 0

  var svg = d3.select(ele)
    .append("svg")
    // .attr("width", width)
    // .attr("height", height)
    .attr('viewBox', [0, 0, div_width, height])
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  if(ele=="#pie_div2") color_range = ['#545d5c', '#7B68EE']
  else color_range = ['#d95043', '#26c281', '#0a67ad']

  var color = d3.scaleOrdinal()
    .domain(data)
    .range(color_range);

  var data_sum = d3.sum(d3.values(data))

  // Pie data
  var pie = d3.pie()
    .value(function(d) {return d.value; })

  var data_ready = pie(d3.entries(data))

  //Arc
  var arcGenerator = d3.arc()
    .innerRadius(inner_radius)
    .outerRadius(radius)

  var arcHighlight = d3.arc()
    .innerRadius(inner_radius)
    .outerRadius(radius*1.1);

  svg
    .selectAll('slices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('class', 'pie')
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .attr('d', arcHighlight(d));
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .attr('d', arcGenerator(d));
    })
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "#fff")
    .style("stroke-width", "1px")

  var valueFormat = d3.format(".2s")

  // Annotation
  svg
    .selectAll("slices")
    .data(data_ready)
    .enter()
    .append("text")
    .attr('class', 'pie')
    .text(function(d){
      return "("+valueFormat(d.data.value)+")"
    })
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", '10px')
    .style("fill", "#fff")
}
