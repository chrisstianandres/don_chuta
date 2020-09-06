from django.db import models


class Empresa(models.Model):
    nombre = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=25)
    ruc = models.CharField(max_length=13, unique=True)
    direccion = models.CharField(max_length=25)
    telefono = models.CharField(max_length=10, unique=True)
    correo = models.CharField(max_length=50, null=True, blank=True, unique=True)
    iva = models.DecimalField(default=0.12, max_digits=9, decimal_places=2)

    def __str__(self):
        return '%s %s' % (self.nombre, self.ruc)

    class Meta:
        db_table = 'empresa'
        verbose_name = 'empresa'
        verbose_name_plural = 'empresas'
        ordering = ['-nombre', '-ruc', '-direccion']
