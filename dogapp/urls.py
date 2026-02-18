from . import views
from django.urls import include, path

urlpatterns = [
    path('',views.random_dog_img, name='random_dog_img'),
]