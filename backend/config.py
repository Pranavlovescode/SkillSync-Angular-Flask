import os
from dotenv import load_dotenv

# Load environment variables correctly
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET')  # Use os.getenv()
    MONGODB_SETTINGS= {
        "host": os.getenv("MONGO_URI")  # Ensure MongoEngine uses the correct URI
    }  # Use os.getenv()
    SQLALCHEMY_TRACK_MODIFICATIONS = False


