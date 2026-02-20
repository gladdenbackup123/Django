from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
import random

# Create your views here.
@api_view(['GET'])
def hello_api(request):
    data = {
        'message': 'Hello, World!',
        'status': 'success'
    }
    return JsonResponse(data)

@api_view(['GET'])
def randomnumber_api(request):
   
    data = {
        'random_number': random.randint(1, 100)
    }
    return JsonResponse(data)

def home(request):
    return HttpResponse("Welcome to the Home Page!")

@api_view(['POST']) 
def square_number(request):
    num = request.data.get('number')

    square = int(num) * int(num)
    return JsonResponse({'square': square})