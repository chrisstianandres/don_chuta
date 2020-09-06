from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.db import models
from django.forms import model_to_dict

from Don_chuta.settings import MEDIA_URL, STATIC_URL
from apps.cargo.models import Cargo

SEXO = (
    (1, 'Masculino'),
    (0, 'Femenino'),
)

ESTADO = (
    (1, 'ACTIVO'),
    (0, 'INACTIVO'),
)


class Empleado(AbstractUser):
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, null=True, blank=True)
    avatar = models.ImageField(upload_to='empleado/%Y/%m/%d')  # )
    cedula = models.CharField(max_length=10, unique=True)
    telefono = models.CharField(max_length=10, unique=True)
    direccion = models.CharField(max_length=500, blank=True, null=True)
    sexo = models.IntegerField(choices=SEXO, default=1)
    estado = models.IntegerField(choices=ESTADO, default=0)

    def __str__(self):
        return '%s %s' % (self.username, self.first_name)

    def get_image(self):
        if self.avatar:
            return '{}{}'.format(MEDIA_URL, self.avatar)
        return '{}{}'.format(STATIC_URL, 'empleado/admin.png')

    def toJSON(self):
        item = model_to_dict(self)
        item['cargo'] = self.cargo.toJSON()
        item['avatar'] = self.avatar.path
        return item

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.set_password(self.password)
        else:
            user = Empleado.objects.get(pk=self.pk)
            if user.password != self.password:
                self.set_password(self.password)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'empleado'
        verbose_name = 'empleado'
        verbose_name_plural = 'empleados'
        ordering = ['-first_name', '-last_name', '-cedula']

