function initialize(){
    $.get('/state_wise', function(res){
        var overview_tmplt = _.template($("#overview-sc").html());
        var overview_html = overview_tmplt({ overview: res.response[0]});
        $("#overview").html(overview_html);
    })
}

$(document).ready(function(){
    initialize()
})