from flask import Blueprint,session,make_response,Response
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import user_collection
from bson import ObjectId
from bson.json_util import dumps

auth = Blueprint('auth', __name__)

@auth.route('/signup',methods=["POST"])
def signup():
    data = request.get_json()
    user = user_collection.find_one({"email": data['email']})
    print(user)
    if user:
        return jsonify({"message":"User already exists"}),400
    
    hashed_password = generate_password_hash(data['password'])
    user = user_collection.insert_one({
        "email":data['email'],
        "password":hashed_password,
        "first_name":data['first_name'],
        "last_name":data['last_name'],
        "username":data['username'],
        "is_email_verified":False   
    })
    session['user'] = user.email
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


@auth.route('/logout',methods=["POST","GET"])
def logout():
    if session.get('user'):
        session.clear()
        return make_response(jsonify({"message":"Logged out successfully"}),200)
    else:
        return make_response(jsonify({"message":"User not logged in"}),400)
    


@auth.route('/get-user/<id>',methods=["GET"])
def get_user(id):
    user = user_collection.find_one({"_id": ObjectId(id)})
    print(user)
    if not user:
        return make_response(jsonify({"message":"User not found"}),404)
    return make_response(dumps(user),200)


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
