/* exported draw_pie */
function draw_pie(){
  var div_width = $("#pie_div").width()
  var width = div_width
      height = 200
      margin = 20

  var radius = Math.min(width, height) / 2 - margin

  var svg = d3.select("#pie_div")
    .append("svg")
    // .attr("width", width)
    // .attr("height", height)
    .attr('viewBox', [0, 0, div_width, height])
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

  var data = {"within 2 Days ": 1001, "3-4 days": 204, "More than 4 days": 212, "Not Entered":223}


  var color = d3.scaleOrdinal()
    .domain(data)
    .range(['#FCB322', '#3b5998', '#26c281', '#d95043']);

  var data_sum = d3.sum(d3.values(data))

  // Pie data
  var pie = d3.pie()
    .value(function(d) {return d.value; })

  var data_ready = pie(d3.entries(data))

  //Arc
  var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

  var outerArcGenerator = d3.arc()
  .innerRadius(radius)
  .outerRadius(radius)

  svg
    .selectAll('slices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('class', 'pie')
    .on('click', (d) => pieOnClick(d.index))
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "#fff")
    .style("stroke-width", "1px")

  // Annotation
  svg
    .selectAll("slices")
    .data(data_ready)
    .enter()
    .append("text")
    .attr('class', 'pie')
    .on('click', (d) => pieOnClick(d.index))
    .text(function(d){
      return parseInt((d.data.value/data_sum)*100)+"%"
    })
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 11)
    .style("fill", "#fff")

  svg
    .selectAll("slices")
    .data(data_ready)
    .enter()
    .append("text")
    .attr('class', 'pie')
    .on('click', (d) => pieOnClick(d.index))
    .attr("dy", "1.2em")
    .text(function(d){
      return "("+d.data.value+")"
    })
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .style("fill", "#fff")

  //Poly line & label
  svg
    .selectAll('polyline')
    .data(data_ready)
    .enter().append('polyline')
    .attr('points', function(d) {
        var pos = outerArcGenerator.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.5 : -1.5);
        return [outerArcGenerator.centroid(d), pos]
    })
    .attr("stroke", "#000")
    .style("stroke-width", "1px")
    .style("fill", "none")
    .style("opacity", 0.5)


  svg
    .selectAll('slices')
    .data(data_ready)
    .enter()
    .append('text')
    .attr('dx', function(d) {
      return (midAngle(d)) < Math.PI ? '.35em' : '-.35em';
    })
    .attr('dy', '.35em')
    .text(function(d) {
        return d.data.key;
    })
    .attr('transform', function(d) {
        var pos = outerArcGenerator.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.5 : -1.5);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        return (midAngle(d)) < Math.PI ? 'start' : 'end';
    })
    .style("font-size", 12)
    .style("fill", "#000")
}


function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

function pieOnClick(sel_i){
  console.log(sel_i)
  _.each([0,1,2,3], function(i){
    $(`.line${i}`).addClass('op-0');
    $(`.point${i}`).addClass('op-0');
  })
  $(`.line${sel_i}`).removeClass('op-0');
  $(`.point${sel_i}`).removeClass('op-0');
}
