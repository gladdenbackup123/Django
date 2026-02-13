from django.urls import path
from . import views

urlpatterns = [
    path('',views.home),
    path('students/',views.students_page),
    path('add/',views.add_student),
    path('delete/<int:id>',views.delete_student),
    path('edit/<int:id>',views.edit_student),
    path('login/',views.login_user)
]