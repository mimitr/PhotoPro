import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import psycopg2


def create_user(first, last, email, password, conn, cur):
    try:
        cmd = "INSERT INTO users(first,last,email,password) VALUES('{}','{}','{}', '{}');".format(first, last, email,
                                                                                                  password)
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        # return "Welcome {} {}".format(first, last)
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        # return "Unable to create new account. Account with that email already exists."
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


def login_user(email, password, conn, cur):
    try:
        cmd = "SELECT * FROM users WHERE email='{}' AND password='{}'".format(
            email, password)
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()
        length = len(data)
        if length == 0:
            # return "Incorrect email or password! Please try again.", None
            return False, None
        elif length == 1:
            (id, first, last, email, password) = data[0]
            print(id, first, last, email, password)
            # return "Welcome back {} {}".format(first, last), id
            return True, id
        else:
            print("Email not unique")
            return False, None
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False, None


def change_password(email, password, new_password, conn, cur):
    try:
        login_response = login_user(email, password, conn, cur)

        if login_response:
            cmd = "UPDATE users SET password = '{}' WHERE email='{}' AND password='{}'".format(
                new_password,
                email,
                password
            )
            print(cmd)
            cur.execute(cmd)
            conn.commit()
            return True
        else:
            return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


def forgot_password_get_change_password_link(recipient, conn, cur):
    try:
        cmd = "SELECT * FROM users WHERE email='{}'".format(recipient)
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()
        length = len(data)

        if length == 0:
            # return "Incorrect email or password! Please try again."
            return False
        elif length == 1:
            ssl_port = 587
            email_server_password = 'WeCodeNotSleep3900'
            context = ssl.create_default_context()
            with smtplib.SMTP("smtp.gmail.com", ssl_port) as server:
                server.ehlo()
                server.starttls(context=context)
                sender = "2mjec390@gmail.com"

                message = MIMEMultipart("alternative")
                message['Subject'] = "PhotoPro: Reset Your Password"
                message['From'] = sender
                message['To'] = recipient
                reset_url = "www.photopro.com/reset-password/id"

                html = "\
                    <html>\
                        <body>\
                            <p> Need to reset your password? <br>\
                            You can do this easily using the link below: <br>\
                                    <center>{}</center> <br>\
                            If you didn't ask to reset your password, please get in touch at support@photopro.com. <br>\
                            </p>\
                        </body>\
                    </html>".format(reset_url)
                html = MIMEText(html, 'html')
                message.attach(html)

                server.login("2mjec390@gmail.com", email_server_password)
                server.sendmail(sender, recipient, message.as_string())

                # return "Your email has just sent a link to change your password. Make sure to check your spam folder!"
                return True
        else:
            print("Email not unique")
            return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


def post_image(uploader, caption, image, conn, cur):
    try:
        cmd = """
            INSERT INTO images (caption, uploader, file) 
            VALUES (%s, %s, %s)
            """
        print(cmd)
        cur.execute(cmd, (caption, uploader, image))
        conn.commit()
        return True
    except Exception as e:
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


def discovery(user_id, batch_size, conn, cur):
    try:
        user_id = int(user_id)
        batch_size = int(batch_size)
        cmd = "SELECT * FROM images WHERE uploader!={} LIMIT {}".format(
            user_id, batch_size)
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchmany(batch_size)

        length = len(data)
        if length == 0:
            return False
        else:
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False

def discovery_with_search_term(user_id, batch_size, query, conn, cur):
    try:
        user_id = int(user_id)
        batch_size = int(batch_size)
        cmd = "SELECT * FROM images WHERE uploader!={} AND caption ILIKE '%{}%' LIMIT {}".format(
            user_id, query, batch_size)
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchmany(batch_size)

        length = len(data)
        if length == 0:
            return False
        else:
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False