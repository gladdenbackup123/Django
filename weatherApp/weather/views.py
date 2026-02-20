from django.shortcuts import render
import requests
# Create your views here.

def weather_view(request):
    if request.method == 'POST':
        city = request.POST.get('city')
        api_key = '85897e25d3ada08f45f565b36dba0a4e'  # Replace with your OpenWeatherMap API key
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
        response = requests.get(url)

        data = response.json()

        if data.get('cod') == 200:
            weather = {
                'city': data['name'],
                'temperature': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'description': data['weather'][0]['description'],

            }
            return render(request, 'weather.html', {'weather': weather})
        else:       
            error_message = data.get('message', 'An error occurred.')
            return render(request, 'weather.html', {'error': error_message})

    return render(request, 'weather.html')



