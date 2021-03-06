from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import *

from apps.Mixins import SuperUserRequiredMixin
from apps.categoria.forms import CategoriaForm
from apps.categoria.models import Categoria

opc_icono = 'fas fa-boxes'
opc_entidad = 'Categoria'
crud = '/categoria/crear'


class lista(SuperUserRequiredMixin, ListView):
    model = Categoria
    template_name = 'front-end/categoria/categoria_list.html'

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        data['icono'] = opc_icono
        data['entidad'] = opc_entidad
        data['boton'] = 'Nueva Categoria'
        data['titulo'] = 'Listado de Categorias'
        data['nuevo'] = '/categoria/nuevo'
        return data


def nuevo(request):
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': crud,
        'boton': 'Guardar Categoria', 'action': 'add', 'titulo': 'Nuevo Registro de una Categoria',
    }
    if request.method == 'GET':
        data['form'] = CategoriaForm()
    return render(request, 'front-end/categoria/categoria_form.html', data)


def crear(request):
    f = CategoriaForm(request.POST)
    data = {
        'icono': opc_icono, 'entidad': opc_entidad, 'crud': crud,
        'boton': 'Guardar Categoria', 'action': 'add', 'titulo': 'Nuevo Registro de una Categoria'
    }
    action = request.POST['action']
    data['action'] = action
    if request.method == 'POST' and 'action' in request.POST:
        if action == 'add':
            f = CategoriaForm(request.POST)
            if f.is_valid():
                f.save()
            else:
                data['form'] = f
                return render(request, 'front-end/categoria/categoria_form.html', data)
            return HttpResponseRedirect('/categoria/lista')


def editar(request, id):
    categoria = Categoria.objects.get(id=id)
    crud = '/categoria/editar/' + str(id)
    data = {
        'icono': opc_icono, 'crud': crud, 'entidad': opc_entidad,
        'boton': 'Guardar Edicion', 'titulo': 'Editar Registro de una Categoria',
    }
    if request.method == 'GET':
        form = CategoriaForm(instance=categoria)
        data['form'] = form
    else:
        form = CategoriaForm(request.POST, instance=categoria)
        if form.is_valid():
            form.save()
        else:
            data['form'] = form
        return redirect('/categoria/lista')
    return render(request, 'front-end/categoria/categoria_form.html', data)


@csrf_exempt
def eliminar(request):
    data = {}
    try:
        id = request.POST['id']
        if id:
            ps = Categoria.objects.get(pk=id)
            ps.delete()
            data['resp'] = True
        else:
            data['error'] = 'Ha ocurrido un error'
    except Exception as e:
        data['error'] = "!No se puede eliminar esta categoria porque esta referenciado en otros procesos!!"
        data['content'] = "Intenta con otra categoria"
    return JsonResponse(data)


