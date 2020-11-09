import psycopg2
from general_user import delete_image_post
from general_user import post_image
import io
import os
import base64
from google.cloud import vision
from google.cloud.vision import types

port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()

import time



# The name of the image file to annotate
file_name = os.path.abspath('ruby.jpg')

# Loads the image into memory
with io.open(file_name, 'rb') as image_file:
    content = image_file.read()

image = content
uploader=1
caption="lol"
title="nope"
price=5.0
tags=["yeah","nah"]
#print(file_name)
post_image(uploader, caption, image, title, price, tags, conn, cur)
