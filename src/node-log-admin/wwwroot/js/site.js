(function () {
    'use strict';
    window.appConfig = {
        domain: '',
        protocol: '',
        key: '',
        port: '',
        /* Return the formated url
         * @route: '/admin/hosts' for exemple
         * @method: the override method 'PUT', 'DELETE' ...
         */
        getUrl: function (route, method) {
            var url = window.appConfig.protocol + '://' + window.appConfig.domain + ':' + window.appConfig.port + route + '?key=' + window.appConfig.key;
            if (typeof method !== 'undefined')
                url += '&_method=' + method;

            return url;
        }
    };

    var Site = {
        InitConfig: function () {
            $.ajax({
                url: location.origin + "/Manage/GetApiKey",
                method: 'GET'
            }).done(function (data) {
                window.appConfig = $.extend({}, window.appConfig, data);
                $(document).trigger('nlea.keyloaded');
            });
        },
        DeleteApplication: function (hostname) {
            $.ajax({
                url: window.appConfig.getUrl('/admin/' + hostname, 'DELETE'),
                method: 'post',
                dataType: 'json'
            }).done(function (data) {
                swal({
                    title: "Success !",
                    text: 'The application had been removed',
                    type: 'success',
                    showConfirmButton: true
                });
            }).fail(function (jqXHR, textStatus, errorThrown) {
                swal({
                    title: "Error :",
                    type: 'error',
                    text: errorThrown
                });
            }).always(function () {
                Site.LoadApplications();
            });
        },
        LoadApplications: function () {
            $.ajax({
                url: window.appConfig.getUrl('/admin/hosts'),
                method: 'GET',
                dataType: 'jsonp'
            }).done(function (data) {
                var $appList = $('#hostList');
                $appList.html('');
                for (var i in data) {
                    $appList.prepend($('<li><div class="row"><div class="col-md-12"><a class="logLink" data-menu-link="' + data[i] + '" data-hostname="' + data[i] + '" title="Log" href="/log/' + data[i] + '"><i class="fa fa-circle-o"></i> ' + data[i] + '</a><button class="pull-right btn-sm btn-danger noborder appDeleteBtn"><i class="fa fa-trash"></i></button></div></div></li>'));
                }
                $appList.prepend($('<div class="sidebar-form"><input id="appFilter" class="form-control" placeholder="Filter" type="text"></div>'))
                        .append('<li><a id="addAppBtn" title="" href="#" class="btn btn-flat"><i class="fa fa-plus"></i> Add</a></li>');

                $(document).on('click', '.appDeleteBtn', function (event) {
                    var target = $(this).parent('div').find('.logLink').data('hostname');
                    swal({   //removed the brackets from session because laracasts doesn't show them 
                        title: "Delete an application",
                        text: "Do you really want to delete this application ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "Cancel",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function (isConfirm) {
                        if (isConfirm) {
                            Site.DeleteApplication(target);
                        }
                    });
                });
            }).always(function (jqXHR, textStatus) {
                $('#sidebar_left').find('li.active').removeClass('active');
                var $actualMenuLink = $('#sidebar_left').find('a[data-menu-link="' + $('#mainContainer').data('menu-link') + '"]');
                $actualMenuLink.parents('li').addClass('active').find('> .accordion-toggle').addClass('menu-open');
            });
        },
        ShowModalAddApplication: function (event) {
            // open a modal to get the application name then send a request to node log engine to register this app.
            // Finally show the api key
            $('#addAppModal').modal({ backdrop: 'static' });
        },
        RegisterApplication: function (event) {
            if ($('#appNameField').val() !== '') {
                $.ajax({
                    url: window.appConfig.getUrl('/admin/register/' + $('#appNameField').val(), 'PUT'),
                    method: 'POST',
                    dataType: 'json'
                }).done(function (data) {
                    swal({
                        title: "Success !",
                        text: 'The API key is : ' + data,
                        type: 'success',
                        showConfirmButton: true
                    });
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    swal({
                        title: "Error :",
                        type: 'error',
                        text: errorThrown
                    });
                }).always(function () {
                    Site.LoadApplications();
                });

                $('#addAppModal').modal('hide');
                $('#appNameField').val('');
            }
        }
    }

    $(document).ready(function () {

        $(document).on('keyup', '#appFilter', function (e) {
            $('.logLink').each(function () {
                if ($(this).data('hostname').indexOf($('#appFilter').val()) < 0)
                    $(this).parent('li').hide();
                else
                    $(this).parent('li').show();

            });
        });

        Site.InitConfig();

        $(document).on('nlea.keyloaded', function (e) {
            Site.LoadApplications(e);

            $(document).on('click', '#addAppBtn', Site.ShowModalAddApplication);

            $(document).on('click', '#submitAppName', Site.RegisterApplication);
        });
    });
})();