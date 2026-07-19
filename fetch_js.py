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
            
            # Print all URLs in the JS file
            urls = re.findall(r'https?://[^\s"\']+', content)
            print("All URLs found in JS:")
            for u in sorted(list(set(urls))):
                print("-", u)
                
except Exception as e:
    print("Error:", e)
