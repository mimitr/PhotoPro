#!/usr/bin/env python
from flask import Flask
import sys

for i in sys.path:
    print(i)

from utils.database.connect import conn, cur
from utils.database.general_user import create_user, login_user,\
    change_password, forgot_password_get_change_password_link,\
    post_image, discovery

print(conn, cur)

app = Flask(__name__)

@app.route('/post')
def post_image():
    return {
        'image': True
    }