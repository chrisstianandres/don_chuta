from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *
from django.http import HttpResponse, JsonResponse
from apps.cargo.forms import CargoForm
from apps.cargo.models import Cargo
from django.http import HttpResponseRedirect
import json
from django.db.models import Q

opc_icono = 'fa fa-folder-open'
opc_entidad = 'Cargos'
crud = '/cargo/crear'


def cargo_lista(request):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad,
        'boton': 'Nuevo Cargo', 'titulo': 'Listado de Cargos',
        'nuevo': '/cargo/nuevo'
    }
    list = Cargo.objects.all()
    data['list'] = list
    return render(request, "front-end/cargo/cargo_list.html", data)


def nuevo(request):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': crud,
        'boton': 'Guardar Cargo', 'action': 'add', 'titulo': 'Nuevo Registro de un Cargo',
    }
    if request.method == 'GET':
        data['form'] = CargoForm()
    return render(request, 'front-end/cargo/cargo_form.html', data)


def crear(request):
    f = CargoForm(request.POST)
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': crud,
        'boton': 'Guardar Cargo', 'action': 'add', 'titulo': 'Nuevo Registro de un Cargo'
    }
    action = request.POST['action']
    data['action'] = action
    if request.method == 'POST' and 'action' in request.POST:
        if action == 'add':
            f = CargoForm(request.POST)
            if f.is_valid():
                f.save()
            else:
                data['form'] = f
                return render(request, 'front-end/cargo/cargo_form.html', data)
            return HttpResponseRedirect('/cargo/lista')


def editar(request, id):
    cargo = Cargo.objects.get(id=id)
    crud = '/cargo/editar/' + str(id)
    data = {
        'icono': opc_icono, 'crud': crud, 'entidad': opc_entidad,
        'boton': 'Guardar Edicion', 'titulo': 'Editar Registro de un Cargo',
    }
    if request.method == 'GET':
        form = CargoForm(instance=cargo)
        data['form'] = form
    else:
        form = CargoForm(request.POST, instance=cargo)
        if form.is_valid():
            form.save()
        else:
            data['form'] = form
        return redirect('/cargo/lista')
    return render(request, 'front-end/cargo/cargo_form.html', data)


@csrf_exempt
def eliminar(request):
    data = {}
    try:
        id = request.POST['id']
        if id:
            ps = Cargo.objects.get(pk=id)
            ps.delete()
            data['resp'] = True
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = 'No se puede eliminar este cargo porque esta referenciado en otros procesos'
        data['content'] = 'Intenta con otro cargo'
    return JsonResponse(data)