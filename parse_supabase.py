import urllib.request
import re

url = "https://searchparker.org/assets/index-h5MKr8xS.js"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            content = response.read().decode('utf-8')
            
            # Find where V0 (the API key) or p_ (the URL) are used
            # We want to see how supabase is initialized and what queries it runs
            # Let's search for 'createClient' or similar
            matches = [m.start() for m in re.finditer(r'createClient', content)]
            print(f"Found createClient at positions: {matches}")
            for m in matches:
                print(content[m:m+200])
                
            # Search for table queries
            # Supabase JS queries look like: .from("...") or from("...")
            # Let's search for '.from'
            from_matches = [m.start() for m in re.finditer(r'\.from', content)]
            print(f"\nFound '.from' at positions: {from_matches}")
            for m in from_matches[:10]:
                print(f"Position {m}:", content[m:m+150])
                
except Exception as e:
    print("Error:", e)
