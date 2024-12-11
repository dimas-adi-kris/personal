import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('py/program-db-334c5-firebase-adminsdk-4eftl-39583ba9f8.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()
users_ref = db.collection("users")
docs = users_ref.stream()

for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")

# personal-py@personal-444404.iam.gserviceaccount.com