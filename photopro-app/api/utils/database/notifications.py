import psycopg2



def get_like_notification(image_id, conn, cur):
    try:
        cmd = "SELECT * FROM likes WHERE image_id={}".format(image_id)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except Exception as e:
        return False

def get_comment_notification(user_id, image_id, conn, cur):
    try:
        cmd = "SELECT comment_id, commenter, comment FROM comments WHERE image_id={} AND commenter!={}".format(image_id, user_id)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result()
    except Exception as e:
        return False
