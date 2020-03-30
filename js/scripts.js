var state_data = []
var table_index = {'start_index': 0, 'end_index': 10}
var table_tmplt = _.template($("#state-table").html());

function initialize(){
    $('.prev-btn').addClass('op-0')
    $.get('/state_wise', function(res){
        var overview_tmplt = _.template($("#overview-sc").html());
        var overview_html = overview_tmplt({ overview: res.response[0]});
        $("#overview").html(overview_html);
        state_data = _.orderBy(res.response.splice(1), ['Confirmed'], ['desc']) 
        renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
    })
}

function renderTable(data){
    $(".countries").empty()
    var table_html = table_tmplt({ table_data: data });
    $(".countries").html(table_html);
}

$(document).ready(function(){
    initialize()
})

$('body')
.on('click', '.next-btn', function(){
    $('.prev-btn').removeClass('op-0')
    table_index['start_index'] += 10
    table_index['end_index'] += 10
    if(table_index['start_index']<state_data.length){ 
        if(table_index['end_index']>state_data.length) $('.next-btn').addClass('op-0')
        renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
    }
})
.on('click', '.prev-btn', function(){
    $('.next-btn').removeClass('op-0')
    table_index['start_index'] -= 10
    table_index['end_index'] -= 10
    if (table_index['start_index']>=0){
        if(table_index['start_index']==0) $('.prev-btn').addClass('op-0')
        renderTable(state_data.slice(table_index['start_index'], table_index['end_index']))
    }
})
