import psycopg2


def post_comment_to_image(image_id, commenter, comment, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = "INSERT INTO comments (image_id, commenter, comment) VALUES({}, {}, '{}')".format(
            image_id, commenter, comment
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


def post_comment_to_comment(image_id, commenter, comment, reply_id, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = "INSERT INTO comments (image_id, commenter, comment, reply_id) \
                VALUES({}, {}, '{}', {})".format(
            image_id, commenter, comment, reply_id
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


def delete_comment(comment_id, user_id, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = "DELETE FROM comments WHERE comment_id={} AND commenter={}".format(
            comment_id, user_id
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


def get_comments_to_image(image_id, batch_size, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = (
            "SELECT comments.comment_id, image_id, commenter, comment, comments.reply_id, created_at, count FROM "
            "comments LEFT JOIN reply_count ON comments.comment_id=reply_count.reply_id WHERE image_id={} AND "
            "comments.reply_id IS NULL ORDER BY created_at DESC LIMIT {}".format(
                image_id, batch_size
            )
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()

        length = len(data)
        # print(length)
        if length == 0:
            return False
        else:
            print("------------------ comments ----------------------")
            print(data)
            print("--------------------------------------------------")
            return data
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.ProgrammingError as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def get_comments_to_comment(reply_id, batch_size, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        cmd = (
            "SELECT comments.comment_id, image_id, commenter, comment, comments.reply_id, created_at, count FROM "
            "comments LEFT JOIN reply_count ON comments.comment_id=reply_count.reply_id WHERE comments.reply_id={}"
            " ORDER BY created_at DESC LIMIT {}".format(reply_id, batch_size)
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchmany(int(batch_size))

        length = len(data)
        # print(length)
        if length == 0:
            return False
        else:
            # print(data)
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
