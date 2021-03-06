# Generated by Django 2.2.14 on 2020-09-05 18:32

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('producto', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Compra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_compra', models.DateField(default=datetime.datetime.now)),
                ('subtotal', models.DecimalField(decimal_places=2, default=0.0, max_digits=9)),
                ('iva', models.DecimalField(decimal_places=2, default=0.0, max_digits=9)),
                ('total', models.DecimalField(decimal_places=2, default=0.0, max_digits=9)),
                ('estado', models.IntegerField(choices=[(0, 'DEVUELTA'), (1, 'FINALIZADA')], default=1)),
            ],
            options={
                'ordering': ['-id', 'proveedor'],
                'verbose_name_plural': 'compras',
                'verbose_name': 'compra',
                'db_table': 'compra',
            },
        ),
        migrations.CreateModel(
            name='Detalle_compra',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.IntegerField(default=1)),
                ('compra', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='compra.Compra')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='producto.Producto')),
            ],
            options={
                'ordering': ['id', 'compra'],
                'verbose_name_plural': 'detalles_compras',
                'verbose_name': 'detalle_compra',
                'db_table': 'detalle_compra',
            },
        ),
    ]
