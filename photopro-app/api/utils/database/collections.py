import psycopg2


def create_collection(user_id, collection_name, private, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = (
            "INSERT INTO collections (collection_name, creator_id, private) VALUES ('{}', {}, {})"
            " RETURNING collection_id".format(
                collection_name, int(user_id), bool(private)
            )
        )
        cur.execute(cmd)
        conn.commit()
        return cur.fetchone()[0]
    except psycopg2.Error as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def delete_collection(collection_id, user_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "DELETE FROM collection_photos WHERE collection_id={}".format(
            int(collection_id)
        )
        cur.execute(cmd)
        conn.commit()

        cur.execute("SAVEPOINT save_point")
        cmd = "DELETE FROM collections WHERE collection_id={} AND creator_id={}".format(
            int(collection_id), int(user_id)
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


def add_photo_to_collection(collection_id, user_id, image_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "INSERT INTO collection_photos (collection_id, image_id) SELECT {},{} WHERE EXISTS\
         		(select 1 FROM collections WHERE collections.collection_id={} AND collections.creator_id={})".format(
            int(collection_id), int(image_id), int(collection_id), int(user_id)
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


def get_users_collection(user_id, limit, conn, cur):
    try:
        cmd = "select user_collection_agg.collection_id, collection_name, creator_id, private, num_photos,first(file)\
                from user_collection_agg LEFT JOIN collection_photos ON \
                user_collection_agg.collection_id=collection_photos.collection_id LEFT JOIN\
                 images ON images.image_id=collection_photos.image_id WHERE creator_id={} GROUP BY\
                  user_collection_agg.collection_id, collection_name, creator_id, private,\
                   num_photos".format(int(user_id))
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        return result
    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def delete_photo_from_collection(collection_id, image_id, creator_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        cmd = "DELETE FROM collection_photos WHERE collection_id={} AND\
                image_id={} AND EXISTS(select 1 FROM collections WHERE \
                collections.collection_id={} AND collections.creator_id={})".format(
            int(collection_id), int(image_id), int(collection_id), int(creator_id)
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


def update_collections_private(collection_id, private, creator_id, conn, cur):
    try:
        cur.execute("SAVEPOINT save_point")
        if private:
            cmd = "UPDATE collections SET private=TRUE WHERE collection_id={}\
                    AND creator_id={}".format(
                int(collection_id), int(creator_id)
            )
        else:
            cmd = "UPDATE collections SET private=False WHERE collection_id={}\
                    AND creator_id={}".format(
                int(collection_id), int(creator_id)
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


def get_collection_data(collection_id, limit, conn, cur):
    try:
        # cur.execute('SAVEPOINT save_point')
        cmd = "select collection_id, collection_name, creator_id, private, images.image_id,\
                caption, uploader, file, title, price, created_at, tags, num_likes  FROM collection_content \
                INNER JOIN images ON images.image_id=collection_content.image_id \
                FULL JOIN num_likes_per_image ON num_likes_per_image.image_id=images.image_id \
                WHERE collection_id={} LIMIT {}".format(
            int(collection_id), int(limit)
        )

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
