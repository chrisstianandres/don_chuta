import json
from datetime import datetime, timedelta

from django.db import transaction
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.compra.forms import CompraForm, Detalle_CompraForm
from apps.compra.models import Compra, Detalle_compra
from apps.empresa.models import Empresa
from apps.producto.models import Producto
from datetime import date

opc_icono = 'fa fa-shopping-bag'
opc_entidad = 'Compras'
crud = '/compra/crear'


class lista(ListView):
    model = Compra
    template_name = 'front-end/compra/compra_list.html'

    def get_queryset(self):
        return Compra.objects.order_by('-id')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Nueva Compra'
        data['titulo'] = 'Listado de Compras'
        data['nuevo'] = '/compra/nuevo'
        return data


def nuevo(request):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': '../compra/get_producto',
        'boton': 'Guardar Compra', 'action': 'add', 'titulo': 'Nuevo Registro de una Compra',
        'key': ''
    }
    if request.method == 'GET':
        data['form'] = CompraForm()
        data['form2'] = Detalle_CompraForm()
        data['detalle'] = []
    return render(request, 'front-end/compra/compra_form.html', data)


@csrf_exempt
def crear(request):
    data = {}
    if request.method == 'POST':
        datos = json.loads(request.POST['compras'])
        if datos:
            with transaction.atomic():
                c = Compra()
                c.fecha_compra = datos['fecha_compra']
                c.proveedor_id = datos['proveedor']
                c.empleado_id = request.user.id
                c.subtotal = float(datos['subtotal'])
                c.iva = float(datos['iva'])
                c.total = float(datos['total'])
                c.save()
                for i in datos['productos']:
                    dv = Detalle_compra()
                    dv.compra_id = c.id
                    dv.producto_id = i['id']
                    dv.cantidad = int(i['cantidad'])
                    dv.save()
                    x = Producto.objects.get(pk=i['id'])
                    x.stock = x.stock + int(i['cantidad'])
                    x.save()
                    data['resp'] = True
        else:
            data['resp'] = False
            data['error'] = "Datos Incompletos"
    return HttpResponse(json.dumps(data), content_type="application/json")


def editar(request, id):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': '../../compra/get_producto',
        'boton': 'Editar Compra', 'action': 'edit', 'titulo': 'Editar Registro de una Compra',
        'key': id
    }
    compra = Compra.objects.get(id=id)
    if request.method == 'GET':
        data['form'] = CompraForm(instance=compra)
        data['form2'] = Detalle_CompraForm()
        data['detalle'] = json.dumps(get_detalle_productos(id))
    return render(request, 'front-end/compra/compra_form.html', data)


@csrf_exempt
def editar_save(request):
    data = {}
    datos = json.loads(request.POST['compras'])
    if request.POST['action'] == 'edit':
        with transaction.atomic():
            c = Compra.objects.get(pk=request.POST['key'])
            c.fecha_compra = datos['fecha_compra']
            c.proveedor_id = datos['proveedor']
            c.subtotal = float(datos['subtotal'])
            c.iva = float(datos['iva'])
            c.total = float(datos['total'])
            c.save()
            c.detalle_compra_set.all().delete()
            for i in datos['insumos']:
                dv = Detalle_compra()
                dv.compra_id = c.id
                dv.insumo_id = i['id']
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
        for i in Detalle_compra.objects.filter(compra_id=id):
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
            data['error'] = 'No ha selecionado ningun Insumo'
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
            for p in Detalle_compra.objects.filter(compra_id=id):
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
                es = Compra.objects.get(id=id)
                es.estado = 0
                for i in Detalle_compra.objects.filter(compra_id=id):
                    ch = Producto.objects.get(pk=i.producto.pk)
                    if ch.stock == 0:
                        data['error'] = 'No se puede devolver esta compra porque los productos ya fueron vendidos'
                        data['content'] = 'Prueba con otra venta'
                    else:
                        if ch.stock < i.cantidad:
                            data['error'] = 'No se puede devolver esta compra porque los productos ya fueron vendidos'
                            data['content'] = 'Prueba con otra venta'
                        else:
                            ch.stock = int(ch.stock) - int(i.cantidad)
                            es.save()
                            ch.save()
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
            es = Compra.objects.get(id=id)
            es.delete()
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data)


@csrf_exempt
def index(request):
    data = {}
    try:
        data = []
        h = datetime.today() - timedelta(days=datetime.today().isoweekday() % 7) - timedelta(days=6)
        for p in Detalle_compra.objects.filter(compra__fecha_compra__range=[h, h + timedelta(days=5)], compra__estado=1):
            data.append(p.toJSON())
    except Exception as e:
        data['error'] = str(e)
    return JsonResponse(data, safe=False)




