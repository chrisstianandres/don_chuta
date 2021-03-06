# -*- coding: utf-8 -*-
from django.shortcuts import render, HttpResponseRedirect
from django.contrib.auth import *
from django.http import HttpResponse
from django.http import *
from django.urls import reverse_lazy

from django.views.generic import FormView
from django.contrib.auth.mixins import LoginRequiredMixin, AccessMixin
import json
from django.views.decorators.csrf import csrf_exempt


# -----------------------------------------------PAGINA PRINCIPAL-----------------------------------------------------#


def menu(request):
    data = {
        'titulo': 'Menu Principal'
    }
    return render(request, 'front-end/index.html', data)


# -----------------------------------------------LOGEO----------------------------------------------------------------#

def logeo(request):
    data = {}
    if not request.user.is_authenticated:
        data['titulo'] = 'Inicio de Sesion'
    else:
        return HttpResponseRedirect("/")
    return render(request, 'front-end/login.html', data)


@csrf_exempt
def connect(request):
    data = {}
    if request.method == 'POST' or None:
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            data['resp'] = True
        else:
            data['error'] = '<strong>Usuario no valido </strong><br>' \
                            'Verifica las credenciales de acceso y vuelve a intentarlo.'
    else:
        data['error'] = 'Metodo Request no es Valido.'
    return HttpResponse(json.dumps(data), content_type="application/json")


def disconnect(request):
    logout(request)
    return HttpResponseRedirect('/login')
