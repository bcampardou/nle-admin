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
    var data = {
        date: moment().format(),
        message: lipsumjs.generateSentence(10, 30),
        level: level,
        stacktrace: ''
    };
    if (level === 'error')
        data.stacktrace = "at System.IO.__Error.WinIOError(Int32 errorCode, String maybeFullPath) \
    at System.IO.FileStream.Init(String path, FileMode mode, FileAccess access, Int32 rights, Boolean useRights, FileShare share, Int32 bufferSize, FileOptions options, SECURITY_ATTRIBUTES secAttrs, String msgPath, Boolean bFromProxy) \
    at System.IO.FileStream..ctor(String path, FileMode mode, FileAccess access, FileShare share, Int32 bufferSize, FileOptions options) \
    at System.IO.StreamReader..ctor(String path, Encoding encoding, Boolean detectEncodingFromByteOrderMarks, Int32 bufferSize) \
    at System.IO.StreamReader..ctor(String path) \
    at LVKWinFormsSandbox.MainForm.button1_Click(Object sender, EventArgs e) in C:\Dev\VS.NET\Gatsoft\LVKWinFormsSandbox\MainForm.cs:line 36";

    return data;
};

var putLog = function (sentData) {
    var url = 'http://localhost:3200/log/nodelog-admin?_method=put&key=ce411675-1824-4a02-98fc-c68ce6705ea7';

    $.ajax({
        url: url,
        data: sentData,
        crossDomain: true,
        dataType: 'json',
        method: 'POST'
    }).success(function (data) {
        window.alert("success : " + data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        window.alert("error : " + errorThrown);
    });
};

