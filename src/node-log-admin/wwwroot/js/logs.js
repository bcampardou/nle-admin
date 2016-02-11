$(document).ready(function () {
    $(document).on('keyloaded', function () {
        var hostname = $('#hostname').val();
        $.ajax({
            url: appConfig.getUrl('/log/' + hostname),
            dataType: 'jsonp',
            method: 'GET'
        }).done(function (data) {

            var hasHeader = false;
            var $table = $('<table class="table table-bordered table-hover dataTable"></table>');
            var $tbody = $('<tbody></tbody>');
            var $trh = $('<tr></tr>');
            for (var i in data) {
                var log = data[i]._source;

                var $tr = $('<tr></tr>').addClass(log['level']);
                for (var prop in log) {
                    if (hasHeader == false) {
                        $trh.append('<th>' + prop + '</th>');
                    }
                    var value = (prop === 'date' ? moment(log[prop]).format('YYYY/MM/DD HH:MM:SS') : log[prop]);
                    $tr.append('<td>' + value + '</td>');
                }
                if (hasHeader == false) {
                    var $thead = $('<thead></thead>').append($trh);
                    $table.append($thead);
                    hasHeader = true;
                }
                $tbody.append($tr);
            }
            $table.append($tbody);
            $('#dtContainer').append($table);
            $('#dtContainer table:eq(0)').dataTable();
        });
    });
});

