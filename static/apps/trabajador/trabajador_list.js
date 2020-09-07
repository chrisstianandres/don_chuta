$(function () {
    var datatable = $("#datatable").DataTable({
        autoWidth: false,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json',
            searchPanes: {
                clearMessage: 'Limpiar Filtros',
                collapse: {
                    0: 'Filtros de Busqueda',
                    _: 'Filtros seleccionados (%d)'
                },
                title: {
                    _: 'Filtros seleccionados - %d',
                    0: 'Ningun Filtro seleccionados',
                },
                activeMessage: 'Filtros activos (%d)',
                emptyPanes: 'No existen suficientes datos para generar filtros :('

            }
        },
        dom: "<'top'B> frtip",
        buttons: [
            {
                className: 'btn-default my_class', extend: 'searchPanes', config: {
                    cascadePanes: true,
                    viewTotal: true,
                    layout: 'columns-4'
                }
            },
            {text: '<i class="fa fa-file-pdf"> Reporte</i>', className: 'btn-danger my_class', extend: 'pdfHtml5'},
        ],
        columnDefs: [
            {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + data + '</span>';
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                width: '10%',
            },
            {
                searchPanes: {
                    show: true,
                },
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data[9] === 'ACTIVO') {
                $('td', row).eq(9).find('span').addClass('badge bg-info');
            } else if (data[9] === 'INACTIVO') {
                $('td', row).eq(9).find('span').addClass('badge bg-important');
            }

        }
    });

    $('#datatable tbody').on('click', 'a[rel="estado"]', function () {
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data['0']};
        save_estado('Alerta',
            '/empleado/estado', 'Esta seguro que desea cambiar el estado de este trabajador?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito en la actualizacion', 'far fa-smile-wink', function () {
                    location.reload();
                })
            });
    });
});

