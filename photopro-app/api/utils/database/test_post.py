import psycopg2
from general_user import delete_image_post
#from general_user import add_tag
from general_user import remove_tag
from general_user import get_tags
from general_user import post_image
from PIL import Image, ImageDraw, ImageFont
import io
import os
import base64

port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()

uploader=23
caption="meow"
title="gloop"
price=5.0
tags=["meow"]

image_path = os.path.abspath("battery.jpg")

with open(image_path, "rb") as image:
  image = image.read()
  #b = bytearray(f)
  #print b[0]



#image = Image.open(image_path).convert('RGBA')
#mage = base64.b64decode(image)

post_image(uploader, caption, image, title, price, tags, conn, cur)
