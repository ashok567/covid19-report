/* exported draw_map */

function draw_map(data, name, type) {
  $("#ind-map").empty()
  var width = $("#ind-map").width();
  var height = $(".table-responsive").height() - 50

  name = name.replace(/\s+/g, '').toLowerCase()
  var object_name = name=='india' ? 'india_states' : `${name}_district`,
  prop_name = name=='india' ? 'st_nm' : 'district'

  var svg = d3.select("#ind-map")
  .append("svg")
  .attr('viewBox', [0, 0, width, height])

  var mapping = d3.map(),
    map = svg.append("g").attr("class", "states"),
    map_color = {'Confirmed': '#0a67ad', 'Active': '#ffb31a', 'Recovered': '#198256', 'Deaths':'#ad2f23'},
    colorRamp = ['#ffffff', map_color[type]];

  _.each(data, function(d){ mapping.set(d.Location, +d[type]) });
  var max = _.max(_.map(data, function(d){ return parseInt(d[type]); }))

  var color = d3.scaleLinear()
  .domain([0, max])
  .range(colorRamp);

  $.getJSON(`app/assets/map/${name}.json`, function(map_json){
    var topojson_var = topojson.feature(map_json, map_json.objects[object_name]),
      proj = d3.geoMercator().fitSize([width, height], topojson_var),
      path = d3.geoPath().projection(proj);

    map.selectAll("path")
    .data(topojson_var.features)
    .enter().append("path")
    .attr("d", path)
    .on("click", function(d){ if(name=='india') return loadDistrict(d.properties[prop_name], type) })
    .transition().duration(500)
    .style("fill", function(d) { return color(mapping.get(d.properties[prop_name]))})
    .attr('data-placement', 'right')
    .attr('data-toggle', 'toggle')
    .attr('class', `${prop_name}_slice`)
    .attr('data-title', function(d){
      return `<div class="font-italic"><div><span class="pl-1">${d.properties[prop_name].toUpperCase()}</span></div>
      <div><span class="circle-sm facebook-bg"></span><span class="pl-1">Confirmed: ${_.filter(data, (e) => e.Location==String(d.properties[prop_name]))[0]['Confirmed']}</span></div>
      <div><span class="circle-sm yellow-bg"></span><span class="pl-1">Active: ${_.filter(data, (e) => e.Location==String(d.properties[prop_name]))[0]['Active']}</span></div>
      <div><span class="circle-sm green-bg"></span><span class="pl-1">Recovered: ${_.filter(data, (e) => e.Location==String(d.properties[prop_name]))[0]['Recovered']}</span></div>
      <div><span class="circle-sm red-bg"></span><span class="pl-1">Deaths: ${_.filter(data, (e) => e.Location==String(d.properties[prop_name]))[0]['Deaths']}</span></div></div>`
    })
  });
}
