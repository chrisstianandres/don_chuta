var datatable;

var datos = {
    fechas: {
        'start_date': '',
        'end_date': ''
    },
    add: function (data) {
        if (data.key === 1) {
            this.fechas['start_date'] = data.startDate.format('YYYY-MM-DD');
            this.fechas['end_date'] = data.endDate.format('YYYY-MM-DD');
        } else {
            this.fechas['start_date'] = '';
            this.fechas['end_date'] = '';
        }

        $.ajax({
            url: '/venta/data',
            type: 'POST',
            data: this.fechas,
            success: function (data) {
                datatable.clear();
                datatable.rows.add(data).draw();
            }
        });

    },
};
$(function () {
    datatable = $("#datatable").DataTable({
        // responsive: true,
        destroy: true,
        scrollX: true,
        autoWidth: false,
        ajax: {
            url: '/venta/data',
            type: 'POST',
            data: datos.fechas,
            dataSrc: ""
        },
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
                    0: 'Ningun Filtro seleccionado',
                },
                activeMessage: 'Filtros activos (%d)',
                emptyPanes: 'There are no panes to display. :/',
                sZeroRecords :    "No se encontraron resultados",

            }
        },
        order: [[5, "desc"]],
        dom: 'B<"toolbar">frtip ',
        buttons: [
            {
                // text: '<i class="fa fa-search-minus" id="fecha"> Filtar por fecha</i>'
                text: '<i class="fa fa-search-minus"> Filtar por fecha</i>',
                className: 'btn-success my_class',
                action: function (e, dt, node, config) {
                    daterange();
                }
            },
            {
                className: 'btn-default my_class',
                extend: 'searchPanes',
                config: {
                    cascadePanes: true,
                    viewTotal: true,
                    layout: 'columns-4'
                }
            },
            {text: '<i class="fa fa-file-pdf"> Reporte</i>', className: 'btn-danger my_class', extend: 'pdfHtml5'},
        ],
        columnDefs: [
            {
                searchPanes: {
                    show: true,
                },
                targets: [1, 3],
            },
            {
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'FINALIZADA',
                            value: function (rowData, rowIdx) {
                                return rowData[4] === 'FINALIZADA';
                            }
                        },
                        {
                            label: 'DEVUELTA',
                            value: function (rowData, rowIdx) {
                                return rowData[4] === 'DEVUELTA';
                            }
                        },
                    ]
                },
                targets: [4],
            },
            {
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Menos de $ 10',
                            value: function (rowData, rowIdx) {
                                return rowData[2] < 10;
                            }
                        },
                        {
                            label: '$ 10 a $ 50',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 50 && rowData[2] >= 10;
                            }
                        },
                        {
                            label: '$ 50 a $ 100',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 100 && rowData[2] >= 50;
                            }
                        },
                        {
                            label: '$ 100 a $ 200',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 200 && rowData[2] >= 100;
                            }
                        },
                        {
                            label: '$ 200 a $ 300',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 300 && rowData[2] >= 200;
                            }
                        },
                        {
                            label: '$ 300 a $ 400',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 400 && rowData[2] >= 300;
                            }
                        },
                        {
                            label: '$ 400 a $ 500',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 500 && rowData[2] >= 400;
                            }
                        },
                        {
                            label: 'Mas de $ 500',
                            value: function (rowData, rowIdx) {
                                return rowData[2] > 500;
                            }
                        },
                    ]
                },
                targets: [2],
            },
            {
                targets: '_all',
                class: 'text-center',

            },
            {
                targets: [2],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '$' + parseFloat(data).toFixed(2);
                }
            },
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
                width: "10%",
                render: function (data, type, row) {
                    var detalle = '<a type="button" rel="detalle" class="btn btn-success btn-sm btn-round" data-toggle="tooltip" title="Detalle de Productos" ><i class="fa fa-search"></i></a>' + '';
                    var devolver = '<a type="button" rel="devolver" class="btn btn-danger btn-sm btn-round" style="color: white" data-toggle="tooltip" title="Devolver"><i class="fa fa-times"></i></a>';
                    return detalle + devolver;
                }
            },
            {
                targets: [-3],
                render: function (data, type, row) {
                    return pad(data, 10);
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            if (data[4] === 'FINALIZADA') {
                $('td', row).eq(4).find('span').addClass('badge bg-success');
            } else if (data[4] === 'DEVUELTA') {
                $('td', row).eq(4).find('span').addClass('badge bg-important');
                $('td', row).eq(5).find('a[rel="estado"]').hide();
            }

        }
    });

    $('#datatable tbody').on('click', 'a[rel="estado"]', function () {
        $('.tooltip').remove();
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data['5']};
        save_estado('Alerta',
            '/venta/estado', 'Esta seguro que desea finalizar esta venta?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al finalizar la venta', 'far fa-smile-wink', function () {
                    location.reload();
                })
            });

    }).on('click', 'a[rel="borrar"]', function () {
        $('.tooltip').remove();
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data['5']};
        save_estado('Alerta',
            '/venta/eliminar', 'Esta seguro que desea eliminar esta venta?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al Eliminar la venta', 'far fa-smile-wink')
            });
    })
        .on('click', 'a[rel="detalle"]', function () {
            $('.tooltip').remove();
            var tr = datatable.cell($(this).closest('td, li')).index();
            var data = datatable.row(tr.row).data();
            $('#Modal').modal('show');
            $("#tbldetalle_productos").DataTable({
                responsive: true,
                autoWidth: false,
                language: {
                    "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
                },
                destroy: true,
                ajax: {
                    url: '/venta/get_detalle',
                    type: 'Post',
                    data: {
                        'id': data['3']
                    },
                    dataSrc: ""
                },
                columns: [
                    {data: 'producto.nombre'},
                    {data: 'producto.categoria.nombre'},
                    {data: 'producto.presentacion.nombre'},
                    {data: 'cantidad'},
                    {data: 'producto.pvp'},
                    {data: 'venta.subtotal'}
                ],
                columnDefs: [
                    {
                        targets: '_all',
                        class: 'text-center'
                    },
                    {
                        targets: [-1, -2],
                        class: 'text-center',
                        orderable: false,
                        render: function (data, type, row) {
                            return '$' + parseFloat(data).toFixed(2);
                        }
                    },
                ],
            });

        });

});


function daterange() {
    $("div.toolbar").html('<br><div class="col-lg-3"><input type="text" name="fecha" class="form-control form-control-sm input-sm"></div> <br>');
    $('input[name="fecha"]').daterangepicker({
        locale: {
            format: 'YYYY-MM-DD',
            applyLabel: '<i class="fas fa-search"></i> Buscar',
            cancelLabel: '<i class="fas fa-times"></i> Cancelar',
        }
    }).on('apply.daterangepicker', function (ev, picker) {
        picker['key']=1;
        datos.add(picker);
        // filter_by_date();

    }).on('cancel.daterangepicker', function (ev, picker) {
        picker['key']=0;
        datos.add(picker);

    });

}

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
