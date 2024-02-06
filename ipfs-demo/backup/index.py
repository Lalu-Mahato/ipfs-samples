import requests

projectId = "abc123"
projectSecret = "abc123"
endpoint = "https://ipfs.infura.io:5001"

files = {
    'file': 'images.jpeg'
}

response = requests.post(endpoint + '/api/v0/add', files=files, auth=(projectId, projectSecret))
print(response)

print(response.text.split(",")[1].split(":")[1].replace('"',''))