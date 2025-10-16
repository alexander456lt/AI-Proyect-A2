import os

api_key = os.getenv('GOOGLE_API_KEY')
if api_key:
    print(f" API key configurada: {api_key[:10]}...")
else:
    print(" API key no configurada. Configúrala con: setx GOOGLE_API_KEY AIzaSyA0KCl9kBTv7tBFZ2kiid6VHy5HnXrItw0")

"""
API KEY = AIzaSyA0KCl9kBTv7tBFZ2kiid6VHy5HnXrItw0
API Numero del proyecto = 366862455165

==Start==
- 1.setx GOOGLE_API_KEY AIzaSyA0KCl9kBTv7tBFZ2kiid6VHy5HnXrItw0
- 2.echo %GOOGLE_API_KEY%
- 3.python A2/check_api.py
"""
