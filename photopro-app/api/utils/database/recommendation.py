import psycopg2


def get_terms_and_values_for_image(image_id, conn, cur):
    try:
        cmd = "select term, value from auto_tags where image_id={}".format(int(image_id))
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()

        if len(result) == 0:
            return False
        else:
            return result

    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def update_recommendation_term(user_id, term, value, coefficient, conn, cur):
    try:
        cmd = "select value from auto_tags where user_id={} AND term ILIKE '{}'".format(int(user_id, term))
        cur.execute(cmd)
        conn.commit()
        conn.commit()

        result = cur.fetchone()[0]
        print(result)
        if result is not None:
            new_value = int(result) + value*coefficient
        else:
            new_value = value

        cur.execute("SAVEPOINT save_point")
        cmd = (
            "INSERT INTO RECOMMENDATIONS (user_id, term, value) VALUES ({}, '{}', {})".format(
                int(user_id), term, new_value
            )
        )
        cur.execute(cmd)
        conn.commit()

        return result

    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
