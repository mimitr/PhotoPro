import psycopg2
from general_user import delete_image_post
from general_user import post_image
import io
import os
import base64
from recommendation import get_related_images

port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
curr = conn.cursor()

import time

image_id=900
num_related_images=3
get_related_images(image_id,num_related_images,conn,curr)
