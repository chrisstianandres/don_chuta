from django.urls import path
from . import views
from apps.empleado.views import *
from django.contrib.auth.decorators import login_required

app_name = 'Empleados'

urlpatterns = [
    path('lista', login_required(lista.as_view()), name='lista'),
    path('nuevo', login_required(views.nuevo), name='nuevo'),
    path('crear', login_required(views.crear), name='crear'),
    path('estado', login_required(views.estado), name='estado'),
    path('editar/<int:id>', login_required(views.editar), name='editar'),
    path('data', login_required(views.data), name='data'),
    path('profile', login_required(views.profile), name='profile'),

]
