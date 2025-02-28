from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(MONGO_URI)

# Reference the database
db = mongo_client['skillsync-db']

# Collections
user_collection = db['user']
skillpost_collection = db['skillposts']

print("✅ Connected to MongoDB Atlas successfully!")
