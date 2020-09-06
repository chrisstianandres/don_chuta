$(function () {
    var datatable = $("#datatable").DataTable({
        responsive: true,
        autoWidth: false,
        language:
            {
              url:  '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
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
                    return '$ ' + data ;
                }
            },
            {
                targets: [3, -1],
                class: 'text-center'
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