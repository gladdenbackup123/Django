from django.shortcuts import render,redirect
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
    students = Student.objects.all()
    # students = Student.objects.order_by('marks')
    # students = Student.objects.order_by('marks')
    # students = Student.objects.filter(marks__gt = 80)
    return render(request,'students.html',{'students':students})

def add_student(request):
    if request.method == "POST":
        name = request.POST.get('name')
        age = request.POST.get('age')
        course = request.POST.get('course')
        marks = request.POST.get('marks')

        if int(marks) > 100:
            return render(request,'add_student.html',{
                'error':'Marks cannot be greater than 100'
            })

        Student.objects.create(
            name=name,
            age=age,
            course=course,
            marks=marks
        )

        return redirect('/students/')

    return render(request,'add_student.html')

def delete_student(request,id):
    student = Student.objects.get(id=id)
    student.delete()
    return redirect('/students/')

def edit_student(request,id):
    student = Student.objects.get(id=id)

    if request.method=="POST":
        name = request.POST.get('name')
        age = request.POST.get('age')
        course = request.POST.get('course')
        marks = request.POST.get('marks')

        student.save()

        return redirect('/students/')

    return render(request,'edit_student.html',{'student':student})