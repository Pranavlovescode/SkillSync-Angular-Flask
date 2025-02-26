from models import db
from models.users import User

class SkillPost(db.Document):
    title = db.StringField(max_length=255, required=True)
    description = db.StringField(max_length=255, required=True)
    user = db.ReferenceField(User)
    tags = db.ListField(db.StringField(max_length=255))
    created_at = db.DateTimeField()
    updated_at = db.DateTimeField(default=None)
    is_active = db.BooleanField(default=True)
    is_deleted = db.BooleanField(default=False)
    image = db.StringField(max_length=255,default='',required=False)
    video = db.StringField(max_length=255,default='',required=False)
    meta = {'collection': 'skillposts'}