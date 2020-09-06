"""Don_chuta URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf.urls import url, include
from django.urls import path
from apps import backEnd as backEnd
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # sistema
    path('', backEnd.menu, name='menu'),
    path('empresa/', include('apps.empresa.urls', namespace='empresa')),
    path('cliente/', include('apps.cliente.urls', namespace='cliente')),
    path('cargo/', include('apps.cargo.urls', namespace='cargo')),
    path('proveedor/', include('apps.proveedor.urls', namespace='proveedor')),
    path('producto/', include('apps.producto.urls', namespace='producto')),
    path('presentacion/', include('apps.presentacion.urls', namespace='presentacion')),
    path('categoria/', include('apps.categoria.urls', namespace='categoria')),
    path('empleado/', include('apps.empleado.urls', namespace='empleado')),
    path('compra/', include('apps.compra.urls', namespace='compra')),
    path('venta/', include('apps.venta.urls', namespace='venta')),
    # path('empleado/', include('apps.empleado.urls', namespace='empleado')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
#     urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#