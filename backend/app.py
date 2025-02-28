from flask import Flask
from config import Config
from routes.auth import auth
from routes.skillpost import skillpost
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_session import Session
from db import mongo_client as client

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

CORS(app,supports_credentials=True,origins=os.getenv('ORIGIN'))

app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True  # Prevents tampering
app.config["SESSION_MONGODB"] = client
app.config["SESSION_MONGODB_DB"] = "skill_sync_sessions"  # Database
app.config["SESSION_MONGODB_COLLECTION"] = "sessions"  # Collection
app.config["SESSION_COOKIE_SAMESITE"] = "None"  # Needed for cross-origin cookies
app.config["SESSION_COOKIE_SECURE"] = True  # Set to True in production with HTTPS
app.config["SESSION_COOKIE_HTTPONLY"] = True  # Prevents JavaScript access

Session(app)
# mongo_uri = os.getenv("MONGO_URI")


# #  Use Flask's MONGO_URI for MongoClient
# mongo_client = MongoClient(mongo_uri)
# db = mongo_client['skillsync-db']  # Use Atlas database

# user_collection = db['user']  # Use users collection
# skillpost_collection = db['skillposts']  # Use skillposts collection

# Check connection
# try:
#     mongo_client.admin.command('ping')
#     print("✅ Connected to MongoDB Atlas successfully!")
# except Exception as e:
#     print("❌ MongoDB connection failed:", e)

# Registering the blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(skillpost, url_prefix='/skillpost')

# Demo route for checking the server status
@app.route('/')                     
def hello_world():
    return 'Hello, World!'

# Run the app
if __name__ == '__main__':        
    app.run(debug=True, port=5001)