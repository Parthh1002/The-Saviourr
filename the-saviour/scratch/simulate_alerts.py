import json
import time
import urllib.request
import urllib.parse

def trigger_simulation():
    url = "http://localhost:8000/api/v1/alerts/trigger"
    
    threats = [
        {
            "alert_type": "Human Intrusion Detected",
            "severity": "critical",
            "location": "Sector 4, North Gate",
            "description": "Armed individual identified by AI-NODE-04. Interception team alert level: RED."
        },
        {
            "alert_type": "Unauthorized Vehicle",
            "severity": "high",
            "location": "Restricted Zone B7",
            "description": "Unregistered 4x4 vehicle detected moving towards wildlife corridor."
        },
        {
            "alert_type": "Weapon Detection",
            "severity": "critical",
            "location": "Watering Hole A2",
            "description": "High-caliber hunting rifle identified in camera trap feed."
        }
    ]

    for threat in threats:
        print(f"Triggering threat: {threat['alert_type']}...")
        try:
            data = json.dumps(threat).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req) as response:
                if response.getcode() == 200:
                    res_data = json.loads(response.read().decode('utf-8'))
                    print("Successfully broadcasted!")
                    print(json.dumps(res_data, indent=2))
                else:
                    print(f"Failed with status: {response.getcode()}")
        except Exception as e:
            print(f"Error: {e}")
            print("Make sure the FastAPI backend is running on http://localhost:8000")
        
        time.sleep(5)

if __name__ == "__main__":
    trigger_simulation()
