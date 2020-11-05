import psycopg2


port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()

def get_collection():

# select collection_id, collection_name, creator_id, private, images.image_id, uploader,created_at, tags  FROM collection_content INNER JOIN images ON images.image_id=collection_content.image_id;
