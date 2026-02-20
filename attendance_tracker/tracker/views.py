from django.http import HttpResponse
from django.shortcuts import redirect, render

from tracker.forms import AttendanceForm

def home(request):
    return HttpResponse("Welcome to the Attendance Tracker!") 

def mark_attendance(request):
    if request.method == "POST":
        form = AttendanceForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('/attendance')
        else:
            form = AttendanceForm()

    return render(request,'mark_attendance.html',{'form':form})
