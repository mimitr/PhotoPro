import psycopg2
from datetime import datetime


def send_notification(uploader, sender, notification, image, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        if image is not None:
            cmd = (
                "INSERT INTO notifications (uploader, sender, notification, image_id)"
                "VALUES({}, {}, '{}', {})".format(uploader, sender, notification, image)
            )
        else:
            cmd = (
                "INSERT INTO notifications (uploader, sender, notification)"
                "VALUES({}, {}, '{}')".format(uploader, sender, notification)
            )
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def fetch_notification(user, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = "SELECT * FROM notifications WHERE uploader = {}".format(user)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()
        length = len(data)
        if length == 0:
            print("==============length of data is 0==============")
            return False
        else:
            print(data)
            return data
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def clear_notification(user, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = "DELETE FROM notifications WHERE uploader = {}".format(user)
        cur.execute(cmd)
        conn.commit()

    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False

