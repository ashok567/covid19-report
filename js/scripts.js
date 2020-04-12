/* global draw_pie, draw_bar, draw_map */
var state_data = []
var table_index = {'start_index': 0, 'end_index': 10}
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
      renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
      $('#prev-btn').addClass('op-0')
      renderPie()
      renderBar()
      draw_map(state_data, 'Confirmed')
    })
}

function renderTable(data){
  $(".countries").empty()
  var table_html = table_tmplt({ table_data: data, max_data: data[0] });
  $(".countries").html(table_html);
}

function renderPie(){
  $("#pie-section").empty()
  var pie_html = pie_tmplt();
  $("#pie-section").html(pie_html);
  draw_pie()
}

function renderBar(){
  $("#bar-section").empty()
  var bar_html = bar_tmplt();
  $("#bar-section").html(bar_html);
  draw_bar()
}

$(document).ready(function(){
  $('.loader').show()
  initialize()
})

$('body')
.on('click', '#next-btn', function(){
  $('#prev-btn').removeClass('op-0')
  table_index['start_index'] += 10
  table_index['end_index'] += 10
  if(table_index['start_index']<state_data.length){
    if(table_index['end_index']>state_data.length) $('#next-btn').addClass('op-0')
    renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
  }
})
.on('click', '#prev-btn', function(){
  $('#next-btn').removeClass('op-0')
  table_index['start_index'] -= 10
  table_index['end_index'] -= 10
  if (table_index['start_index']>=0){
    if(table_index['start_index']==0) $('#prev-btn').addClass('op-0')
    renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
  }
})
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
