/* global draw_pie, draw_bar, draw_map, draw_sparkline */
var state_data = []
// var table_index = {'start_index': 0, 'end_index': 10}
var table_tmplt = _.template($("#state-table").html());
var pie_tmplt = _.template($("#pie-script").html());
var bar_tmplt = _.template($("#bar-script").html());

function initialize(){
    $.get('/state_wise', function(res){
      var overview_tmplt = _.template($("#overview-sc").html());
      var overview_html = overview_tmplt({ overview: res.response[0]});
      $("#overview").html(overview_html);
      state_data = _.orderBy(res.response.splice(1), ['Confirmed'], ['desc'])
      $('.loader').fadeOut('slow')
      $('.wrapper').removeClass('d-none')
      // renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
      d3.select('body').transition().duration(1000)
      renderTable(state_data)
      renderPie()
      renderBar()
      draw_map(state_data, 'Confirmed')
    })
}

function renderTable(data){
  $(".states").empty()
  var table_html = table_tmplt({ table_data: data, max_data: data[0] });
  $(".states").html(table_html);
}

function renderPie(){
  $("#pie-section").empty()
  var pie_html = pie_tmplt();
  $("#pie-section").html(pie_html);
  draw_pie("#pie_div1")
  draw_pie("#pie_div2")
}

function renderBar(){
  $("#bar-section").empty()
  var bar_html = bar_tmplt();
  $("#bar-section").html(bar_html);
  $.get('/time_series', function(res){
    res = res.response
    var dataset = _.map(res, (d)=> _.pick(d, ['Month', 'Total Tested', 'Total Confirmed', 'Total Recovered', 'Total Deceased']))
    // draw_sparkline(dataset, '#Confirmed-spark', '#3b5998')
    draw_bar(dataset)
  })
}

$(document).ready(function(){
  $('.loader').show()
  initialize()
})

$('body')
.on('click', '.map-click', function(){
  var selected_id = $(this).attr('id')
  var map_state_data = _.orderBy(state_data, [selected_id], ['desc'])
  draw_map(map_state_data, selected_id)
})
.tooltip({
  selector: '.map-slice, circle-point',
  container: 'body',
  html: true,
  animated: 'fade'
});
