import urllib.request
import urllib.parse
import json

def geocode(address):
    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(address)}&format=json&limit=1"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                if data:
                    return {
                        'lat': float(data[0]['lat']),
                        'lon': float(data[0]['lon']),
                        'display_name': data[0]['display_name']
                    }
    except Exception as e:
        print(f"Error geocoding {address}: {e}")
    return None

if __name__ == "__main__":
    loc1 = "Connaught Drive NW, Calgary, AB"
    loc2 = "Travis Crescent NE, Calgary, AB"
    
    print("Geocoding", loc1)
    res1 = geocode(loc1)
    print(json.dumps(res1, indent=2))
    
    print("\nGeocoding", loc2)
    res2 = geocode(loc2)
    print(json.dumps(res2, indent=2))
