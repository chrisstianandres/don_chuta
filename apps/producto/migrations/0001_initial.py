# Generated by Django 2.2.14 on 2020-09-05 18:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categoria', '0001_initial'),
        ('presentacion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=25)),
                ('stock', models.IntegerField(default=0)),
                ('descripcion', models.CharField(max_length=50)),
                ('pvp', models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=9, null=True)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='categoria.Categoria')),
                ('presentacion', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='presentacion.Presentacion')),
            ],
            options={
                'ordering': ['-id', '-nombre', '-categoria'],
                'verbose_name_plural': 'productos',
                'verbose_name': 'producto',
                'db_table': 'producto',
            },
        ),
    ]
