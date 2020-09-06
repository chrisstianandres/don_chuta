from django.db import models
from django.forms import model_to_dict


class Cargo(models.Model):
    nombre = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return '%s %s' % (self.nombre, self.descripcion)

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'cargo'
        verbose_name = 'cargo'
        verbose_name_plural = 'cargos'
        ordering = ['-nombre', '-descripcion']
