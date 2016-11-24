'use strict';
(function () {

    var logManager = {
        applicationName: '',
        getConfigurationFormData: function () {
            var data = new Array();
            $('#configContainer .columnConfig').each(function () {
                var obj = {};
                obj.name = $('input[name=name]:eq(0)', this).val();
                obj.isHidden = $('input[name=isHidden]:eq(0)', this).is(':checked');
                data.push(obj);
            });

            return data;
        },
        getColumnConfigurationByName: function (name) {
            var logConfig = JSON.parse(localStorage.getItem('logConfig_' + logManager.applicationName));
            for (var i in logConfig) {
                if (logConfig[i] !== undefined && logConfig[i].name == name) {
                    return logConfig[i];
                }
            }
            return null;
        },
        initConfiguration: function () {
            $.ajax({
                url: '/api/Configuration/' + logManager.applicationName,
                method: 'GET',
                dataType: 'json'
            }).done(function (data) {
                localStorage.setItem('logConfig_' + logManager.applicationName, data != undefined ? JSON.stringify(data) : undefined);

                $.ajax({
                    url: window.appConfig.getUrl('/log/' + logManager.applicationName + '/structure'),
                    dataType: 'jsonp',
                    method: 'GET'
                }).done(function (data) {
                    if (localStorage.getItem('logConfig_' + logManager.applicationName) === 'undefined') {
                        var columns = new Array();
                        for (var i in data.structure) {
                            var col = {};
                            col.name = i;
                            //col.filterType = 'None';
                            col.isHidden = false;
                            columns.push(col);
                        }
                        localStorage.setItem('logConfig_' + logManager.applicationName, JSON.stringify(columns));
                    }

                    var $container = $('#configContainer'),
                        logConfig = JSON.parse(localStorage.getItem('logConfig_' + logManager.applicationName));

                    for (var i in logConfig) {
                        $container.append($('<div class="col-sm-12 col-md-6 columnConfig"><div class="text-info"><strong>' + logConfig[i].name.toUpperCase() + ' :</strong></div><input type="hidden" name="name" value="' + logConfig[i].name + '" /><label for="isHidden_' + i + '"><input name="isHidden" type="checkbox" ' + (logConfig[i].isHidden ? 'checked' : '') + ' /> hide</label></div>'));
                    }
                }).fail(function() {
                    localStorage.setItem('logConfig_' + logManager.applicationName, undefined);
                }).always(function() {
                    logManager.initLogsGrid();
                });
            });
        },
        initLogsGrid: function () {
            $('#dtContainer > .overlay').show();
            $('#dtContainer > table').html('');
            $('#dtContainer > span').remove();

            $.ajax({
                url: window.appConfig.getUrl('/log/' + logManager.applicationName),
                dataType: 'jsonp',
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
                        var config = logManager.getColumnConfigurationByName(prop);
                        var colDef = {
                            "headerName": prop.toUpperCase(),
                            "field": prop,
                            "hide": config !== null ? config.isHidden : false,
                            "searchable": config !== null ? !config.isHidden : true,
                            "className": prop
                        };
                        if ((prop === 'createdAt' || prop.indexOf('date') >= 0) && !config.isHidden) {
                            colDef.sort = 'desc';
                            colDef.cellRenderer = function (params) {
                                var data = params.valueFormatted ? params.valueFormatted : params.value;
                                return moment(data).format('YYYY/MM/DD, HH:mm:ss');
                            };
                        }
                        nbCol++;
                        columnsDefinitions.push(colDef);
                    }

                    $('#logsGrid').empty();
                    var gridOptions = {

                        // PROPERTIES - object properties, myRowData and myColDefs are created somewhere in your application
                        rowData: datas,
                        columnDefs: columnsDefinitions,

                        // PROPERTIES - simple boolean / string / number properties
                        enableColResize: true,
                        enableSorting: true,
                        enableFilter:true,
                        groupHeaders: false,
                        headerHeight: 30,
                        rowHeight: 30,
                        rowSelection: 'multiple',
                        editable: false,

                        // CALLBACKS
                        isScrollLag: function () { return false; },
                        getRowClass: function (params) { return params.data.level != undefined ? params.data.level : ''; }
                    };

                    new agGrid.Grid(document.querySelector('#logsGrid'), gridOptions);
                    gridOptions.api.sizeColumnsToFit();

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
                $('#dtContainer').append('<span><strong> No logs received... </strong></span>');
            });
        },
        getApiKey: function (e) {
            $.ajax({
                url: window.appConfig.getUrl('/admin/keys/' + logManager.applicationName),
                dataType: 'jsonp',
                method: 'GET'
            }).done(function (data) {
                swal({
                    title: logManager.applicationName + " API Key",
                    text: data,
                    type: 'success',
                    showConfirmButton: true
                });
            });
        },
        deleteLogs: function (e) {
            $.ajax({
                url: window.appConfig.getUrl('/admin/' + logManager.applicationName + '/log', 'DELETE'),
                method: 'POST',
                dataType: 'json'
            }).success(function (data) {
                swal({
                    title: logManager.applicationName,
                    text: 'The registered logs have been removed',
                    type: 'success',
                    showConfirmButton: true
                });
                $('#dtContainer > .overlay').show();
                logManager.initLogsGrid();
            });
        },
        saveConfiguration: function (e) {
            e.preventDefault();

            var configuration = JSON.stringify(logManager.getConfigurationFormData());
            localStorage.setItem('logConfig_' + logManager.applicationName, configuration);

            $.ajax({
                url: '/api/Configuration/' + logManager.applicationName,
                method: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: configuration
            }).done(function (data) {
                logManager.initLogsGrid();
                $('#configurationModal').modal('hide');
            });
        }
    };

    $(document).ready(function () {
        logManager.applicationName = $('#hostname').val();

        $(document).on('submit', '#configForm', logManager.saveConfiguration);
        $(document).on('nlea.keyloaded', logManager.initConfiguration);
        $(document).on('click', '#getKeyBtn', logManager.getApiKey);
        $(document).on('click', '#deleteLogsBtn', logManager.deleteLogs);
    });
})();