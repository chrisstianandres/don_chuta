from django import forms
from datetime import *
from django.forms import TextInput, EmailInput, FileInput

from .models import Empleado


class EmpleadoForm(forms.ModelForm):
    # constructor
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        this_year = datetime.now().year
        years = range(this_year - 15, this_year - 3)
        for field in self.Meta.fields:
            # self.fields[field].widget.attrs.update({
            #     'class': 'form-control'
            # })

            self.fields['first_name'].widget = TextInput(
                attrs={'placeholder': 'Ingrese sus dos nombres', 'class': 'form-control form-rounded'})
            self.fields['last_name'].widget = TextInput(
                attrs={'placeholder': 'Ingrese sus dos Apellidos', 'class': 'form-control form-rounded'})
            self.fields['cedula'].widget = TextInput(
                attrs={'placeholder': 'Ingrese numero de cedula', 'class': 'form-control form-rounded'})
            self.fields['email'].widget = EmailInput(
                attrs={'placeholder': 'abc@correo.com', 'class': 'form-control form-rounded'})
            self.fields['direccion'].widget = TextInput(
                attrs={'placeholder': 'Ingresa una direccion', 'class': 'form-control form-rounded'})
            self.fields['telefono'].widget = TextInput(
                attrs={'placeholder': 'Ingresa un numero de celular', 'class': 'form-control form-rounded'})
            self.fields['username'].widget = TextInput(
                attrs={'placeholder': 'Ingresa un nombre de usuario', 'class': 'form-control form-rounded'})
            self.fields['sexo'].widget.attrs = {
                'class': 'form-control select2'
            }
            self.fields['cargo'].widget.attrs = {
                'class': 'form-control select2'
            }
            # self.fields["fecha_nacimiento"].widget = SelectDateWidget(years=years,
            #                                                         attrs={'class': 'selectpicker'})
        # habilitar, desabilitar, y mas

    class Meta:
        model = Empleado
        fields = ['username',
                  'first_name',
                  'last_name',
                  'cedula',
                  'email',
                  'avatar',
                  'sexo',
                  'telefono',
                  'direccion',
                  'cargo',
                  'password',
                  ]
        labels = {
            'username': 'Nombre de Usuario',
            'first_name': 'Nombres',
            'last_name': 'Apellidos',
            'cedula': 'N° de cedula',
            'email': 'Correo',
            'avatar': 'Imagen',
            'sexo': 'Genero',
            'telefono': 'Telefono',
            'direccion': 'Direccion',
            'cargo': 'Cargo',
            'password': 'Contraseña',

        }
        widgets = {
            'username': forms.TextInput(),
            'first_name': forms.TextInput(),
            'last_name': forms.TextInput(),
            'cedula': forms.TextInput(),
            'sexo': forms.Select(),
            'correo': forms.EmailInput(),
            'telefono': forms.TextInput(),
            'direccion': forms.Textarea(),
            'cargo': forms.Select(),
            'password': forms.PasswordInput(attrs={'class': 'form-control'}, render_value=True)
        }

    # def clean_avatar(self, *args, **kwargs):
    #     cleaned_data = super(EmpleadoForm, self).clean()
    #     avatar = cleaned_data.get('avatar', None).file
    #     if avatar is not None:
    #         print(avatar)


