var tblcompra;
var compras = {
    items: {
        fecha_compra: '',
        proveedor: '',
        subtotal: 0.00,
        iva: 0.00,
        iva_emp: 0.00,
        total: 0.00,
        productos: [],
    },
    calculate: function () {
        var subtotal = 0.00;
        var iva_emp = 0.00;
        $.each(this.items.productos, function (pos, dict) {
            dict.subtotal = dict.cantidad * parseFloat(dict.pvp);
            subtotal += dict.subtotal;
            iva_emp = dict.iva_emp;
        });
        this.items.subtotal = subtotal;
        this.items.iva = this.items.subtotal * iva_emp;
        this.items.total = this.items.subtotal + this.items.iva;
        $('input[name="subtotal"]').val(this.items.subtotal.toFixed(2));
        $('input[name="iva"]').val(this.items.iva.toFixed(2));
        $('input[name="total"]').val(this.items.total.toFixed(2));
    },
    add: function (data) {
        this.items.productos.push(data);
        this.list();
    },
    list: function () {
        this.calculate();
        tblcompra = $("#tblinsumos").DataTable({
            destroy: true,
            autoWidth: false,
            dataSrc: "",
            scrollX: true,
            language: {
                "url": '//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json'
            },
            data: this.items.productos,
            columns: [
                {data: 'id'},
                {data: "nombre"},
                {data: "categoria.nombre"},
                {data: "presentacion.nombre"},
                {data: "cantidad"},
                {data: "pvp"},
                {data: "subtotal"}
            ],
            columnDefs: [
                {
                    targets: [0],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a rel="remove" type="button" class="btn btn-danger btn-sm btn-flat" style="color: white" data-toggle="tooltip" title="Eliminar Insumo"><i class="fa fa-trash-alt"></i></a>';
                        //return '<a rel="remove" class="btn btn-danger btn-sm btn-flat"><i class="fas fa-trash-alt"></i></a>';

                    }
                },
                {
                    targets: [-1, -2],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '$' + parseFloat(data).toFixed(2);
                    }
                },
                {
                    targets: [-3],
                    class: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        return '<input type="text" name="cantidad" class="form-control form-control-sm input-sm" autocomplete="off" value="' + data + '">';

                    }
                }],
            rowCallback: function (row, data) {
                $(row).find('input[name="cantidad"]').TouchSpin({
                    min: 1,
                    max: 100000000,
                    step: 1
                });
            }
        });
    }
};
$(function () {
    //texto de los selects
    $('.select2').select2({
        "language": {
            "noResults": function () {
                return "Sin resultados";
            }
        },
        allowClear: true
    });
    //seleccionar producto del select producto
    $('#id_producto').on('select2:select', function (e) {
        var crud = $('input[name="crud"]').val();

        $.ajax({
            type: "POST",
            url: crud,
            data: {
                "id": $('#id_producto option:selected').val(),
            },
            dataType: 'json',
            success: function (data) {
                compras.add(data['0']);
                $('#id_producto option:selected').remove();
            },
            error: function (xhr, status, data) {
                alert(data['0']);
            },

        })
    });
    //cantidad de productos
    $('#tblinsumos tbody').on('click', 'a[rel="remove"]', function () {
        var tr = tblcompra.cell($(this).closest('td, li')).index();
        borrar_todo_alert('Alerta de Eliminación',
            'Esta seguro que desea eliminar este producto de tu detalle?', function () {
                var p = compras.items.productos[tr.row];
                compras.items.productos.splice(tr.row, 1);
                $('#id_producto').append('<option value="' + p.id + '">' + p.nombre + '</option>');
                menssaje_ok('Confirmacion!', 'Producto eliminado', 'far fa-smile-wink', function () {
                    compras.list();
                });
            })
    })
        .on('change', 'input[name="cantidad"]', function () {
            var cantidad = parseInt($(this).val());
            var tr = tblcompra.cell($(this).closest('td, li')).index();
            compras.items.productos[tr.row].cantidad = cantidad;
            compras.calculate();
            $('td:eq(6)', tblcompra.row(tr.row).node()).html('$' + compras.items.productos[tr.row].subtotal.toFixed(2));
        });
    $('.btnRemoveall').on('click', function () {
        if (compras.items.productos.length === 0) return false;
        borrar_todo_alert('Alerta de Eliminación',
            'Esta seguro que desea eliminar todos los productos seleccionados?', function () {
                compras.items.productos = [];
                menssaje_ok('Confirmacion!', 'Productos eliminados', 'far fa-smile-wink', function () {
                    compras.list();
                });
            });
    });

    $('#save').on('click', function () {
        if ($('select[name="proveedor"]').val() === "") {
            menssaje_error('Error!', "Debe seleccionar un proveedor", 'far fa-times-circle');
            return false
        } else if (compras.items.productos.length === 0) {
            menssaje_error('Error!', "Debe seleccionar al menos un producto", 'far fa-times-circle');
            return false
        }
        var action = $('input[name="action"]').val();
        var key = $('input[name="key"]').val();
        var parametros;
        compras.items.fecha_compra = $('input[name="fecha_compra"]').val();
        compras.items.proveedor = $('#id_proveedor option:selected').val();
        if (action === 'edit') {
            parametros = {'compras': JSON.stringify(compras.items)};
            parametros['action'] = action;
            parametros['key'] = key;
            save_with_ajax('Alerta',
                '../../compra/editar_save', 'Esta seguro que desea editar esta compra?', parametros, function () {
                    location.href = '../../compra/lista';
                });
        } else {
            parametros = {'compras': JSON.stringify(compras.items)};
            save_with_ajax('Alerta',
                '/compra/crear', 'Esta seguro que desea guardar esta compra?', parametros, function () {
                    location.href = '/compra/lista';
                });
        }
    });
});

