from django.urls import path
from . import views

urlpatterns = [
    path('',views.home),
    path('students/',views.students_page)
]