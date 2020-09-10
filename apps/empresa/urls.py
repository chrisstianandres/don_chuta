from django.conf.urls import url
from django.urls import path
from . import views
from apps.empresa.views import Configuracion
from django.contrib.auth.decorators import login_required
app_name = 'Empresa'

urlpatterns = [
    path('configuracion/', login_required(Configuracion.as_view()), name='editar'),

]
