from django.shortcuts import render
import requests

def random_joke(request):
    url = 'https://official-joke-api.appspot.com/random_joke'
    response = requests.get(url)
    joke = response.json()

    setup = joke['setup']
    punchline = joke['punchline']

    return render(request, 'joke.html', {'setup': setup, 'punchline': punchline})


