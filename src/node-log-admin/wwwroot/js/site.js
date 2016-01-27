// Write your Javascript code.

$(document).ready(function () {
    $.ajax({
        url: "http://localhost:3200/adm/keys?key=ce411675-1824-4a02-98fc-c68ce6705ea7",
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
});