from django.shortcuts import render
from django.http import HttpResponse
from .models import Student

# Create your views here.
# def home(request):
#     return HttpResponse("Welcome to Students Portal!")

def home(request):
    data = {
        'title' : 'Python Full Stack Development',
        'instructor' : 'Gladden'
    }
    return render(request,'home.html',data)

def students_page(request):
    # students = Student.objects.all()
    # students = Student.objects.order_by('marks')
    # students = Student.objects.order_by('marks')
    students = Student.objects.filter(marks__gt = 80)
    return render(request,'students.html',{'students':students})