from flask import request, jsonify, Blueprint, make_response, session
import datetime
import cloudinary.uploader
import cloudinary
import os
from db import skillpost_collection, user_collection
from bson.json_util import dumps
from bson import ObjectId


# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

skillpost = Blueprint('skillpost', __name__)



@skillpost.route('/get-all', methods=["GET"])
def get_all_skillposts():
    if not session.get('user'):
        print("User not logged in")
        return make_response(jsonify({"message": "User not logged in"}), 401)

    skillposts = skillpost_collection.aggregate([
        {
            "$match": {"is_deleted": False}
        },
        {
            "$lookup": {
                "from": "user",  # Name of the user collection
                "localField": "user",  # Field in skillpost_collection
                "foreignField": "_id",  # Field in users collection
                "as": "user"
            }
        },
        {
            "$unwind": "$user"  # Converts array result into an object
        }
    ])

    return make_response(dumps(skillposts), 200)




@skillpost.route('/get-by-id/<id>',methods=["GET"])
def get_by_id(id):
    if not session.get('user'):
        print("User not logged in")
        return make_response(jsonify({"message":"User not logged in"}),401)
    else:
        skillpost = skillpost_collection.find_one({"_id":ObjectId(id)})
        return make_response(dumps(skillpost),200)
    

@skillpost.route('/delete/<id>', methods=["DELETE"])
def delete_skillpost(id):
    if not session.get('user'):
        print("User not logged in")
        return make_response(jsonify({"message": "User not logged in"}), 401)
    
    skillpost = skillpost_collection.find_one({"_id": ObjectId(id)})

    if not skillpost:
        return make_response(jsonify({"message": "Skillpost not found"}), 404)

    skillpost_collection.update_one({"_id": ObjectId(id)}, {"$set": {"is_deleted": True}})

    return make_response(jsonify({
        "message": "Skillpost deleted successfully"
    }), 200)


@skillpost.route('/update/<id>', methods=["PUT"])
def update_skillpost(id):
    if not session.get('user'):
        print("User not logged in")
        return make_response(jsonify({"message": "User not logged in"}), 401)

    skillpost = skillpost_collection.find_one({"_id": ObjectId(id)})

    if not skillpost:
        return make_response(jsonify({"message": "Skillpost not found"}), 404)

    # Handling file uploads safely
    image = request.files.get('image')
    video = request.files.get('video')
    image_url = skillpost['image']
    video_url = skillpost['video']

    if image:
        image_url = cloudinary.uploader.upload(image, folder="SkillSync/skillpost_images")['secure_url']
    
    if video:
        video_url = cloudinary.uploader.upload(video, resource_type="auto", folder="SkillSync/skillpost_videos")['secure_url']

    # Update MongoDB
    skill_data = {
        "title": request.form.get('title', '').strip(),
        "description": request.form.get('description', '').strip(),
        "tags": request.form.get('tags', '').split(',') if request.form.get('tags') else [],
        "image": image_url,
        "video": video_url,
        "likes":0,
        "comments":[],
        "created_at": datetime.datetime.now()
    }

    skillpost_collection.update_one({"_id": ObjectId(id)}, {"$set": skill_data})

    return make_response(jsonify({
        "message": "Skillpost updated successfully"
    }), 200)


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
        "created_at": datetime.datetime.now(),
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