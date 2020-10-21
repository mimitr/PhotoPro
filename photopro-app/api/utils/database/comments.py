import psycopg2


def post_comment_to_image(image_id, commenter, comment, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "INSERT INTO comments (image_id, commenter, comment) VALUES({}, {}, '{}')".format(image_id, commenter,
                                                                                                comment)
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def post_comment_to_comment(image_id, commenter, comment, reply_id, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "INSERT INTO comments (image_id, commenter, comment, reply_id) \
                VALUES({}, {}, '{}', {})".format(image_id, commenter, comment, reply_id)
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def delete_comment(comment_id, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "DELETE FROM comments WHERE comment_id={}".format(comment_id)
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def get_comments_to_image(image_id, batch_size, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "SELECT * FROM comments WHERE image_id={} AND reply_id is null LIMIT {}".format(image_id, batch_size)
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def get_comments_to_comment(reply_id, batch_size, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "DELETE FROM comments WHERE reply_id={} LIMIT {}".format(reply_id, batch_size)
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.errors.UniqueViolation as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
