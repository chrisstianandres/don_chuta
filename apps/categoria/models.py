from django.db import models
from django.forms import model_to_dict


class Categoria(models.Model):
    nombre = models.CharField(max_length=25)
    descripcion = models.CharField(max_length=50)

    def __str__(self):
        return '%s %s %s' % (self.id, self.nombre, self.descripcion)

    def toJSON(self):
        item = model_to_dict(self)
        return item

    class Meta:
        db_table = 'categoria'
        verbose_name = 'categoria'
        verbose_name_plural = 'categorias'
        ordering = ['-id', '-nombre', '-descripcion']