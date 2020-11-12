import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import psycopg2
from google.cloud import vision

# from google.cloud.vision import types
import os
import base64
import binascii
import io

vision_api_credentials_file_name = "utils/database/PhotoPro-fe2b1d6e8742.json"
image_classify_threshold_percent = 50.0


def create_user(first, last, email, password, username, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "INSERT INTO users(first,last,email,password, username) VALUES('{}','{}','{}', '{}', '{}');".format(
            first, last, email, password, username
        )
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
        cmd = "SELECT id, first, last, email, password, last_active, username\
                FROM users WHERE email='{}' AND password='{}'".format(
            email, password
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()
        length = len(data)
        if length == 0:
            # return "Incorrect email or password! Please try again.", None
            return False, None
        elif length == 1:
            (id, first, last, email, password, last_active, username) = data[0]
            print(id, first, last, email, password, last_active, username)
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
        cur.execute("SAVEPOINT save_point")
        login_response = login_user(email, password, conn, cur)

        if login_response:
            cmd = "UPDATE users SET password = '{}' WHERE email='{}' AND password='{}'".format(
                new_password, email, password
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
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def forgot_password_get_change_password_link(recipient, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "SELECT id, first, last, email, password, last_active, username FROM users WHERE email='{}'".format(
            recipient
        )
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
            email_server_password = "WeCodeNotSleep3900"
            context = ssl.create_default_context()
            with smtplib.SMTP("smtp.gmail.com", ssl_port) as server:
                server.ehlo()
                server.starttls(context=context)
                sender = "2mjec390@gmail.com"

                message = MIMEMultipart("alternative")
                message["Subject"] = "PhotoPro: Reset Your Password"
                message["From"] = sender
                message["To"] = recipient
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
                    </html>".format(
                    reset_url
                )
                html = MIMEText(html, "html")
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
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def post_image(uploader, caption, image, title, price, tags, conn, cur):
    print("================ START POST===================")
    try:
        print("================ START POST===================")
        cur.execute("SAVEPOINT save_point")

        # array = "ARRAY["
        # for i in set(tags):
        #     array = array + "\'" + i + "\',"
        # array = array[:len(array) - 1] + "]"

        # classification code goes here
        print("1")
        print(os.getcwd())
        vision_key_filepath = os.path.abspath(vision_api_credentials_file_name)
        print("2", os.getcwd())
        vision_client = vision.ImageAnnotatorClient.from_service_account_file(
            vision_key_filepath
        )
        print("3")

        content = image
        print("4")
        print(content)
        print("5")
        vision_image = vision.Image(content=content)
        # vision_image = types.Image(content=content)
        print("6")
        vision_response = vision_client.label_detection(image=vision_image)
        # print(vision_response)
        print("7")
        vision_labels = vision_response.label_annotations

        for label in vision_labels:
            if label.score > (image_classify_threshold_percent / 100):
                # print(label.description)
                label_to_add = label.description.lstrip('"')
                label_to_add = label_to_add.rstrip('"')
                tags.append(label_to_add)

        cmd = "INSERT INTO images (caption, uploader, file, title, price, tags) VALUES (%s, %s, %s, %s, %s, %s)"
        # print(cmd, uploader, caption, title, price, tags)
        print(tags)
        cur.execute(cmd, (caption, uploader, image, title, price, tags))
        conn.commit()

        return True
    except Exception as e:
        print(e)
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def delete_image_post(image_id, uploader, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = "DELETE FROM comments WHERE image_id = {}".format(image_id)
        cur.execute(cmd)
        conn.commit()

        cmd = "DELETE FROM likes WHERE image_id = {}".format(image_id)
        cur.execute(cmd)
        conn.commit()

        cmd = """
            DELETE FROM images
            WHERE image_id = %s;
            """
        print(cmd)
        cur.execute(cmd, (image_id,))
        conn.commit()
        return True
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def discovery(user_id, batch_size, start_point, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        user_id = int(user_id)
        batch_size = int(batch_size)

        cmd = "select images.image_id, caption, uploader, file, title, price, created_at, tags, num_likes FROM num_likes_per_image\
                    RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id\
                    WHERE images.image_id> {} AND uploader!={} \
                     ORDER BY created_at DESC LIMIT {}".format(
            start_point, user_id, batch_size
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()

        length = len(data)
        if length == 0:
            return False
        else:
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.ProgrammingError as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def discovery_with_search_term(user_id, batch_size, query, start_point, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        user_id = int(user_id)
        batch_size = int(batch_size)
        cmd = "select images.image_id, caption, uploader, file, title, price, created_at, tags, num_likes FROM num_likes_per_image\
                    RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id\
                    WHERE images.image_id> {} AND uploader!={} AND caption ILIKE '%{}%'\
                     ORDER BY created_at DESC LIMIT {}".format(
            start_point, user_id, query, batch_size
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()

        length = len(data)
        # print(length)
        if length == 0:
            print("--------------------- NO RESULTS FOUND ----------------------")
            return False
        else:
            print("-------------------- RESULTS FOUND -----------------------")
            print(data)
            print("----------------------------------------------------------")
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(
            "===================== ERROR IN DISCOVERY WITH SEARCH TERM ======================="
        )
        print(error)
        print(e)
        print(
            " ==============================================================================="
        )
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False

    except psycopg2.ProgrammingError as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def search_by_tag(user_id, batch_size, query, start_point, conn, cur):
    try:
        user_id = int(user_id)
        batch_size = int(batch_size)
        cmd = "SELECT images.image_id, caption, uploader, file, title, price, created_at, tags, num_likes FROM num_likes_per_image\
                    RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id\
                     WHERE images.image_id> {} AND uploader != {} AND '{}' ILIKE ANY(tags)\
                      ORDER BY created_at DESC LIMIT {}".format(
            start_point, user_id, query, batch_size
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()
        length = len(data)
        # print("length of data is ", data)
        if length == 0:
            return False
        else:
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


def profiles_photos(user_id, batch_size, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        user_id = int(user_id)
        batch_size = int(batch_size)

        cmd = "SELECT images.image_id, caption, uploader, file, title, price, created_at, tags, num_likes FROM num_likes_per_image\
                RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id\
                 WHERE uploader={} ORDER BY created_at DESC LIMIT {}".format(
            user_id, batch_size
        )

        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchmany(batch_size)

        length = len(data)
        print("retrieved", length, " profile photos")
        if length == 0:
            return False
        else:
            # print(data)
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def edit_post(user_id, image, title, price, caption, tags, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        # If you want to test, change 'images' to 'test_images' in cmd query
        cmd = """UPDATE images SET title = '%s', price = %s, caption = '%s', tags = '{%s}'
                 WHERE uploader = %s and image_id = %s""" % (
            title,
            price,
            caption,
            tags,
            user_id,
            image,
        )

        # cmd = "UPDATE images SET title = '{}', price = '{}', caption = '{}', tags = '{{%s}}' " \
        #      "WHERE uploader = {} AND image_id = {}".format(
        #    title, price, caption, tags, user_id, image
        # )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        return True
    except Exception as e:
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print("%d is type %s" % (price, type(price)))
        print(error)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


# adds a tag to an image given image_id and does not add duplicates
def add_tags(user_id, image_id, tags, conn, cur):
    try:
        # If you want to test, change 'images' to 'test_images' in cmd query
        array = "ARRAY["
        for i in set(tags):
            array = array + "'" + i + "',"
        array = array[: len(array) - 1] + "]"

        cmd = "UPDATE images SET tags = \
                (SELECT array_agg(distinct e) FROM \
                UNNEST(tags || {}) e) WHERE uploader={} \
                AND image_id={} AND NOT tags @> {}".format(
            array, user_id, image_id, array
        )

        # cmd = (
        #     """UPDATE images SET tags = array_cat(tags, {}) \
        #     WHERE uploader = %s AND image_id = %d AND NOT (
        #     '%s' = ANY(tags)) """
        #     % (tag, user_id, image_id)
        # )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        return True
    except Exception as e:
        print(e)
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


# simply removes a tag from an image given an image_id
def remove_tag(user_id, image_id, tag, conn, cur):
    try:
        # If you want to test, change 'images' to 'test_images' in cmd query
        cmd = """UPDATE images SET tags = array_remove(tags, '%s') WHERE uploader = %s AND image_id = %d AND ('%s' = 
            ANY(tags)) """ % (
            tag,
            user_id,
            image_id,
            tag,
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        return True
    except Exception as e:
        print(e)
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


# Fetches the tag for an image given the image_id
def get_tags(image_id, conn, cur):
    try:
        # If you want to test, change 'images' to 'test_images' in cmd query
        cmd = """select tags from images where image_id=%d """ % (int(image_id))
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        query_result = cur.fetchall()
        found_tags = query_result[0][0]
        return found_tags
    except Exception as e:
        print(e)
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False


def set_user_timestamp(user_id, conn, cur):
    try:
        cmd = "UPDATE users SET last_active = NOW() WHERE id = {}".format(user_id)
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        return True
    except Exception as e:
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False
