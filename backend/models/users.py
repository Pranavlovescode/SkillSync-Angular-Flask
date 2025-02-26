from models import db
from flask_login import UserMixin

class User(db.Document, UserMixin):
    email = db.StringField(max_length=255, unique=True,required=True)
    password = db.StringField(max_length=255, required=True)
    first_name = db.StringField(max_length=255, required=True)
    last_name = db.StringField(max_length=255,)
    username = db.StringField(max_length=255,unique=True,required=True)
    is_email_verified = db.BooleanField(default=False)
