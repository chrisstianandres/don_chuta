from django.conf.urls import url
from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required
app_name = 'Empresa'

urlpatterns = [
    # path('lista', login_required(lista.as_view()), name='lista'),
    # path('nuevo', login_required(views.nuevo), name='nuevo'),
    # path('crear', login_required(views.crear), name='crear'),
    path('configuracion/', login_required(views.editar), name='editar'),

]
