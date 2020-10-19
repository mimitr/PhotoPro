import psycopg2
from general_user import delete_image_post
from general_user import add_tag

port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()

import time

#image_id_to_delete=3914
#response = delete_image_post(image_id_to_delete, conn, cur)

image_to_add_tag_to=359
tag_to_add = "pet"
response = add_tag(image_to_add_tag_to, tag_to_add,conn, cur)
print(response)
