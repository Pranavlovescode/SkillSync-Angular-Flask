from flask import Flask
import json
from config import Config
from routes.auth import auth
from routes.skillpost import skillpost
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_cors import CORS
from flask_session import Session
from db import mongo_client as client
from datetime import timedelta
from bson import ObjectId

# Custom JSON encoder to handle MongoDB ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Set custom JSON encoder for the app
app.json_encoder = MongoJSONEncoder

CORS(app,supports_credentials=True,origins=[os.getenv('ORIGIN')])

# For development environment
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_MONGODB"] = client
app.config["SESSION_MONGODB_DB"] = "skill_sync_sessions"
app.config["SESSION_MONGODB_COLLECTION"] = "sessions"

# Cookie settings - development friendly
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"  # For cross-site requests
app.config["SESSION_COOKIE_SECURE"] = True     # Required when SameSite is "None"
app.config["SESSION_COOKIE_NAME"] = "SkillSyncSession"  # Custom session cookie name
app.config["SESSION_COOKIE_PATH"] = "/"
app.config["SESSION_COOKIE_DOMAIN"] = '.pranavtitambe.in'  # None restricts to current host
# Or for a specific domain:
# app.config["SESSION_COOKIE_DOMAIN"] = ".pranavtitambe.in"  # Include subdomain


# Session lifetime
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)

Session(app)

# Registering the blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(skillpost, url_prefix='/skillpost')

# Demo route for checking the server status
@app.route('/')                     
def hello_world():
    return 'Hello, World!'

# Run the app
if __name__ == '__main__':        
    app.run(debug=True,port=5001)