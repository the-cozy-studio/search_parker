import urllib.request
import urllib.parse
import json

url = "https://ozoselvlkrnlalvehobf.supabase.co/rest/v1/rpc/get_search_cell_status_snapshot"
headers = {
    'apikey': 'sb_publishable_sd9ej6H1-2pGQP11l4vDAQ__JG0rWkr',
    'Authorization': 'Bearer sb_publishable_sd9ej6H1-2pGQP11l4vDAQ__JG0rWkr',
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
            from datetime import datetime
            
            os.makedirs('project/data', exist_ok=True)
            snapshot = {
                "sync_time": datetime.now().isoformat(),
                "records": res_data
            }
            
            with open('project/data/search_coverage.json', 'w') as f:
                json.dump(snapshot, f, indent=2)
            print("Saved snapshot to project/data/search_coverage.json")
        else:
            print("Failed with status:", response.status)
except Exception as e:
    print("Error querying database:", e)
