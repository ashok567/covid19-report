/* exported draw_map */

function draw_map(data, type) {
  $("#ind-map").empty()
  var width = $("#ind-map").width();

  // var proj = d3.geoMercator().scale(6000).translate([-1120, 700]);

  if(width>500){
    var height = 450;
    // var proj = d3.geoMercator().scale(800).translate([-890, 600]);
    var proj = d3.geoMercator().scale(700).translate([-750, 520]);
  }
  else{
    var height = 300;
    // var proj = d3.geoMercator().scale(575).translate([-685, 490]);
    var proj = d3.geoMercator().scale(500).translate([-570, 360]);
  }

  var path = d3.geoPath().projection(proj);

  var mapping = d3.map();

  var svg = d3.select("#ind-map")
  .append("svg")
  .attr('viewBox', [0, 0, width, height])
  // .attr("width", width)
  // .attr("height", height)

  var map = svg.append("g").attr("class", "states")

  var map_color = {'Confirmed': '#0a67ad', 'Active': '#ffb31a', 'Recovered': '#198256', 'Deaths':'#ad2f23'}

  var colorRamp = ['#ffffff', map_color[type]];

  _.each(data, function(d){ mapping.set(d.State, +d[type]) });
  var max = _.max(_.map(data, function(d){ return parseInt(d[type]); }))

  var color = d3.scaleLinear()
  .domain([0, max])
  .range(colorRamp);

  $.getJSON("app/assets/map/india.json", function(map_json){
    map.selectAll("path")
    .data(topojson.feature(map_json, map_json.objects.india_states).features)
    .enter().append("path")
    .attr("d", path)
    .transition().duration(1500)
    .style("fill", function(d) { return color(mapping.get(d.properties.st_nm))})
    .attr('data-placement', 'right')
    .attr('data-toggle', 'toggle')
    .attr('class', 'map-slice')
    .attr('data-title', function(d){
      return `<div class="font-italic"><div><span class="pl-1">${d.properties.st_nm.toUpperCase()}</span></div>
      <div><span class="circle-sm facebook-bg"></span><span class="pl-1">Confirmed: ${_.filter(data, (e) => e.State==String(d.properties.st_nm))[0]['Confirmed']}</span></div>
      <div><span class="circle-sm yellow-bg"></span><span class="pl-1">Active: ${_.filter(data, (e) => e.State==String(d.properties.st_nm))[0]['Active']}</span></div>
      <div><span class="circle-sm green-bg"></span><span class="pl-1">Recovered: ${_.filter(data, (e) => e.State==String(d.properties.st_nm))[0]['Recovered']}</span></div>
      <div><span class="circle-sm red-bg"></span><span class="pl-1">Deaths: ${_.filter(data, (e) => e.State==String(d.properties.st_nm))[0]['Deaths']}</span></div></div>`
    })

    // svg.append("path")
    //   .attr("class", "state-borders")
    //   .attr("d", path(topojson.mesh(map_json, map_json.objects.india, function(a, b) { return a !== b; })));
  });
}
