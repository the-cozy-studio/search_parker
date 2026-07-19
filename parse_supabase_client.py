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
            
            # Find usages of the supabase client 'km'
            # Let's search for km.from or km.channel or km.rpc
            # Let's look for km followed by a dot
            matches = [m.start() for m in re.finditer(r'\bkm\.', content)]
            print(f"Found usages of 'km.': {matches}")
            for m in matches:
                print(f"\nUsage at {m}:")
                print(content[m:m+300])
                
except Exception as e:
    print("Error:", e)
