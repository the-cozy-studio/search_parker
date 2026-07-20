import urllib.request
import urllib.parse
import json
import re

# Fallback defaults
url = "https://ozoselvlkrnlalvehobf.supabase.co/rest/v1/rpc/get_search_cell_status_snapshot"
apikey = "sb_publishable_sd9ej6H1-2pGQP11l4vDAQ__JG0rWkr"

# Attempt to dynamically scrape the latest keys from searchparker.org
try:
    print("Fetching searchparker.org to extract live keys...")
    req_html = urllib.request.Request("https://searchparker.org", headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_html, timeout=10) as res_html:
        html = res_html.read().decode('utf-8')
        match = re.search(r'src="(/assets/index-[^"]+\.js)"', html)
        if match:
            js_url = "https://searchparker.org" + match.group(1)
            req_js = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req_js, timeout=10) as res_js:
                js_content = res_js.read().decode('utf-8')
                url_match = re.search(r'https://[a-zA-Z0-9_-]+\.supabase\.co', js_content)
                key_match = re.search(r'sb_publishable_[a-zA-Z0-9_-]+', js_content)
                
                if url_match and key_match:
                    extracted_url = url_match.group(0)
                    extracted_key = key_match.group(0)
                    url = f"{extracted_url}/rest/v1/rpc/get_search_cell_status_snapshot"
                    apikey = extracted_key
                    print(f"Successfully extracted dynamic keys! URL: {extracted_url}")
                else:
                    print("Could not find keys in JS bundle, using fallbacks.")
        else:
            print("Could not find JS bundle in HTML, using fallbacks.")
except Exception as e:
    print("Failed to scrape dynamic keys, using fallbacks. Error:", e)

import os
from datetime import datetime

headers = {
    'apikey': apikey,
    'Authorization': f'Bearer {apikey}',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

data = {
    "p_window_hours": 720
}

req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers=headers,
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        if response.status == 200:
            res_data = json.loads(response.read().decode('utf-8'))
            print(f"Received {len(res_data)} records from database.")
            
            import os
            from datetime import datetime, timezone
            
            os.makedirs('project/data', exist_ok=True)
            snapshot = {
                "sync_time": datetime.now(timezone.utc).isoformat(),
                "records": res_data
            }
            
            with open('project/data/search_coverage.json', 'w') as f:
                json.dump(snapshot, f, indent=2)
            print("Saved snapshot to project/data/search_coverage.json")
        else:
            print("Failed with status:", response.status)
except Exception as e:
    print("Error querying database:", e)

