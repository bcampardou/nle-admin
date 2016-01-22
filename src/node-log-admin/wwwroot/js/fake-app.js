$(document).ready(function () {
    $(document).on('click', '#errorGenerator', function (e) {
        e.preventDefault();
        var data = fakeMessage('error');

        putLog(data);        
    });
    $(document).on('click', '#warnGenerator', function (e) {
        e.preventDefault();
        var data = fakeMessage('warning');

        putLog(data);
    });
    $(document).on('click', '#noticeGenerator', function (e) {
        e.preventDefault();
        var data = fakeMessage('notice');

        putLog(data);
    });
});

var fakeMessage = function (level) {
    return {
        date: moment().format(),
        message: lipsumjs.generateSentence(10, 30),
        level: level,
        stacktrace: ''
    };
};

var putLog = function(sentData) {
    $.ajax({
        url: 'http://localhost:3200/log/nodelog-admin?_method=put&key=ce411675-1824-4a02-98fc-c68ce6705ea7',
        data: sentData,
        dataType: 'json',
        method: 'POST'
    }).success(function (data) {
        window.alert("success : " + data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        window.alert("error : " + errorThrown);
    });
};