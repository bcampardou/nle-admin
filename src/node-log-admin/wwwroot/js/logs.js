(function () {
    'use strict';

    var myHostname = '';


    $(document).ready(function () {
        myHostname = $('#hostname').val();

        $('#configForm').on('submit', function (e) {
            e.preventDefault();

            var configuration = JSON.stringify(getConfigurationFormData());
            localStorage.setItem('logConfig_' + myHostname, configuration);

            $.ajax({
                url: '/api/Configuration/' + myHostname,
                method: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: configuration
            }).done(function (data) {
                InitDatatable();
            });
        });

        $(document).on('nlea.keyloaded', function () {
            InitConfiguration({ callback: InitDatatable });

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

        $(document).on('change', '.filter', function (e) {
            var filter = $(this).val(),
                column = $(this).attr('id');

            $('#dtContainer table:eq(0)').DataTable().column('.' + column).eq(0).search(filter).draw();
        });
    });

    function InitConfiguration(params) {
        $.ajax({
            url: '/api/Configuration/' + myHostname,
            method: 'GET',
            dataType: 'json'
        }).done(function (data) {
            localStorage.setItem('logConfig_' + myHostname, data != undefined ? JSON.stringify(data) : undefined);

            $.ajax({
                url: window.appConfig.getUrl('/log/' + myHostname + '/structure'),
                dataType: 'json',
                method: 'GET'
            }).done(function (data) {
                if (localStorage.getItem('logConfig_' + myHostname) === 'undefined') {
                    var columns = new Array();
                    for (var i in data.structure) {
                        var col = {};
                        col.name = i;
                        col.filterType = 'None';
                        col.isHidden = false;
                        columns.push(col);
                    }
                    localStorage.setItem('logConfig_' + myHostname, JSON.stringify(columns));
                }

                var $container = $('#configContainer'),
                    logConfig = JSON.parse(localStorage.getItem('logConfig_' + myHostname));

                for (var i in logConfig) {

                    var noFilterSelected = logConfig[i].filterType == 0,
                        filterTextSelected = logConfig[i].filterType == 1,
                        filterSelectSelected = logConfig[i].filterType == 2;

                    $container.append($('<div class="col-sm-12 col-md-4 columnConfig"><input type="hidden" name="name" value="' + logConfig[i].name + '" /><label for="filterType_' + i + '"><strong>' + logConfig[i].name.toUpperCase() + '</strong> filter type : </label><select class="form-control" name="filterType" id="filterType_' + i + '"><option value="0"  ' + (noFilterSelected === true ? 'selected' : '') + '>None</option><option value="1" ' + (filterTextSelected === true ? 'selected' : '') + '>Free text</option><option value="2" ' + (filterSelectSelected === true ? 'selected' : '') + '>Select</option></select><label for="isHidden_' + i + '"><input name="isHidden" type="checkbox" ' + (logConfig[i].isHidden ? 'checked' : '') + ' /> hide</label></div>'));
                }

                if (typeof params.callback === 'function') {
                    params.callback.apply();
                }
            });
        });

    }

    function LoadDatatableFilters() {
        var logConfig = JSON.parse(localStorage.getItem('logConfig_' + myHostname)),
            $filtersContainer = $('#filtersContainer');

        var htmlFilters = '';

        var templateStart = function (prop) { return '<div class="col-sm-4 col-md-2"><label for="' + prop + '">' + prop.toUpperCase() + '</label>'; },
            templateSelect = function (prop) { return '<select class="form-control filter" id="' + prop + '">' + GetOptionsForColumn(prop) + '</select>'; },
            templateInputText = function (prop) { return '<input type="text" class="form-control filter" id="' + prop + '" />'; },
            templateEnd = '</div>';

        for (var i in logConfig) {
            if (logConfig[i].isHidden == true || logConfig[i].filterType == 0) {
                continue;
            }

            if (logConfig[i].filterType == 1) {
                htmlFilters += templateStart(logConfig[i].name) + templateInputText(logConfig[i].name) + templateEnd
            } else if (logConfig[i].filterType == 2) {
                htmlFilters += templateStart(logConfig[i].name) + templateSelect(logConfig[i].name) + templateEnd
            }
        }

        $filtersContainer.html(htmlFilters);
    }

    function GetOptionsForColumn(column) {
        var values = new Array();
        var datas = $('#dtContainer table:eq(0)').DataTable().columns('.' + column).eq(0).data();
        var htmlOptions = '<option value="">Aucun</option>';


        for (var i = 0; i < datas.length; i++) {
            if (values.indexOf(datas[i][column]) < 0) {
                values.push(datas[i][column]);
                htmlOptions += '<option value="' + datas[i][column] + '">' + datas[i][column] + '</option>';
            }
        }

        return htmlOptions;
    }

    function InitDatatable() {

        $('#dtContainer > .overlay').show();
        $('#dtContainer > table').html('');
        $('#dtContainer > span').remove();

        $.ajax({
            url: window.appConfig.getUrl('/log/' + myHostname),
            dataType: 'json',
            method: 'GET'
        }).done(function (data) {
            if (data.length > 0) {
                var columnsDefinitions = [];
                var nbCol = 0;
                var createdAtIndex = -1;
                var datas = []

                for (var i in data) {
                    var log = data[i]._source;
                    datas.push(log);
                }

                for (var prop in datas[0]) {
                    var config = getColumnConfigurationByName(prop);
                    var colDef = {
                        "title": prop.toUpperCase(),
                        "data": prop,
                        "visible": config !== null ? !config.isHidden : true,
                        "searchable": config !== null ? !config.isHidden : true,
                        "className": prop
                    };
                    if (prop === 'createdAt' || prop.indexOf('date') >= 0) {
                        if (createdAtIndex === -1) {
                            createdAtIndex = nbCol;
                        }
                        colDef.render = function (data, type, row, meta) {
                            return moment(data).format('YYYY/MM/DD, hh:mm:ss');
                        };
                    }
                    nbCol++;
                    columnsDefinitions.push(colDef);
                }
                $('#dtContainer table:eq(0)').dataTable({
                    "order": [[createdAtIndex, "desc"]],
                    "columns": columnsDefinitions,
                    "data": datas
                });
            } else {
                $('#dtContainer').append('<span><strong> No logs received... </strong></span>');
            }
            $('#dtContainer > .overlay').hide();
            LoadDatatableFilters();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $('#dtContainer > .overlay').hide();
            swal({
                title: "Error :",
                text: errorThrown,
                type: 'error',
                showConfirmButton: true
            });
            $('#dtContainer').append('<span><strong> No logs received... </strong></span>');
        });
    }

    function getConfigurationFormData() {
        var data = new Array();
        $('#configContainer .columnConfig').each(function () {
            var obj = {};
            obj.name = $('input[name=name]:eq(0)', this).val();
            obj.filterType = $('select[name=filterType]:eq(0)', this).val();
            obj.isHidden = $('input[name=isHidden]:eq(0)', this).is(':checked');
            data.push(obj);
        });

        return data;
    }

    function getColumnConfigurationByName(name) {
        var logConfig = JSON.parse(localStorage.getItem('logConfig_' + myHostname));
        for (var i in logConfig) {
            if (logConfig[i] !== undefined && logConfig[i].name == name) {
                return logConfig[i];
            }
        }
        return null;
    }
})();

