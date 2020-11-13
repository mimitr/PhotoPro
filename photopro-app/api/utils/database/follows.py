import psycopg2


def follow(user_id, followee, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "INSERT INTO follows (followee, follower) VALUES ({},{})".format(
            int(followee), int(user_id)
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


def unfollow(user_id, followee, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "DELETE FROM follows WHERE followee={} AND follower={}".format(
            int(followee), int(user_id)
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


def is_following(user_id, followee, conn, cur):
    try:
        cmd = "SELECT COUNT(*) FROM follows WHERE followee={} AND follower={}".format(
            int(followee), int(user_id)
        )
        cur.execute(cmd)
        conn.commit()
        (result) = cur.fetchall()[0]
        print("is_following result: ", bool(result[0]))
        return bool(result[0])
    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
