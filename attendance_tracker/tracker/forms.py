from django import forms
from .models import Attendace

class AttendanceForm(forms.ModelForm):
    class Meta:
        model = Attendace
        fields = ['name','regid','date','status']
    