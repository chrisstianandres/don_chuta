# Generated by Django 2.2.14 on 2020-09-05 18:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('proveedor', '0001_initial'),
        ('compra', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='compra',
            name='empleado',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='compra',
            name='proveedor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='proveedor.Proveedor'),
        ),
    ]