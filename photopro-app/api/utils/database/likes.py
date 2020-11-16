import psycopg2


def post_like(image_id, user_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "INSERT INTO likes(image_id, liker) VALUES({}, {})".format(
            image_id, user_id
        )
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print("~~~~error with likes~~~~~")
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.Error as e:
        print("~~~~error with likes2~~~~~")

        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print("~~~~error with likes3~~~~~")

        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def delete_like(image_id, user_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "DELETE FROM LIKES WHERE image_id={} AND liker={}".format(
            image_id, user_id
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


def get_num_likes(image_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "SELECT COUNT(liker) FROM likes WHERE image_id={}".format(image_id)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchone()
        print(result)
        result = result[0]
        print(result)
        return result
    except psycopg2.Error as e:
        print("~~~~~~~~Error in get_num_likes~~~~~~~~~~")
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print("~~~~~~~~Error in get_num_likes2~~~~~~~~~~")
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def get_likers(image_id, limit, conn, cur):
    try:
        # cur.execute("SAVEPOINT save_point")
        cmd = "SELECT liker,first,last FROM users_likes WHERE image_id={} LIMIT {}".format(
            int(image_id), int(limit)
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()

        if len(result) == 0:
            return False
        else:
            return result
    except psycopg2.Error as e:
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        print(e)
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

        # cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        print(e)
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

        # cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def check_if_user_liked(image_id, user_id, conn, cur):
    try:
        # If you want to test, change 'images' to 'test_images' in cmd query
        cmd = """SELECT COUNT(*) FROM likes WHERE image_id={} AND liker={}""".format(
            int(image_id), int(user_id)
        )

        print(cmd)
        cur.execute(cmd)
        conn.commit()
        query_result = cur.fetchone()
        result = bool(int(query_result[0]))
        return result
    except Exception as e:
        print(e)
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        return False
