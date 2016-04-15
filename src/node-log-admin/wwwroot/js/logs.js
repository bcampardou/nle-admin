var hostname = '';

$(document).ready(function () {
    hostname = $('#hostname').val();

    $(document).on('keyloaded', function () {
        InitDatatable();

        $(document).on('click', '#getKeyBtn', function (e) {
            $.ajax({
                url: appConfig.getUrl('/admin/keys/' + hostname),
                dataType: 'jsonp',
                method: 'GET'
            }).done(function (data) {
                swal({
                    title: hostname + " API Key",
                    text: data,
                    type: 'success',
                    showConfirmButton: true
                });
            });
        });

        $(document).on('click', '#deleteLogsBtn', function (e) {
            $.ajax({
                url: appConfig.getUrl('/admin/' + hostname + '/log', 'DELETE'),
                method: 'POST',
                crossDomain: true,                
                dataType: 'json',
            }).success(function (data) {
                swal({
                    title: hostname,
                    text: 'The registered logs have been removed',
                    type: 'success',
                    showConfirmButton: true
                });
                $('#dtContainer > .overlay').show();
                InitDatatable();
            });
        });
    });
});

function InitDatatable() {
    $.ajax({
        url: appConfig.getUrl('/log/' + hostname),
        dataType: 'jsonp',
        method: 'GET'
    }).done(function (data) {
        if (data.length > 0) {
            var hasHeader = false;
            var $table = $('<table class="table table-bordered table-hover dataTable"></table>');
            var $tbody = $('<tbody></tbody>');
            var $trh = $('<tr></tr>');
            var nbCol = 0;
            var createdAtIndex = 0;
            for (var i in data) {
                var log = data[i]._source;

                var $tr = $('<tr></tr>').addClass(log['level']);
                for (var prop in log) {
                    if (hasHeader == false) {
                        $trh.append('<th>' + prop + '</th>');
                    }
                    if (prop === 'createdAt' || prop === 'date') {
                        createdAtIndex = nbCol;
                        $tr.append('<td>' + moment(log[prop]).format('YYYY/MM/DD HH:MM:SS') + '</td>');
                    }
                    else {
                        $tr.append('<td>' + log[prop] + '</td>');
                    }
                    nbCol++;
                }
                if (hasHeader == false) {
                    var $thead = $('<thead></thead>').append($trh);
                    $table.append($thead);
                    hasHeader = true;
                }
                $tbody.append($tr);
            }
            $table.append($tbody);
            $('#dtContainer').html($table);
            $('#dtContainer table:eq(0)').dataTable({
                "order": [[createdAtIndex, "desc"]]
            });
        } else {
            $('#dtContainer').append('<span><strong> No logs received... </strong></span>');
        }
        $('#dtContainer > .overlay').hide();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        $('#dtContainer > .overlay').hide();
        swal({
            title: "Error :",
            text: errorThrown,
            type: 'error',
            showConfirmButton: true
        });
    });
}

