import psycopg2
from general_user import delete_image_post

port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()

import time

image_id_to_delete=3914
response = delete_image_post(image_id_to_delete, conn, cur)
print(response)

if __name__ == '__main__':
    table = "users"
    first = 'Matthew'
    last = 'Olsen'
    email = 'matthewolsen402@gmail.com'
    password = 'password'
