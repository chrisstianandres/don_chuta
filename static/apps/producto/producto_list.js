$(function () {
    var datatable = $("#datatable").DataTable({
        responsive: true,
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
                targets: [-4],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + data + '</span>';
                }
            },
            {
                targets: [-2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '$ ' + data;
                }
            },
            {
                targets: [3, -1],
                class: 'text-center'
            },
            {
                searchPanes: {
                    show: true,
                },
                targets: [0, 1, 2, 3, 5, 6]
            },
            {
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Menos de 20',
                            value: function (rowData, rowIdx) {
                                return rowData[4] < 20;
                            }
                        },
                        {
                            label: '20 a 30',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 30 && rowData[4] >= 20;
                            }
                        },
                        {
                            label: '30 a 40',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 40 && rowData[4] >= 30;
                            }
                        },
                        {
                            label: '40 a 50',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 50 && rowData[4] >= 40;
                            }
                        },
                        {
                            label: '50 a 60',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 60 && rowData[4] >= 50;
                            }
                        },
                        {
                            label: 'Mas de 60',
                            value: function (rowData, rowIdx) {
                                return rowData[4] > 60;
                            }
                        },
                    ]
                },
                targets: [4],
            },
        ],
        createdRow: function (row, data, dataIndex) {
            if (data[4] >= 51) {
                $('td', row).eq(4).find('span').addClass('badge bg-success');
            } else if (data[4] >= 10) {
                $('td', row).eq(4).find('span').addClass('badge bg-warning');
            } else if (data[4] <= 9) {
                $('td', row).eq(4).find('span').addClass('badge bg-important');
            }

        }

    });
    $('#datatable tbody').on('click', 'a[rel="del"]', function () {
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data['0']};
        save_estado('Alerta',
            '/producto/eliminar', 'Esta seguro que desea eliminar este producto?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al eliminar el producto!', 'far fa-smile-wink', function () {
                    location.reload();
                })
            });
    });
});