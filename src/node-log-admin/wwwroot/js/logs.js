$(document).ready(function () {
    $.ajax({
        url: "http://localhost:3200/log/test?key=ce411675-1824-4a02-98fc-c68ce6705ea7",
        dataType: 'jsonp',
        method: 'GET'
    }).done(function (data) {
        for (var i in data) {
            $('.content').eq(0).append('<p>' + JSON.stringify(data[i]._source) + '</p>');
        }
    })
});