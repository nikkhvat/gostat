import json

with open('./docs/doc.json', 'r') as file:
    data = json.load(file)

bearer_auth = {
    "type": "http",
    "scheme": "bearer",
    "bearerFormat": "JWT"
}

data['components']['securitySchemes'] = {
    "BearerAuth": bearer_auth
}

with open('./docs/doc.json', 'w') as file:
    json.dump(data, file, indent=4)

print("✅ Successful updated file")
