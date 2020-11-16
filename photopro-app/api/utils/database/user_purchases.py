import psycopg2


def add_purchase(user_id, image_id, save_for_later, purchased, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")

        if save_for_later:
            save_for_later = "TRUE"
        else:
            save_for_later = "FALSE"
        if purchased:
            purchased = "TRUE"
        else:
            purchased = "FALSE"

        cmd = "INSERT INTO user_purchases (user_id, image_id, save_for_later, purchased)\
                    VALUES ({}, {}, {}, {})".format(
            int(user_id), int(image_id), save_for_later, purchased
        )
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def delete_item_from_cart(user_id, image_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "DELETE FROM user_purchases WHERE user_id={} AND image_id={}\
                AND purchased=FALSE".format(
            int(user_id), int(image_id)
        )
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def item_is_in_cart(user_id, image_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "SELECT COUNT(*) FROM user_purchases WHERE user_id={} AND image_id={} AND purchased=FALSE".format(
            int(user_id), int(image_id)
        )
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchone()
        result = result[0]

        return bool(result)
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def get_user_purchases(user_id, save_for_later, purchased, conn, cur):
    try:
        if save_for_later:
            save_for_later = "TRUE"
        else:
            save_for_later = "FALSE"
        if purchased:
            purchased = "TRUE"
        else:
            purchased = "FALSE"

        cmd = "SELECT user_id, images.image_id, save_for_later, purchased, title, caption,\
                price, file FROM user_purchases LEFT JOIN images ON images.image_id=user_purchases.image_id \
                WHERE user_id={} AND save_for_later={} AND purchased={}".format(
            int(user_id), save_for_later, purchased
        )
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def update_user_purchases_details(
        user_id, image_id, save_for_later, purchased, conn, cur
):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "UPDATE user_purchases SET save_for_later={}, purchased={} \
                WHERE user_id={} AND image_id={}".format(
            save_for_later, purchased, int(user_id), int(image_id)
        )
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
import string
import random
import os


def send_user_purchase(user_id, image_id, conn, cur):
    try:

        cmd = "SELECT title,file from images where image_id={}".format(
            int(image_id)
        )
        cur.execute(cmd)
        conn.commit()
        (title, img) = cur.fetchone()
        print(img, '\n send_user_img', title)

        file = "{}.jpg".format(str(''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))))
        photo = open(file, "wb")
        photo.write(img)
        photo.close()

        img_data = open(file, 'rb').read()

        if os.path.exists(file):
            os.remove(file)

        title = title.replace(' ', '-').replace('.', '-').replace(',', '-')

        cmd = "SELECT email from users where id={}".format(
            int(user_id)
        )
        cur.execute(cmd)
        conn.commit()
        recipient = cur.fetchone()[0]
        print(recipient)

        ssl_port = 587
        email_server_password = "WeCodeNotSleep3900"
        context = ssl.create_default_context()
        with smtplib.SMTP("smtp.gmail.com", ssl_port) as server:
            server.ehlo()
            server.starttls(context=context)
            sender = "2mjec390@gmail.com"

            message = MIMEMultipart("alternative")
            message["Subject"] = "PhotoPro: Latest Purchase"
            message["From"] = sender
            message["To"] = recipient

            html = "\
                                    <html>\
                                        <body>\
                                            <p> Review your latest purchase. <br>\
                                            </p>\
                                        </body>\
                                    </html>"
            html = MIMEText(html, "html")
            message.attach(html)
            image = MIMEImage(img_data, name=os.path.basename(title+'.jpg'))
            message.attach(image)

            server.login("2mjec390@gmail.com", email_server_password)
            server.sendmail(sender, recipient, message.as_string())

            return True
    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False