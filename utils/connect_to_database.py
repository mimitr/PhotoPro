import psycopg2
import time


port = 5432
host = '34.87.239.111'
database_user = 'outside_user'
database_password = 'outside_user'
database_name = 'postgres'

conn = psycopg2.connect(user=database_user, password=database_password,
						host=host, port=port, database=database_name)
cur = conn.cursor()

print(conn, cur)

def create_user(first, last, email):
	try:
		cmd = "INSERT INTO users(first,last,email) VALUES('{}','{}','{}');".format(first, last, email)
		print(cmd)
		cur.execute(cmd)
		conn.commit()
		return "Welcome {} {}".format(first, last)
	except psycopg2.errors.UniqueViolation as e:
		print(e)
		return "Unable to create new account. Account with that email already exists."

if __name__ == '__main__':
	table = "users"
	first = 'Matthew'
	last = 'Olsen'
	email = 'OlsenMatthew780@gmail.com'

	response = create_user(first, last, email)
	print(response)

	time.sleep(1)

	cmd = "SELECT * FROM {}".format(table)
	cur.execute(cmd)


	data = cur.fetchall()

	print(data)

if conn:
	cur.close()
	conn.close()