// Write your Javascript code.

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:3200/adm/keys?key=ce411675-1824-4a02-98fc-c68ce6705ea7",
        method: 'GET',
        dataType: 'jsonp'
    }).done(function (data) {
        for (var i in data) {
            $('#hostList').append($('<li><a title="Log" href="/Log"><i class="fa fa-circle-o"></i> ' + data[i] + '</a></li>'));
        }
    });
});