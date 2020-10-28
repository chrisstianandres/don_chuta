import json
from datetime import datetime

from django.db import transaction
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.compra.models import Compra
from apps.venta.forms import VentaForm, Detalle_VentaForm
from apps.venta.models import Venta, Detalle_venta
from apps.empresa.models import Empresa
from apps.producto.models import Producto

import os
from django.conf import settings
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.contrib.staticfiles import finders

opc_icono = 'fa fa-shopping-basket '
opc_entidad = 'Ventas'
crud = '/venta/crear'


class lista(ListView):
    model = Venta
    template_name = 'front-end/venta/venta_list.html'

    def get_queryset(self):
        return Venta.objects.none()

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Nueva Venta'
        data['titulo'] = 'Listado de Ventas'
        data['nuevo'] = '/venta/nuevo'
        data['filter_prod'] = '/venta/report_by_product'
        return data


class report(ListView):
    model = Venta
    template_name = 'front-end/venta/venta_report_product.html'

    def get_queryset(self):
        return Venta.objects.none()

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Nueva Venta'
        data['titulo'] = 'Listado de Ventas'
        data['nuevo'] = '/venta/nuevo'
        data['filter_prod'] = '/venta/lista'
        return data


@csrf_exempt
def data(request):
    data = []
    start_date = request.POST.get('start_date', '')
    end_date = request.POST.get('end_date', '')
    try:
        if start_date == '' and end_date == '':
            venta = Venta.objects.all()
            for c in venta:
                data.append([
                    c.fecha_venta.strftime('%d-%m-%Y'),
                    c.cliente.nombres + " " + c.cliente.apellidos,
                    c.empleado.get_full_name(),
                    format(c.total, '.2f'),
                    c.id,
                    c.get_estado_display(),
                    c.id
                ])
        else:
            venta = Venta.objects.filter(fecha_venta__range=[start_date, end_date])
            for c in venta:
                data.append([
                    c.fecha_venta.strftime('%d-%m-%Y'),
                    c.cliente.nombres + c.cliente.apellidos,
                    c.empleado.get_full_name(),
                    format(c.total, '.2f'),
                    c.id,
                    c.get_estado_display(),
                    c.id
                ])
    except:
        pass
    return JsonResponse(data, safe=False)


@csrf_exempt
def data_report(request):
    data = []
    start_date = request.POST.get('start_date', '')
    end_date = request.POST.get('end_date', '')
    try:
        if start_date == '' and end_date == '':
            query = Detalle_venta.objects.values('venta__fecha_venta', 'producto__nombre', 'producto__pvp').order_by(). \
                annotate(Sum('cantidad'))
            for p in query:
                data.append([
                    p['venta__fecha_venta'].strftime("%d/%m/%Y"),
                    p['producto__nombre'],
                    int(p['cantidad__sum']),
                    format(p['producto__pvp'], '.2f'),
                    format(p['producto__pvp'] * p['cantidad__sum'], '.2f'),
                ])
        else:
            query = Detalle_venta.objects.values('venta__fecha_venta', 'producto__nombre', 'producto__pvp') \
                .filter(venta__fecha_venta__range=[start_date, end_date]).order_by().annotate(Sum('cantidad'))
            for p in query:
                data.append([
                    p['venta__fecha_venta'].strftime("%d/%m/%Y"),
                    p['producto__nombre'],
                    int(p['cantidad__sum']),
                    format(p['producto__pvp'], '.2f'),
                    format(p['producto__pvp'] * p['cantidad__sum'], '.2f'),
                ])
    except:
        pass
    return JsonResponse(data, safe=False)


def nuevo(request):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': '../venta/get_producto',
        'boton': 'Guardar Venta', 'action': 'add', 'titulo': 'Nuevo Registro de una Venta',
        'key': ''
    }
    if request.method == 'GET':
        data['form'] = VentaForm()
        data['form2'] = Detalle_VentaForm()
        data['detalle'] = []
    return render(request, 'front-end/venta/venta_form.html', data)


@csrf_exempt
def crear(request):
    data = {}
    if request.method == 'POST':
        datos = json.loads(request.POST['ventas'])
        if datos:
            with transaction.atomic():
                c = Venta()
                c.fecha_venta = datos['fecha_venta']
                c.cliente_id = datos['cliente']
                c.empleado_id = request.user.id
                c.subtotal = float(datos['subtotal'])
                c.iva = float(datos['iva'])
                c.total = float(datos['total'])
                c.save()
                for i in datos['productos']:
                    dv = Detalle_venta()
                    dv.venta_id = c.id
                    dv.producto_id = i['id']
                    dv.cantidad = int(i['cantidad'])
                    dv.subtotal = float(i['subtotal'])
                    dv.save()
                    x = Producto.objects.get(pk=i['id'])
                    x.stock = x.stock - int(i['cantidad'])
                    x.save()
                    data['id'] = c.id
                    data['resp'] = True
        else:
            data['resp'] = False
            data['error'] = "Datos Incompletos"
    return HttpResponse(json.dumps(data), content_type="application/json")


def editar(request, id):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': '../../venta/get_producto',
        'boton': 'Editar Venta', 'action': 'edit', 'titulo': 'Editar Registro de una Venta',
        'key': id
    }
    venta = Venta.objects.get(id=id)
    if request.method == 'GET':
        data['form'] = VentaForm(instance=venta)
        data['form2'] = Detalle_VentaForm()
        data['detalle'] = json.dumps(get_detalle_productos(id))
    return render(request, 'front-end/venta/venta_form.html', data)


@csrf_exempt
def editar_save(request):
    data = {}
    datos = json.loads(request.POST['ventas'])
    if request.POST['action'] == 'edit':

        with transaction.atomic():
            # c = Compra.objects.get(pk=self.get_object().id)
            c = Venta.objects.get(pk=request.POST['key'])
            c.fecha_venta = datos['fecha_venta']
            c.cliente_id = datos['cliente']
            c.subtotal = float(datos['subtotal'])
            c.iva = float(datos['iva'])
            c.total = float(datos['total'])
            c.save()
            c.detalle_venta_set.all().delete()
            for i in datos['productos']:
                dv = Detalle_venta()
                dv.venta_id = c.id
                dv.producto_id = i['id']
                dv.cantidad = int(i['cantidad'])
                dv.save()
                data['resp'] = True
    else:
        data['resp'] = False
        data['error'] = "Datos Incompletos"
    return HttpResponse(json.dumps(data), content_type="application/json")


def get_detalle_productos(id):
    data = []
    try:
        for i in Detalle_venta.objects.filter(venta_id=id):
            iva_emp = Empresa.objects.get(pk=1)
            item = i.producto.toJSON()
            item['cantidad'] = i.cantidad
            item['iva_emp'] = format(iva_emp.iva, '.2f')
            data.append(item)
    except:
        pass
    return data


@csrf_exempt
def get_producto(request):
    data = {}
    try:
        id = request.POST['id']
        if id:
            producto = Producto.objects.filter(pk=id)
            iva_emp = Empresa.objects.get(pk=1)
            data = []
            for i in producto:
                item = i.toJSON()
                item['cantidad'] = 1
                item['subtotal'] = 0.00
                item['iva_emp'] = iva_emp.iva
                data.append(item)
        else:
            data['error'] = 'No ha selecionado ningun Producto'
    except Exception as e:
        data['error'] = 'Ha ocurrido un error'
    return JsonResponse(data, safe=False)


@csrf_exempt
def get_detalle(request):
    data = {}
    try:
        id = request.POST['id']
        if id:
            data = []

            for p in Detalle_venta.objects.filter(venta_id=id):
                data.append(p.toJSON())
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)


@csrf_exempt
def estado(request):
    data = {}
    try:
        id = request.POST['id']
        if id:
            with transaction.atomic():
                es = Venta.objects.get(id=id)
                es.estado = 0
                for i in Detalle_venta.objects.filter(venta_id=id):
                    ch = Producto.objects.get(pk=i.producto.pk)
                    ch.stock = int(ch.stock) + int(i.cantidad)
                    ch.save()
                    es.save()
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data)


@csrf_exempt
def eliminar(request):
    data = {}
    try:
        id = request.POST['id']
        if id:
            es = Venta.objects.get(id=id)
            es.delete()
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data)


@csrf_exempt
def grap(request):
    data = {}
    try:
        action = request.POST['action']
        if action == 'chart':
            data = {
                'dat': {
                    'name': 'Total de ventas',
                    'type': 'column',
                    'colorByPoint': True,
                    'showInLegend': True,
                    'data': grap_data(),
                },
                'year': datetime.now().year,
                'chart2': {
                    'data': dataChart2(),
                },
                'chart3': {
                    'compras': datachartcontr(),
                    'ventas': grap_data()
                }
            }
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)


def grap_data():
    year = datetime.now().year
    data = []
    for y in range(1, 13):
        total = Venta.objects.filter(fecha_venta__year=year, fecha_venta__month=y, estado=1).aggregate(
            r=Coalesce(Sum('total'), 0)).get('r')
        data.append(float(total))
    return data


def dataChart2():
    year = datetime.now().year
    month = datetime.now().month
    data = []
    producto = Producto.objects.all()
    for p in producto:
        total = Detalle_venta.objects.filter(venta__fecha_venta__year=year, venta__fecha_venta__month=month,
                                             producto_id=p).aggregate(r=Coalesce(Sum('venta__total'), 0)).get('r')
        data.append({
            'name': p.nombre,
            'y': float(total)
        })
    return data


def datachartcontr():
    year = datetime.now().year
    data = []
    for y in range(1, 13):
        totalc = Compra.objects.filter(fecha_compra__year=year, fecha_compra__month=y, estado=1).aggregate(
            r=Coalesce(Sum('total'), 0)).get('r')
        data.append(float(totalc))
    return data


class printpdf(View):

    def link_callback(self, uri, rel):
        """
        Convert HTML URIs to absolute system paths so xhtml2pdf can access those
        resources
        """
        result = finders.find(uri)
        if result:
            if not isinstance(result, (list, tuple)):
                result = [result]
            result = list(os.path.realpath(path) for path in result)
            path = result[0]
        else:
            sUrl = settings.STATIC_URL  # Typically /static/
            sRoot = settings.STATIC_ROOT  # Typically /home/userX/project_static/
            mUrl = settings.MEDIA_URL  # Typically /media/
            mRoot = settings.MEDIA_ROOT  # Typically /home/userX/project_static/media/

            if uri.startswith(mUrl):
                path = os.path.join(mRoot, uri.replace(mUrl, ""))
            elif uri.startswith(sUrl):
                path = os.path.join(sRoot, uri.replace(sUrl, ""))
            else:
                return uri

        # make sure that file exists
        if not os.path.isfile(path):
            raise Exception(
                'media URI must start with %s or %s' % (sUrl, mUrl)
            )
        return path

    def get(self, request, *args, **kwargs):
        try:
            template = get_template('front-end/report/pdf.html')
            context = {'title': 'Comprobante de Venta',
                       'sale': Venta.objects.get(pk=self.kwargs['pk']),
                       'empresa': Empresa.objects.get(id=1),
                       'icon': 'media/logo_don_chuta.png'
                       }
            html = template.render(context)

            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="report.pdf"'
            pisa_status = pisa.CreatePDF(html, dest=response, link_callback=self.link_callback)
            return response
        except:
            pass
        return HttpResponseRedirect(reverse_lazy('venta:lista'))
