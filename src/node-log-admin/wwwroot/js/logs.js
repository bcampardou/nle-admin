(function () {
    'use strict';

    var myHostname = '';


    $(document).ready(function () {
        myHostname = $('#hostname').val();

        $(document).on('nlea.keyloaded', function () {
            InitConfiguration();

            InitDatatable();

            $(document).on('click', '#getKeyBtn', function (e) {
                $.ajax({
                    url: window.appConfig.getUrl('/admin/keys/' + myHostname),
                    dataType: 'json',
                    method: 'GET'
                }).done(function (data) {
                    swal({
                        title: myHostname + " API Key",
                        text: data,
                        type: 'success',
                        showConfirmButton: true
                    });
                });
            });

            $(document).on('click', '#deleteLogsBtn', function (e) {
                $.ajax({
                    url: window.appConfig.getUrl('/admin/' + myHostname + '/log', 'DELETE'),
                    method: 'POST',
                    dataType: 'json'
                }).success(function (data) {
                    swal({
                        title: myHostname,
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

    function InitConfiguration() {
        $.ajax({
            url: window.appConfig.getUrl('/log/' + myHostname + '/structure'),
            dataType: 'json',
            method: 'GET'
        }).done(function (data) {
            if (localStorage.getItem('logConfig_' + myHostname) === undefined) {
                localStorage.setItem('logConfig_' + myHostname, JSON.stringify(data.structure));
            }
            var $container = $('#configContainer');

            var logConfig = localStorage.getItem('logConfig_' + myHostname);

            for (var property in logConfig) {
                if(logConfig[property].isHidden === undefined) {
                    logConfig[property].isHidden  = false;
                }
                if (logConfig[property].showFilter === undefined) {
                    logConfig[property].showFilter = false;
                    logConfig[property].filterType = '';
                }
                var noFilterSelected = logConfig[property].showFilter === false;
                var filterTextSelected = logConfig[property].showFilter === true && logConfig[property].filterType === 'text';
                var filterSelectSelected = logConfig[property].showFilter === true && logConfig[property].filterType === 'select';
                $container.append($('<div class="col-sm-12 col-md-4"><strong>' + property + '</strong><label for="filterType_' + property + '">Filter type : </label><select id="filterType_' + property + '"><option value="false"  ' + noFilterSelected === true ? 'selected' : '' + '>None</option><option value="true" data-type="text" ' + filterTextSelected === true ? 'selected' : '' + '>Free text</option><option value="true" data-type="select" ' + filterSelectSelected === true ? 'selected' : '' + '>Select</option></select><label for="isHidden_' + property + '">Hide : </label><input type="checkbox" checked="' + logConfig[property].isHidden + '"/></div>'));
            }
        });


    }

    function InitDatatable() {
        $.ajax({
            url: window.appConfig.getUrl('/log/' + myHostname),
            dataType: 'json',
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
                        if (hasHeader === false) {
                            $trh.append('<th>' + prop + '</th>');
                        }
                        if (prop === 'createdAt' || prop === 'date') {
                            if (i === 0) {
                                createdAtIndex = nbCol;
                            }
                            $tr.append('<td>' + moment(log[prop]).format('YYYY/MM/DD HH:MM:SS') + '</td>');
                        }
                        else {
                            $tr.append('<td>' + log[prop] + '</td>');
                        }
                        if (i === 0) {
                            nbCol++;
                        }
                    }
                    if (hasHeader === false) {
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
})();

