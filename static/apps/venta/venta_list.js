var datatable;
$(function () {
    datatable = $("#datatable").DataTable({
        // responsive: true,
        destroy: true,
        scrollX: true,
        autoWidth: false,
        language: {
            "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
        },
        order: [[5, "desc"]],
        columnDefs: [
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
                    return '<span>' +data+ '</span>';
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                width: "10%",
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

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
