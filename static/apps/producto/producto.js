$(document).ready(function () {
    indice_ganancia();
    $('input[name="pcp"]').TouchSpin({
        min: 0.05,
        max: 1000000,
        step: 0.01,
        decimals: 2,
        forcestepdivisibility: 'none',
        boostat: 5,
        maxboostedstep: 10,
        prefix: '$'
    });
    $('input[name="pcp"]').on('change keyup', function () {
        indice_ganancia();
    });

    $.validator.setDefaults({
        errorClass: 'help-block',
        highlight: function (element, errorClass, validClass) {
            $(element)
                .parent('div')
                .addClass("has-error")
                .removeClass("has-success");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element)
                .parent('div')
                .addClass("has-success")
                .removeClass("has-error");
        }
    });
    $("#form").validate({
        rules: {
            nombre: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            descripcion: {
                required: true,
                minlength: 3,
                maxlength: 50
            },
            categoria: {
                required: true
            },
            presentacion: {
                required: true
            },
        },
        messages: {
            nombre: {
                required: "Porfavor ingresa el nombre del producto",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            descripcion: {
                required: "Porfavor ingresa una descripcion del producto",
                minlength: "Debe ingresar al menos 3 letras",
                lettersonly: "Debe ingresar unicamente letras y espacios"
            },
            categoria: {
                required: "Debe escoger una categoria de producto",

            },
            presentacion: {
                required: "Debe escoger una presentacion de producto",

            },
        },
    });
    $('#id_nombre').keyup(function () {
        var pal = $(this).val();
        var changue = pal.substr(0, 1).toUpperCase() + pal.substr(1);
        $(this).val(changue);
    });
    $('#id_descripcion').keyup(function () {
        var pal = $(this).val();
        var changue = pal.substr(0, 1).toUpperCase() + pal.substr(1);
        $(this).val(changue);
    });

});

function indice_ganancia() {
    var indice = 0.40;
    var pc = $('input[name="pcp"]').val();
    var tind = parseFloat(pc * (1 + indice)).toFixed(2);
    console.log(pc);
    $('input[name="pvp"]').val(tind).attr('readonly', true);
}