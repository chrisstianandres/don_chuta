$(function () {
    var datatable = $("#datatable").DataTable({

        autoWidth: false,
         language: {
            "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
        },
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
                width: '10%'
            }
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

