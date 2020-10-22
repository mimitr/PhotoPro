import psycopg2



def get_like_notification(user_id, timestamp, conn, cur):
    try:
        cmd = "SELECT image_id, liker FROM like_notif " \
              "WHERE uploader={} AND liker!={} AND comment_notif.create_at > {}".format(user_id, user_id, timestamp)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except Exception as e:
        return False

def get_comment_notification(user_id, timestamp, conn, cur):
    try:
        cmd = "SELECT image_id, commenter, comment FROM comment_notif " \
              "WHERE uploader={} AND commenter!={} AND comment_notif.create_at > {} ".format(user_id, user_id, timestamp)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result()
    except Exception as e:
        return False

def get_user_timestamp(user_id, conn, cur):
    try:
        cmd = "SELECT last_active FROM users WHERE id = {}".format(user_id)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchone()
        print(result)
        result = result[0]
        print(result)
        return result()
    except Exception as e:
        return False
