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
        order: [[ 3, "desc" ]],
        columnDefs: [
            {
                targets: '_all',
                class: 'text-center',

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
            if (data[4] === '<span>FINALIZADA</span>') {
                $('td', row).eq(4).find('span').addClass('badge bg-success');
            } else if (data[4] === '<span>DEVUELTA</span>') {
                $('td', row).eq(4).find('span').addClass('badge bg-important');
                $('td', row).eq(5).find('a[rel="devolver"]').hide();
            }

        }
    });

    $('#datatable tbody').on('click', 'a[rel="devolver"]', function () {
        $('.tooltip').remove();
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        var parametros = {'id': data['3']};
        save_estado('Alerta',
            '/compra/estado', 'Esta seguro que desea devolver esta compra?', parametros,
            function () {
                menssaje_ok('Exito!', 'Exito al devolver la compra', 'far fa-smile-wink', function () {
                    location.reload();
                })
            });

    })
        .on('click', 'a[rel="detalle"]', function () {
        $('.tooltip').remove();
        var tr = datatable.cell($(this).closest('td, li')).index();
        var data = datatable.row(tr.row).data();
        $('#Modal').modal('show');
        $("#tbldetalle_insumos").DataTable({
            responsive: true,
            autoWidth: false,
            language: {
                "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
            destroy: true,
            ajax: {
                url: '/compra/get_detalle',
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
                {data: 'compra.subtotal'}
            ],
            columnDefs: [
                {
                    targets: [3],
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

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}
