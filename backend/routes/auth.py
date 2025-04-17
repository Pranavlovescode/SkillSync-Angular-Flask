from flask import Blueprint,session,make_response,Response
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import user_collection,skillpost_collection
from bson import ObjectId
from bson.json_util import dumps
import cloudinary.uploader
import cloudinary
import os,datetime
from itsdangerous import URLSafeTimedSerializer  # For generating signed tokens
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


auth = Blueprint('auth', __name__)

# Add these below your cloudinary configuration
# Token serializer for email verification
serializer = URLSafeTimedSerializer(os.getenv('SECRET_KEY', 'your-secret-key'))

# Email configuration
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USERNAME = 'apikey'
EMAIL_PASSWORD = os.environ.get('SENDGRID_API_KEY')
EMAIL_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
FRONTEND_URL = os.environ.get('ORIGIN')

def generate_verification_token(email):
    """Generate a verification token for email confirmation"""
    return serializer.dumps(email, salt='email-verification')

def verify_token(token, expiration=3600):
    """Verify the token and return the email if valid"""
    try:
        email = serializer.loads(token, salt='email-verification', max_age=expiration)
        return email
    except:
        return None

def send_verification_email(email, token):
    """Send verification email to the user"""
    verification_url = f"{FRONTEND_URL}/auth/verify-email/{token}"
    
    # Create email message
    msg = MIMEMultipart()
    msg['From'] = EMAIL_SENDER
    msg['To'] = email
    msg['Subject'] = "SkillSync - Verify Your Email Address"
    
    # Email body
    body = f"""
    <html>
    <body>
        <h2>Welcome to SkillSync!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p><a href="{verification_url}">{verification_url}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't register for SkillSync, please ignore this email.</p>
        <p>Best regards,<br>The SkillSync Team</p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        # Connect to SMTP server
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        
        # Send email
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send verification email: {str(e)}")
        return False



@auth.route('/signup',methods=["POST"])
def signup():
    data = request.get_json()
    user = user_collection.find_one({"email": data['email']})
    print(user)
    if user:
        return make_response(jsonify({"message":"User already exists"}),400)
    
    token = generate_verification_token(data['email'])

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
        "verification_token":token,
    })

    email_sent = send_verification_email(data['email'], token)

    if email_sent:
            session['user'] = data['email']
            session['email_verified'] = False
            return make_response(jsonify({
                "message": "User created successfully. Please verify your email.",
                "email_verified": False
            }), 201)
    else:
            return make_response(jsonify({
                "message": "User created successfully but verification email could not be sent. Please try again later.",
                "email_verified": False
            }), 201)



@auth.route('/resend-verification', methods=["POST"])
def resend_verification():
    if not session.get('user'):
        return make_response(jsonify({"message":"User not logged in"}), 401)
    
    email = session['user']
    user = user_collection.find_one({"email": email})
    
    if not user:
        return make_response(jsonify({"message":"User not found"}), 404)
    
    if user["is_email_verified"]:
        return make_response(jsonify({"message":"Email already verified"}), 400)
    
    # Generate new verification token
    token = generate_verification_token(email)
    
    # Update user with new token
    user_collection.update_one(
        {"email": email},
        {"$set": {
            "verification_token": token,
            "token_created_at": datetime.datetime.now()
        }}
    )
    
    # Send verification email
    email_sent = send_verification_email(email, token)
    
    if email_sent:
        return make_response(jsonify({"message":"Verification email sent successfully"}), 200)
    else:
        return make_response(jsonify({"message":"Failed to send verification email"}), 500)




# Email verification route
@auth.route('/verify-email/<token>', methods=["GET"])
def verify_email(token):
    email = verify_token(token)
    
    if not email:
        return make_response(jsonify({
            "message": "Invalid or expired verification link",
            "verified": False
        }), 400)
    
    # Find user and verify email
    user = user_collection.find_one({"email": email})
    
    if not user:
        return make_response(jsonify({
            "message": "User not found",
            "verified": False
        }), 404)
    
    if user.get("is_email_verified"):
        return make_response(jsonify({
            "message": "Email already verified",
            "verified": True
        }), 200)
    
    # Update user verification status
    user_collection.update_one(
        {"email": email},
        {"$set": {
            "is_email_verified": True,
            "verification_token": None,
        }}
    )
    
    # Update session if active
    if session.get('user') == email:
        session['email_verified'] = True
    
    return make_response(jsonify({
        "message": "Email verified successfully",
        "verified": True
    }), 200)



# Check email verification status
@auth.route('/verification-status', methods=["GET"])
def verification_status():
    if not session.get('user'):
        return make_response(jsonify({
            "message": "User not logged in",
            "email_verified": False,
            "authenticated": False
        }), 401)
    
    user = user_collection.find_one({"email": session['user']})
    
    if not user:
        return make_response(jsonify({
            "message": "User not found",
            "email_verified": False,
            "authenticated": False
        }), 404)
    
    return make_response(jsonify({
        "message": "Verification status retrieved",
        "email_verified": user.get("is_email_verified", False),
        "authenticated": True
    }), 200)



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
