from flask_login import current_user, login_required
from flask import request, jsonify, Blueprint
from models.skillpost import SkillPost
from models.users import User
import datetime
import cloudinary.uploader
import cloudinary
import os,json

cloudinary.config(
    cloud_name= os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key= os.getenv('CLOUDINARY_API_KEY'),   
    api_secret= os.getenv('CLOUDINARY_API_SECRET')
)

skillpost = Blueprint('skillpost', __name__)

@skillpost.route('/create',methods=["POST"])
@login_required
def create_skillpost():
    print("Request files:", request.files)
    print("Request form data:", request.form)

    image = request.files['image'] or ''
    video = request.files.get('video') or ''
    image_url = ''
    video_url = ''
    if image:
        image_url = cloudinary.uploader.upload(image, folder="SkillSync/skillpost_images")['secure_url']
    if video:
        video_url = cloudinary.uploader.upload(video, resource_type="auto",folder="SkillSync/skillpost_videos")['secure_url']

    skillpost = SkillPost(
        title=request.form.get('title'),
        description=request.form.get('description'),
        user=current_user,
        tags=request.form.get('tags').split(','),
        created_at=datetime.datetime.now(),
        is_deleted=False,
        image=image_url or image,
        video=video_url or video
    )
    skillpost.save()
    return jsonify({"message":"Skillpost created successfully",
                    "data":json.loads(skillpost.to_json())
                    }),201
