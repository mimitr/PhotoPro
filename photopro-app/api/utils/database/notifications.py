import psycopg2
from datetime import datetime


def get_like_notification(user_id, timestamp, conn, cur):
    try:
        cmd = (
            "SELECT title, image_id, liker, created_at FROM like_notif "
            "WHERE uploader={} AND liker!={} "
            "AND like_notif.created_at > TO_TIMESTAMP('{}', 'YYYY-MM-DD HH24:MI:SS.US') ".format(
                user_id, user_id, timestamp
            )
        )
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except Exception as e:
        print(e)
        return False


def get_comment_notification(user_id, timestamp, conn, cur):
    try:
        cmd = (
            "SELECT title, image_id, commenter, comment, created_at FROM comment_notif "
            "WHERE uploader={} AND commenter!={} "
            "AND comment_notif.created_at > TO_TIMESTAMP('{}', 'YYYY-MM-DD HH24:MI:SS.US') ".format(
                user_id, user_id, timestamp
            )
        )
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except Exception as e:
        print(e)
        return False


def get_user_timestamp(user_id, conn, cur):
    try:
        cmd = "SELECT last_active FROM users WHERE id = {}".format(user_id)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        print(result)
        result = result[0]
        print(result)
        return result
    except Exception as e:
        print(e)
        return False
