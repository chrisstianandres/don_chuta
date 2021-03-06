# Generated by Django 2.2.14 on 2020-09-05 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Empresa',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20)),
                ('ciudad', models.CharField(max_length=25)),
                ('ruc', models.CharField(max_length=13, unique=True)),
                ('direccion', models.CharField(max_length=25)),
                ('telefono', models.CharField(max_length=10, unique=True)),
                ('correo', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('iva', models.DecimalField(decimal_places=2, default=0.12, max_digits=9)),
            ],
            options={
                'ordering': ['-nombre', '-ruc', '-direccion'],
                'verbose_name_plural': 'empresas',
                'verbose_name': 'empresa',
                'db_table': 'empresa',
            },
        ),
    ]
