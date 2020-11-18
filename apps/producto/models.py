from django.db import models
from django.forms import model_to_dict

from apps.categoria.models import Categoria
from apps.presentacion.models import Presentacion


class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT)
    presentacion = models.ForeignKey(Presentacion, on_delete=models.PROTECT, null=True, blank=True)
    nombre = models.CharField(max_length=50)
    stock = models.IntegerField(default=0)
    descripcion = models.CharField(max_length=50)
    pcp = models.DecimalField(default=0.00, max_digits=9, decimal_places=2, null=True, blank=True)
    pvp = models.DecimalField(default=0.00, max_digits=9, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return '%s' % self.nombre

    def _pcp(self):
        pcp = float(self.pcp) / float(1.12)
        print(pcp)
        return format(pcp, '.2f')
    pcp_cal = property(_pcp)

    def toJSON(self):
        item = model_to_dict(self)
        item['categoria'] = self.categoria.toJSON()
        item['presentacion'] = self.presentacion.toJSON()
        item['pvp'] = format(self.pvp, '.2f')
        item['pcp'] = format(float(self.pcp_cal), '.2f')
        return item


    class Meta:
        db_table = 'producto'
        verbose_name = 'producto'
        verbose_name_plural = 'productos'
        ordering = ['-id', '-nombre', '-categoria']