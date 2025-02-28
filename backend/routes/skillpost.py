from flask import request, jsonify, Blueprint, make_response, session
import datetime
import cloudinary.uploader
import cloudinary
import os
from db import skillpost_collection, user_collection


# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

skillpost = Blueprint('skillpost', __name__)

@skillpost.route('/create', methods=["POST"])
def create_skillpost():
    if not session.get('user'):
        print("User not logged in")
        return make_response(jsonify({"message": "User not logged in"}), 401)

    print("Request files:", request.files)
    print("Request form data:", request.form)

    # Handling file uploads safely
    image = request.files.get('image')
    video = request.files.get('video')
    image_url = ""
    video_url = ""

    if image:
        image_url = cloudinary.uploader.upload(image, folder="SkillSync/skillpost_images")['secure_url']
    
    if video:
        video_url = cloudinary.uploader.upload(video, resource_type="auto", folder="SkillSync/skillpost_videos")['secure_url']

    # Fetch user details
    current_user = user_collection.find_one({"email": session.get('user')}, {"_id": 1})

    if not current_user:
        return make_response(jsonify({"message": "User not found"}), 404)

    # Insert into MongoDB
    skill_data = {
        "title": request.form.get('title', '').strip(),
        "description": request.form.get('description', '').strip(),
        "user": current_user["_id"],  # Convert ObjectId to string
        "tags": request.form.get('tags', '').split(',') if request.form.get('tags') else [],
        "created_at": datetime.datetime.utcnow(),
        "is_deleted": False,
        "image": image_url,
        "video": video_url
    }

    skillpost_collection.insert_one(skill_data)

    return make_response(jsonify({
        "message": "Skillpost created successfully"
    }), 201)



@skillpost.route('/debug-session', methods=["GET"])
def debug_session():
    user = session.get('session')
    print("Session contents:", user)  # ✅ Check session data
    return f"Session data: {session.get('session', 'No session found')}"