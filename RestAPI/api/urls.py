from django.urls import include, path
from . import views

urlpatterns = [
    path('',views.home, name='home'),
    path('api/hello/', views.hello_api, name='hello_api'),
    path('api/randomnumber/',views.randomnumber_api,name='random_number_api'),
    path('api/square/', views.square_number, name='square_number_api')
]
