from django.urls import include, path
from . import views

urlpatterns = [
    path('',views.weather_view, name='weather'),
]