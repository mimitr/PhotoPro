import psycopg2
import time


def create_user(first, last, email, password, conn, cur):
	try:
		cmd = "INSERT INTO users(first,last,email,password) VALUES('{}','{}','{}', '{}');".format(first, last, email, password)
		print(cmd)
		cur.execute(cmd)
		conn.commit()
		return "Welcome {} {}".format(first, last)
	except psycopg2.errors.UniqueViolation as e:
		print(e)
		return "Unable to create new account. Account with that email already exists."

def login_user(email, password, conn, cur):

	cmd = "SELECT * FROM users WHERE email='{}' AND password='{}'".format(email, password)
	print(cmd)
	cur.execute(cmd)
	conn.commit()
	data = cur.fetchall()
	length = len(data)
	if length == 0:
		return "Incorrect email or password! Please try again."
	elif length == 1:
		(id,first,last,email,password) = data[0]
		print(id, first, last, email, password)
		return "Welcome back {} {}".format(first, last)
	else:
		print("Email not unique")

def change_password(email, password, new_password, conn, cur):
	login_response = login_user(email, password, conn, cur)

	if "Welcome back" in login_response:
		cmd = "UPDATE users SET password = '{}' WHERE email='{}' AND password='{}'".format(
			new_password,
			email,
			password
		)
		print(cmd)
		cur.execute(cmd)
		conn.commit()
		return "Successfully changed password!"
	else:
		return login_response


if __name__ == '__main__':
	port = 5432
	host = '34.87.239.111'
	database_user = 'outside_user'
	database_password = 'outside_user'
	database_name = 'postgres'

	conn = psycopg2.connect(user=database_user, password=database_password,
							host=host, port=port, database=database_name)
	cur = conn.cursor()

	print(conn, cur)

	table = "users"
	first = 'Matthew'
	last = 'Olsen'
	email = 'olsenmatthew780@gmail.com'
	password = 'password'

	# response = create_user(first, last, email, password, conn, cur)
	# print(response)

	# time.sleep(1)
	#
	# response = login_user(email, password, conn, cur)
	# print(response)

	# response = change_password(email, password, "new_password", conn, cur)
	# print(response)



	if conn:
		cur.close()
		conn.close()