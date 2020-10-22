import psycopg2
from datetime import datetime



def get_like_notification(user_id, timestamp, conn, cur):
    try:
        cmd = "SELECT image_id, liker FROM test_like_notif " \
              "WHERE uploader={} AND liker!={} " \
              "AND test_like_notif.created_at > TO_TIMESTAMP('{}', 'YYYY-MM-DD HH24:MI:SS.US') ".format(user_id, user_id, timestamp)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except Exception as e:
        return False

def get_comment_notification(user_id, timestamp, conn, cur):
    try:
        cmd = "SELECT image_id, commenter, comment FROM test_comment_notif " \
              "WHERE uploader={} AND commenter!={} " \
              "AND test_comment_notif.created_at > TO_TIMESTAMP('{}', 'YYYY-MM-DD HH24:MI:SS.US') ".format(user_id, user_id, timestamp)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except Exception as e:
        return False

def get_user_timestamp(user_id, conn, cur):
    try:
        cmd = "SELECT last_active FROM test_users WHERE id = {}".format(user_id)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchone()
        print(result)
        result = result[0]
        print(result)
        return result
    except Exception as e:
        return False
