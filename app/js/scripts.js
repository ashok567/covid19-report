/* exported divideTicks */
/* global draw_pie, draw_bar, draw_map, draw_sparkline */

var state_data = []
var table_tmplt = _.template($('#state-table').html());
var pie_tmplt = _.template($('#pie-script').html());
var bar_tmplt = _.template($('#bar-script').html());

function initialize(){
    $.get('/state_wise', function(res){
      var overview_tmplt = _.template($('#overview-sc').html());
      var overview_html = overview_tmplt({ overview: res.response[0]});
      $('#overview').html(overview_html);
      state_data = _.orderBy(res.response.splice(1), ['Confirmed'], ['desc'])
      $('.loader').fadeOut('slow')
      $('.wrapper').removeClass('d-none')
      d3.select('body').transition().duration(1000)
      renderSparkLine()
      draw_map(state_data, 'Confirmed')
      renderTable(state_data)
      renderPie()
      renderBar()
    })
}

function renderTable(data){
  $('.states').empty()
  var table_html = table_tmplt({ table_data: data, max_data: data[0] });
  $('.states').html(table_html);
}

function renderPie(){
  $('#pie-section').empty()
  var pie_html = pie_tmplt();
  $('#pie-section').html(pie_html);
  $.get('/pie', function(res){
    res = res.response
    var pie_data1 = _.pick(res, ['Total Confirmed', 'Total Recovered', 'Total Deceased'])
    var pie_data2 = _.pick(res, ['Total People Currently in Quarantine', 'Total People Released From Quarantine'])
    draw_pie(pie_data1, '#pie_div1')
    draw_pie(pie_data2, '#pie_div2')
  })
}

function renderBar(){
  $('#bar-section').empty()
  var bar_html = bar_tmplt();
  $('#bar-section').html(bar_html);
  $.get('/time_series', function(res){
    res = res.response
    var dataset = _.map(res, (d)=> _.pick(d, ['Month', 'Total Tested', 'Total Confirmed', 'Total Recovered', 'Total Deceased']))
    draw_bar(dataset)
  })
}

function renderSparkLine(){
  $.get('/trendline', function(res){
    res = res.response
    var dataset = _.map(res, (d)=> _.pick(d, ['Date', 'Daily Confirmed']))
    console.log(dataset)
    draw_sparkline(dataset, '#confirmed-spark', '#0a67ad')
  })
}

function divideTicks(min, max, ticks) {
  var result = []
  var delta = 0
  delta = (max - min) / (ticks - 1);
  var i = 0
  while (i <= ticks - 1) {
    result.push(parseInt(min));
    min += delta;
    i++
  }
  return result
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
  selector: '.map-slice, .barline-slice',
  container: 'body',
  html: true,
  animated: 'fade'
});
