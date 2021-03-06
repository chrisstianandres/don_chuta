var grapie = Highcharts.chart('grapie', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Ventas del Mes por Producto',
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '110%'
        }
    },
});
var chart = Highcharts.chart('container2', {
    chart: {
        inverted: true,
        polar: false
    },

    title: {
        text: 'Ventas del año'
    },
    xAxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    },
    yAxis: {
        title: {
            text: 'Valores'
        }
    },

});

var graph = Highcharts.chart('container3', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Compras y ventas del año'
    },
    subtitle: {
        text: 'Contraste de compras y ventas'
    },
    xAxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    },
    yAxis: {
        title: {
            text: 'Dolares $'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
});

function cahrtventas() {
    $.ajax({
        url: '/venta/chart',
        type: 'POST',
        data: {'action': 'chart'},
        dataSrc: "",
    }).done(function (data) {
        console.log(data['chart3'].ventas);
        chart.addSeries(data['dat']);
        grapie.addSeries(
            {
                type: 'pie',
                name: 'Total',
                innerSize: '50%',
                data: data['chart2'].data
            }
        );
        graph.addSeries(
            {
                name: 'Compras',
                data: data['chart3'].compras
            },
        );
        graph.addSeries(
            {
                name: 'Ventas',
                data: data['chart3'].ventas
            }
        )
    });
}

function datatbles() {
    $("#datatable").DataTable({
        autoWidth: false,
        dom: "tip",
        ScrollX: '90%',
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },
        ajax: {
            url: '/producto/index',
            type: 'POST',
            dataSrc: "",
        },
        columns: [
            {data: 'id'},
            {data: "nombre"},
            {data: "categoria.nombre"},
            {data: "presentacion.nombre"},
            {data: "stock"}
        ],
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '<span>' + data + '</span>';
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            $('td', row).eq(4).find('span').addClass('badge bg-important');
        }
    });
    $("#datatable2").DataTable({
        autoWidth: false,
        // responsive: true,
        dom: "tip",
        // ScrollX: '90%',
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },
        ajax: {
            url: '/compra/index',
            type: 'POST',
            dataSrc: "",
        },
        columns: [
            {data: 'compra.fecha_compra'},
            {data: "producto.nombre"},
            {data: "producto.presentacion.nombre"},
            {data: "cantidad"},
            {data: "compra.total"}
        ],
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                render: function (data, type, row) {
                    return '$' + data;
                }
            },
            {
                targets: [-2],
                class: 'text-center',
                width: '10%'
            },
            {
                targets: '_all',
                class: 'text-center',
                orderable: false
            }
        ]
    });
}


$(function () {
    datatbles();
    cahrtventas();


});