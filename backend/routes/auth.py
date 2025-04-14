from flask import Blueprint,session,make_response,Response
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import user_collection,skillpost_collection
from bson import ObjectId
from bson.json_util import dumps
import cloudinary.uploader
import cloudinary
import os,datetime

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


auth = Blueprint('auth', __name__)

@auth.route('/signup',methods=["POST"])
def signup():
    data = request.get_json()
    user = user_collection.find_one({"email": data['email']})
    print(user)
    if user:
        return make_response(jsonify({"message":"User already exists"}),400)
    
    

    hashed_password = generate_password_hash(data['password'])
    user = user_collection.insert_one({
        "email":data['email'],
        "password":hashed_password,
        "first_name":data['first_name'],
        "last_name":data['last_name'],
        "username":data['username'],
        "is_email_verified":False,  
        "profile_picture":"",
        "bio":"",
        "joined_on":datetime.datetime.now(),
    })
    session['user'] = data['email']
    print(session['user'])
    return make_response(jsonify({"message":"User created successfully"}),201)


@auth.route('/login',methods=["POST","GET"])
def login():
    data = request.get_json()
    user = user_collection.find_one({"email":data['email']})
    print(user)
    if not user or not check_password_hash(user['password'],data['password']):
        return jsonify({"message":"Invalid credentials"}),400
    session['user'] = user['email']
    print(session['user'])
    response = make_response(jsonify({"message":"Login successful"}),200)
    # response.set_cookie('SkillSyncSession',session['user'],max_age=60*60*24*7,secure=False,httponly=True,samesite='None')
    return response


@auth.route('/logout',methods=["POST"])
def logout():
    if session.get('user'):
        session.clear()
        return make_response(jsonify({"message":"Logged out successfully"}),200)
    else:
        return make_response(jsonify({"message":"User not logged in"}),400)
    


@auth.route('/get-user/<username>',methods=["GET"])
def get_user(username):
    if not username:
        return make_response(jsonify({"message":"Username not provided"}),400)
    if not session.get('user'):
        return make_response(jsonify({"message":"User not logged in"}),401)
    else:
        user = session.get('user')
        print(username)
        print(user)
        user_doc = user_collection.find_one({"username": username})
        user_posts = skillpost_collection.find({"user": user_doc["_id"], "is_deleted": False})
        
        # Add skillposts to user data
        user_doc["skillposts"] = list(user_posts)
        # Set profile editable to false for other users
        user_doc["profile_editable"] = False
        # Set profile editable to true for the logged-in user
        if user_doc["email"] == user:
            user_doc["profile_editable"] = True

        print(user_doc)
        if not user:
            return make_response(jsonify({"message":"User not found"}),404)
        
        return make_response(dumps(user_doc), 200)

@auth.route('/get-profile',methods=["GET"])
def get_user_profile():
    user = session.get('user')
    if not user:
        return make_response(jsonify({"message":"User not logged in"}),401)
    else:
        user_doc = user_collection.find_one({"email": user})
        if not user_doc:
            return make_response(jsonify({"message":"User not found"}), 404)
        
        # Find user's skillposts
        user_posts = skillpost_collection.find({"user": user_doc["_id"], "is_deleted": False})
        
        # Add skillposts to user data
        user_doc["skillposts"] = list(user_posts)
        
        return make_response(dumps(user_doc), 200)



@auth.route('/update-profile',methods=["PATCH"])
def update_profile():
    if not session.get('user'):
        return make_response(jsonify({"message":"User not logged in"}),401)
    else:
        data = request.form
        user = user_collection.find_one({"email":session['user']})
        if not user:
            return make_response(jsonify({"message":"User not found"}),404)
        print(user["_id"])
        image_url = None
        if request.files.get('profile_picture'):
            image_url = cloudinary.uploader.upload(request.files.get('profile_picture'),folder="SkillSync/user_profile")['secure_url']
        user_data = {
            "first_name":data['first_name'],
            "last_name":data['last_name'],
            "username":data['username'],
            "profile_picture":image_url or user["profile_picture"],
            "bio":data['bio'],
            "location":data['location'],
            "website":data['website'],
            "skills":request.form.getlist('skills')
        }
        user_collection.update_one(
            {"_id":ObjectId(user["_id"])},
            {"$set":user_data})
        return make_response(jsonify({"message":"Profile updated successfully"}),200)


@auth.route('/debug-session', methods=["GET"])
def debug_session():
    user = session.get('user')
    print("Request Cookies:", request.cookies)  # Debug cookies
    print("Session contents:", user)  # ✅ Check session data
    return f"Session data: {session.get('user', 'No session found')}"

@auth.route('/set-session', methods=["GET"])
def set_session():
    session['user'] = "test_user"
    
    return "Session set!"
