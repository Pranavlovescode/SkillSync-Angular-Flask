from flask import Flask
from config import Config
from models import db
from models.users import User
from flask_login import LoginManager
from routes.auth import auth
from routes.skillpost import skillpost
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app)


app.config["MONGO_URI"] = os.getenv("MONGO_URI")


#  Use Flask's MONGO_URI for MongoClient
mongo_client = MongoClient(app.config['MONGO_URI'])
db = mongo_client['skillsync-db']  # Use Atlas database


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(skillpost, url_prefix='/skillpost')

@app.route('/')                     
def hello_world():
    return 'Hello, World!'


@login_manager.user_loader
def load_user(user_id):
    return User.objects.get(id=user_id)

if __name__ == '__main__':
    with app.app_context():
        try:
            # client = MongoClient(app.config['MONGO_URI'])
            # client.admin.command("ping")
            mongo_client.admin.command("ping")
            print("✅ Connected to MongoDB Atlas successfully!")
        except Exception as e:
            print("❌ Failed to connect to MongoDB Atlas:", e)
    app.run(debug=True, port=8001)