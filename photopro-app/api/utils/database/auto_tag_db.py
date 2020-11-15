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
from google.cloud import vision

vision_api_credentials_file_name = "PhotoPro-fe2b1d6e8742.json"

port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()


image_id=919
while(image_id < 1000):
	print(image_id)

	cmd = "select image_id,file from images where image_id={};".format(image_id)
	#print(cmd)
	conn.commit()
	cur.execute(cmd)
	#print("wow")
	data = cur.fetchall()
	if data:
		image=''
		for tup in data:
			#print(tup)
			(
				id,
				img,
			) = tup


			vision_key_filepath = os.path.abspath(vision_api_credentials_file_name)
			vision_client = vision.ImageAnnotatorClient.from_service_account_file(
				vision_key_filepath
			)

			content = img.tobytes()
			vision_image = vision.Image(content=content)
			# vision_image = types.Image(content=content)
			vision_response = vision_client.label_detection(image=vision_image)
			# print(vision_response)
			vision_labels = vision_response.label_annotations
			tags = []
			for label in vision_labels:
				#if label.score > (image_classify_threshold_percent / 100):
					# print(label.description)
				label_to_add = label.description.lstrip('"')
				label_to_add = label_to_add.rstrip('"').lower()
				print(label_to_add)
				if len(label_to_add) < 32:

					cmd = "INSERT INTO auto_tags (image_id, term, value) VALUES (%s, %s, %s)"
					cur.execute(cmd, (image_id, label_to_add, label.score))
					tags.append(label_to_add)
			cmd = "UPDATE images SET tags=%s WHERE image_id=%s"
			tags = list(set([t.lower() for t in tags]))
			cur.execute(cmd, (tags, image_id))
			conn.commit()
			conn.commit()
	image_id=image_id+1
		#image=img
