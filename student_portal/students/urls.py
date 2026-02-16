from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('',views.home),
    path('students/',views.students_page),
    path('add/',views.add_student),
    path('delete/<int:id>',views.delete_student),
    path('edit/<int:id>',views.edit_student),
    path('login/',views.login_user),
    path('logout/',views.logout_user),
    path('register',views.register_user),
    path('change_password/',views.change_password),
    
    path('reset_password/', auth_views.PasswordResetView.as_view(template_name='password_reset.html'), name='password_reset'),
    path('reset_password_done/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'), name='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'), name='password_reset_complete'),
]