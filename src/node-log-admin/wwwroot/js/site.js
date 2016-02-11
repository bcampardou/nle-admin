// Write your Javascript code.
var appConfig = {
    domain: '',
    protocol: '',
    key: '',
    port: '',
    /* Return the formated url
     * @route: '/admin/hosts' for exemple
     * @method: the override method 'PUT', 'DELETE' ...
     */
    getUrl: function (route, method) {
        var url = protocol + '://' + domain + ':' + port + route + '?key=' + key;
        if (typeof (method) !== 'undefined')
            url += '&_method=' + method;

        return url;
    }
};
$(document).ready(function () {
    $.ajax({
        url: location.origin + "/Manage/GetApiKey",
        method: 'GET'
    }).done(function (data) {
        appConfig = data;
        $(document).trigger('keyloaded');
    });
    
    $(document).on('keyloaded', function (e) {
        $.ajax({
            url: appConfig.getUrl('/admin/hosts'),
            method: 'GET',
            dataType: 'jsonp'
        }).done(function (data) {
            for (var i in data) {
                $('#hostList').append($('<li><a data-menu-link="' + data[i] + '" title="Log" href="/Log?hostname=' + data[i] + '"><i class="fa fa-circle-o"></i> ' + data[i] + '</a></li>'));
            }
        }).always(function (jqXHR, textStatus) {
            $('#sidebar_left').find('li.active').removeClass('active');
            var $actualMenuLink = $('#sidebar_left').find('a[data-menu-link="' + $('#mainContainer').data('menu-link') + '"]');
            $actualMenuLink.parents('li').addClass('active').find('> .accordion-toggle').addClass('menu-open');
        });

        $(document).on('click', '#addAppBtn', function () {
            // open a modal to get the application name then send a request to node log engine to register this app.
            // Finally show the api key
            $('#addAppModal').modal({ backdrop: 'static' });
        });

        $(document).on('click', '#submitAppName', function () {
            if ($('#appNameField').val() !== '') {
                $.ajax({
                    url: appConfig.getUrl('/admin/register/' + $('#appNameField').val(), 'PUT'),
                    method: 'POST',
                    dataType: 'json'
                }).done(function (data) {
                    window.alert(data);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    window.alert("error : " + errorThrown);
                });
            }
        });
    });
});