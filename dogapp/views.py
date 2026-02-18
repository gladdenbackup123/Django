from django.shortcuts import render
import requests

# Create your views here.
def random_dog_img(request):
    url = "https://dog.ceo/api/breeds/image/random"
    response = requests.get(url)
    data = response.json()
    url = data['message']
    return render(request, 'random_dog.html', {'url': url})