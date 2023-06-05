import requests
import json
with open('ttdk_result.json') as json_file:
    json_data = json.load(json_file)

headers = {'Accept' : 'application/json', 'Content-Type' : 'application/json'} #'Authorization' : ‘(some auth code)’, 

r = requests.post('http://localhost:3500/cucDangKiem/admin/center/upload', data=json.dumps(json_data), headers=headers)