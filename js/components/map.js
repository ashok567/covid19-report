/* exported draw_map */

function draw_map(data, type) {
  $("#ind-map").empty()
  var width = $("#ind-map").width(),
      height = 600;

  // var proj = d3.geoMercator().scale(6000).translate([-1120, 700]);

  var proj = d3.geoMercator().scale(1000).translate([-1180, 720]);

  var path = d3.geoPath().projection(proj);

  var rateById = d3.map();

  var svg = d3.select("#ind-map")
  .append("svg")
  .attr('viewBox', [0, 0, width, height])
  // .attr("width", width)
  // .attr("height", height)

  var map = svg.append("g").attr("class", "states")

  var map_color = {'Confirmed': '#263961', 'Active': '#ffb31a', 'Recovered': '#198256', 'Deaths':'#ad2f23'}

  var colorRamp = ['#ffffff', map_color[type]];

  _.each(data, function(d){ rateById.set(d.State, +d[type]) });
  var max = _.max(_.map(data, function(d){ return parseInt(d[type]); }))

  var color = d3.scaleLinear()
  .domain([0, max])
  .range(colorRamp);

  $.getJSON("assets/map/india.json", function(map_json){
    map.selectAll("path")
    .data(topojson.feature(map_json, map_json.objects.india).features)
    .enter().append("path")
    .attr("d", path)
    .transition().duration(1000)
    .style("fill", function(d) { return color(rateById.get(d.properties.st_nm))})
    .attr('data-placement', 'right')
    .attr('data-toggle', 'toggle')
    .attr('class', 'map-slice')
    .attr('data-title', function(d){
      return d.properties.st_nm.toUpperCase() + ' : '+ rateById.get(d.properties.st_nm)
    })

    svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(map_json, map_json.objects.india, function(a, b) { return a !== b; })));
  });
}
