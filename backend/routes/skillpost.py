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




@skillpost.route('/get-by-id/<id>', methods=["GET"])
def get_by_id(id):
    if not session.get('user'):
        print("User not logged in")
        return make_response(jsonify({"message":"User not logged in"}),401)
    else:
        # Get current user
        current_user = user_collection.find_one({"email":session.get('user')})
        if not id:
            return make_response(jsonify({"message":"No skillpost found for this id"}),404)
            
        skillpost = skillpost_collection.find_one({"_id":ObjectId(id)})
        
        # Check if current user has liked this post
        user_has_liked = False
        if skillpost and 'liked_by' in skillpost:
            user_has_liked = str(current_user["_id"]) in [str(uid) for uid in skillpost.get('liked_by', [])]
        
        # Get user who created the post
        post_user = None
        if skillpost and 'user' in skillpost:
            post_user = user_collection.find_one({"_id": skillpost['user']})
        
        response = {
            "skillpost": skillpost,
            "user": post_user,
            "current_user": {
                "_id": current_user["_id"],
                "username": current_user["username"],
                "email": current_user["email"],
                "profile_picture": current_user.get("profile_picture", "")
            },
            "user_has_liked": user_has_liked
        }
        
        return make_response(dumps(response), 200)
    

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


@skillpost.route('/update/<id>', methods=["PATCH"])
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
        "tags": request.form.getlist('tags'),
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
    print("Request data:", request.form.getlist('tags'))

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
        "tags": request.form.getlist('tags'),
        "created_at": datetime.datetime.now(),
        "is_deleted": False,
        "image": image_url,
        "video": video_url,
        "comments": [],
        "likes": 0,
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


@skillpost.route('/like/<id>', methods=["POST"])
def like_skillpost(id):
    if not session.get('user'):
        return make_response(jsonify({"message": "User not logged in"}), 401)

    skillpost = skillpost_collection.find_one({"_id": ObjectId(id)})
    if not skillpost:
        return make_response(jsonify({"message": "Skillpost not found"}), 404)

    # Get current user information
    current_user = user_collection.find_one({"email": session.get('user')})
    if not current_user:
        return make_response(jsonify({"message": "User not found"}), 404)
    
    user_id = current_user["_id"]
    
    # Check if user has already liked this post
    liked_by = skillpost.get('liked_by', [])
    current_likes = skillpost.get('likes', 0)
    
    if str(user_id) in [str(uid) for uid in liked_by]:
        # User already liked, so unlike
        liked_by.remove(user_id)
        current_likes -= 1
        message = "Skillpost unliked successfully"
    else:
        # User hasn't liked, so like
        liked_by.append(user_id)
        current_likes += 1
        message = "Skillpost liked successfully"
    
    # Update the post with new likes count and liked_by array
    skillpost_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "likes": current_likes,
            "liked_by": liked_by
        }}
    )

    # Return the updated likes count and status
    return make_response(jsonify({
        "message": message,
        "likes": current_likes,
        "liked": str(user_id) in [str(uid) for uid in liked_by]
    }), 200)


@skillpost.route('/comment/<id>', methods=["POST"])
def comment_skillpost(id):
    if not session.get('user'):
        return make_response(jsonify({"message": "User not logged in"}), 401)

    comment_data = request.json
    comment_text = comment_data.get('comment')
    parent_comment_id = comment_data.get('parent_id')  # For replies
    
    if not comment_text or not comment_text.strip():
        return make_response(jsonify({"message": "Comment cannot be empty"}), 400)

    skillpost = skillpost_collection.find_one({"_id": ObjectId(id)})
    if not skillpost:
        return make_response(jsonify({"message": "Skillpost not found"}), 404)

    # Get current user information
    current_user = user_collection.find_one({"email": session.get('user')})
    if not current_user:
        return make_response(jsonify({"message": "User not found"}), 404)

    # Format the comment with user information - Convert ObjectId to string
    formatted_comment = {
        "id": str(ObjectId()),  # Generate unique ID for the comment
        "text": comment_text,
        "user_id": str(current_user["_id"]),  # Convert ObjectId to string
        "username": current_user["username"],
        "profile_picture": current_user.get("profile_picture", ""),
        "created_at": datetime.datetime.now().isoformat(),  # Convert datetime to string
        "parent_id": str(parent_comment_id) if parent_comment_id else None,  # Convert to string if it exists
        "replies": []
    }

    # Get current comments
    comments = skillpost.get('comments', [])
    
    # If this is a reply, add it to the parent comment's replies
    if parent_comment_id:
        parent_found = False
        for comment in comments:
            if comment.get('id') == parent_comment_id:
                comment['replies'].append(formatted_comment)
                parent_found = True
                break
                
        if not parent_found:
            return make_response(jsonify({"message": "Parent comment not found"}), 404)
    else:
        # This is a top-level comment
        comments.append(formatted_comment)
    
    # Update the post with new comments
    skillpost_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"comments": comments}}
    )

    # Prepare the response - ensure all ObjectIds are converted to strings
    serializable_comments = []
    for comment in comments:
        # Make a copy of the comment to avoid modifying the original
        comment_copy = comment.copy()
        # Convert any ObjectId to string
        if 'user_id' in comment_copy and not isinstance(comment_copy['user_id'], str):
            comment_copy['user_id'] = str(comment_copy['user_id'])
        serializable_comments.append(comment_copy)

    # Return the updated comments using dumps to handle MongoDB objects
    return make_response(dumps({
        "message": "Comment added successfully",
        "comments": serializable_comments
    }), 200)


@skillpost.route('/comments/<id>', methods=["GET"])
def get_comments(id):
    if not session.get('user'):
        return make_response(jsonify({"message": "User not logged in"}), 401)

    skillpost = skillpost_collection.find_one({"_id": ObjectId(id)})
    if not skillpost:
        return make_response(jsonify({"message": "Skillpost not found"}), 404)

    # Get comments for this post
    comments = skillpost.get('comments', [])
    
    # Convert ObjectId fields to strings and add user details
    serializable_comments = []
    for comment in comments:
        # Make a copy of the comment to avoid modifying the original
        comment_copy = comment.copy()
        
        # Convert ObjectId to string if present
        if 'user_id' in comment_copy and not isinstance(comment_copy['user_id'], str):
            user_id = comment_copy['user_id']
            comment_copy['user_id'] = str(user_id)
            
            # Fetch and add user details
            user = user_collection.find_one({"_id": user_id})
            if user:
                comment_copy['username'] = user.get('username', 'Unknown')
                comment_copy['profile_picture'] = user.get('profile_picture', '')
        
        # Ensure datetime is serializable
        if 'created_at' in comment_copy and not isinstance(comment_copy['created_at'], str):
            comment_copy['created_at'] = comment_copy['created_at'].isoformat()
            
        serializable_comments.append(comment_copy)
        print("Serializable comments:", serializable_comments)

    # Return serialized comments
    return make_response(dumps(serializable_comments), 200)