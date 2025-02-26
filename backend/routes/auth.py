from flask import Blueprint
from models.users import User
from flask_login import login_user, logout_user, login_required,current_user
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/signup',methods=["POST"])
def signup():
    data = request.get_json()
    user = User.objects(email=data['email']).first()
    print(user)
    if user:
        return jsonify({"message":"User already exists"}),400
    
    hashed_password = generate_password_hash(data['password'])
    user = User(
        email=data['email'],
        password=hashed_password,
        first_name=data['first_name'],
        last_name=data['last_name'],
        username=data['username']
    )
    user.save()
    return jsonify({"message":"User created successfully"}),201


@auth.route('/login',methods=["POST","GET"])
def login():
    data = request.get_json()
    user = User.objects(email=data['email']).first()
    if not user or not check_password_hash(user.password,data['password']):
        return jsonify({"message":"Invalid credentials"}),400
    login_user(user)
    return jsonify({"message":"Login successful"}),200


@auth.route('/logout',methods=["POST","GET"])
@login_required
def logout():
    if current_user.is_authenticated:
        logout_user()
        return jsonify({"message":"Logged out successfully"}),200
    if not current_user:
        return jsonify({"message":"User not logged in"}),400
    
