var datatable;
var logotipo;
const toDataURL = url => fetch(url).then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob)
    }));

toDataURL('/media/logo_don_chuta.png').then(dataUrl => {
    logotipo = dataUrl;
});
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
            url: '/venta/data_report',
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
        destroy: true,
        scrollX: true,
        autoWidth: false,
        ajax: {
            url: '/venta/data_report',
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
                sZeroRecords: "No se encontraron resultados",

            }
        },

        dom: 'B<"toolbar">lfrtip ',
        buttons: [
            {
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
                    layout: 'columns-5'
                }
            },
            {
                text: '<i class="fa fa-file-pdf"> Reporte PDF</i>',
                className: 'btn btn-danger my_class',
                extend: 'pdfHtml5',
                footer: true ,
                //filename: 'dt_custom_pdf',
                orientation: 'landscape', //portrait
                pageSize: 'A4', //A3 , A5 , A6 , legal , letter
                download: 'open',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4],
                    search: 'applied',
                    order: 'applied'
                },
                customize: function (doc) {
                    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre",
                        "Noviembre", "Diciembre"
                    ];
                    var date = new Date();

                    function formatDateToString(date) {
                        // 01, 02, 03, ... 29, 30, 31
                        var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
                        // 01, 02, 03, ... 10, 11, 12
                        // month < 10 ? '0' + month : '' + month; // ('' + month) for string result
                        var MM = monthNames[date.getMonth()]; //monthNames[d.getMonth()])
                        // 1970, 1971, ... 2015, 2016, ...
                        var yyyy = date.getFullYear();
                        // create the format you want
                        return (dd + " de " + MM + " de " + yyyy);
                    }

                    var jsDate = formatDateToString(date);

                    //[izquierda, arriba, derecha, abajo]
                    doc.pageMargins = [25, 120, 25, 50];
                    doc.defaultStyle.fontSize = 12;
                    doc.styles.tableHeader.fontSize = 14;
                    doc['header'] = (function () {
                        return {
                            columns: [{alignment: 'center', image: logotipo, width: 300}],
                            margin: [280, 10, 0, 0] //[izquierda, arriba, derecha, abajo]
                        }
                    });
                    doc['footer'] = (function (page, pages) {
                        return {
                            columns: [
                                {
                                    alignment: 'left',
                                    text: ['Reporte creado el: ', {text: jsDate.toString()}]
                                },
                                {
                                    alignment: 'right',
                                    text: ['Pagina ', {text: page.toString()}, ' de ', {text: pages.toString()}]
                                }
                            ],
                            margin: 20
                        }
                    });
                    var objLayout = {};
                    objLayout['hLineWidth'] = function (i) {
                        return .5;
                    };
                    objLayout['vLineWidth'] = function (i) {
                        return .5;
                    };
                    objLayout['hLineColor'] = function (i) {
                        return '#000000';
                    };
                    objLayout['vLineColor'] = function (i) {
                        return '#000000';
                    };
                    objLayout['paddingLeft'] = function (i) {
                        return 4;
                    };
                    objLayout['paddingRight'] = function (i) {
                        return 4;
                    };
                    doc.content[0].layout = objLayout;
                    doc.content[1].table.widths = ["*", "*", "*", "*", "*"];
                    doc.styles.tableBodyEven.alignment = 'center';
                    doc.styles.tableBodyOdd.alignment = 'center';
                    doc.styles.tableFooter.alignment = 'center';
                }
            },
            {
                text: '<i class="fa fa-file-excel"> Reporte Excel</i>', className: "btn btn-success my_class",
                extend: 'excel',
                footer: true
            },
            {
                text: '<i class="fas fa-funnel-dollar"> Reporte por Totales</i>',
                className: 'btn-primary my_class',
                action: function (e, dt, node, config) {
                    window.location.href = $('#filter_prod').val();
                }
            },
        ],
        columnDefs: [
            {
                searchPanes: {
                    show: true,
                },
                targets: [1],
            },

            {
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Menos de  10',
                            value: function (rowData, rowIdx) {
                                return rowData[2] < 10;
                            }
                        },
                        {
                            label: ' 10 a  50',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 50 && rowData[2] >= 10;
                            }
                        },
                        {
                            label: ' 50 a  100',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 100 && rowData[2] >= 50;
                            }
                        },
                        {
                            label: ' 100 a  200',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 200 && rowData[2] >= 100;
                            }
                        },
                        {
                            label: '200 a 300',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 300 && rowData[2] >= 200;
                            }
                        },
                        {
                            label: ' 300 a  400',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 400 && rowData[2] >= 300;
                            }
                        },
                        {
                            label: ' 400 a  500',
                            value: function (rowData, rowIdx) {
                                return rowData[2] <= 500 && rowData[2] >= 400;
                            }
                        },
                        {
                            label: 'Mas de  500',
                            value: function (rowData, rowIdx) {
                                return rowData[2] > 500;
                            }
                        },
                    ]
                },
                targets: [2],
            },
               {
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Menos de $ 10',
                            value: function (rowData, rowIdx) {
                                return rowData[3] < 10;
                            }
                        },
                        {
                            label: '$ 10 a $ 50',
                            value: function (rowData, rowIdx) {
                                return rowData[3] <= 50 && rowData[3] >= 10;
                            }
                        },
                        {
                            label: '$ 50 a $ 100',
                            value: function (rowData, rowIdx) {
                                return rowData[3] <= 100 && rowData[3] >= 50;
                            }
                        },
                        {
                            label: '$ 100 a $ 200',
                            value: function (rowData, rowIdx) {
                                return rowData[3] <= 200 && rowData[3] >= 100;
                            }
                        },
                        {
                            label: '$ 200 a $ 300',
                            value: function (rowData, rowIdx) {
                                return rowData[3] <= 300 && rowData[3] >= 200;
                            }
                        },
                        {
                            label: '$ 300 a $ 400',
                            value: function (rowData, rowIdx) {
                                return rowData[3] <= 400 && rowData[3] >= 300;
                            }
                        },
                        {
                            label: '$ 400 a $ 500',
                            value: function (rowData, rowIdx) {
                                return rowData[3] <= 500 && rowData[3] >= 400;
                            }
                        },
                        {
                            label: 'Mas de $ 500',
                            value: function (rowData, rowIdx) {
                                return rowData[3] > 500;
                            }
                        },
                    ]
                },
                targets: [3],
            },
            {
                searchPanes: {
                    show: true,
                    options: [
                        {
                            label: 'Menos de $ 10',
                            value: function (rowData, rowIdx) {
                                return rowData[4] < 10;
                            }
                        },
                        {
                            label: '$ 10 a $ 50',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 50 && rowData[4] >= 10;
                            }
                        },
                        {
                            label: '$ 50 a $ 100',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 100 && rowData[4] >= 50;
                            }
                        },
                        {
                            label: '$ 100 a $ 200',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 200 && rowData[4] >= 100;
                            }
                        },
                        {
                            label: '$ 200 a $ 300',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 300 && rowData[4] >= 200;
                            }
                        },
                        {
                            label: '$ 300 a $ 400',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 400 && rowData[4] >= 300;
                            }
                        },
                        {
                            label: '$ 400 a $ 500',
                            value: function (rowData, rowIdx) {
                                return rowData[4] <= 500 && rowData[4] >= 400;
                            }
                        },
                        {
                            label: 'Mas de $ 500',
                            value: function (rowData, rowIdx) {
                                return rowData[4] > 500;
                            }
                        },
                    ]
                },
                targets: [4],
            },
            {
                targets: '_all',
                class: 'text-center',

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
                targets: [-1],
                width: '20%',
                render: function (data, type, row) {
                    return '$ ' + data ;
                }
            },
        ],
        footerCallback : function ( row, data, start, end, display ) {
                 var api = this.api(), data;

                 // Remove the formatting to get integer data for summation
                 var intVal = function ( i ) {
                     return typeof i === 'string' ?
                         i.replace(/[\$,]/g, '')*1 :
                         typeof i === 'number' ?
                             i : 0;
                 };
                 // Total over this page
                 pageTotal = api
                     .column( 4, { page: 'current'} )
                     .data()
                     .reduce( function (a, b) {
                         return intVal(a) + intVal(b);
                     }, 0 );
                 cantTotal = api
                     .column( 2, { page: 'current'} )
                     .data()
                     .reduce( function (a, b) {
                         return intVal(a) + intVal(b);
                     }, 0 );

                 // Update footer
                 $( api.column( 4 ).footer() ).html(
                     '$'+parseFloat(pageTotal).toFixed(2)
                     // parseFloat(data).toFixed(2)
                 );
                 $( api.column( 2 ).footer() ).html(
                     cantTotal
                     // parseFloat(data).toFixed(2)
                 );
             },

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
        picker['key'] = 1;
        datos.add(picker);
        // filter_by_date();

    }).on('cancel.daterangepicker', function (ev, picker) {
        picker['key'] = 0;
        datos.add(picker);

    });

}
