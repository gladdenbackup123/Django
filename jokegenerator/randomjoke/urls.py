from . import views
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('',views.random_joke, name='random_joke'),
]