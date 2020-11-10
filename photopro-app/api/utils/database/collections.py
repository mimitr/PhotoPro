import psycopg2


def create_collection(user_id, collection_name, private, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "INSERT INTO collections (collection_name, creator_id, private) VALUES ('{}', {}, {})" \
              " RETURNING collection_id".format(
                  collection_name, int(user_id), bool(private))
        cur.execute(cmd)
        conn.commit()
        return cur.fetchone()[0]
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def delete_collection(collection_id, user_id, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "DELETE FROM collections WHERE collection_id={} AND creator_id={}".format(int(collection_id),
                                                                                        int(user_id))
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def add_photo_to_collection(collection_id, user_id, image_id, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        cmd = "INSERT INTO collection_photos (collection_id, image_id) SELECT {},{} WHERE EXISTS\
         		(select 1 FROM collections WHERE collections.collection_id={} AND collections.creator_id={})" \
            .format(int(collection_id), int(image_id), int(collection_id), int(user_id))
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def get_users_collection(user_id, limit, conn, cur):
    try:
        cmd = "select collection_content.collection_id, collection_content.collection_name, collection_content.creator_id,\
                    collection_content.private, COUNT(images.image_id) as num_photos FROM collection_content FULL JOIN images ON\
                     images.image_id=collection_content.image_id WHERE collection_content.creator_id={}\
                    GROUP BY collection_content.collection_id, collection_content.collection_name, collection_content.creator_id,\
                     collection_content.private".format(int(user_id))
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
        cur.execute('SAVEPOINT save_point')
        cmd = "DELETE FROM collection_photos WHERE collection_id={} AND\
                image_id={} AND EXISTS(select 1 FROM collections WHERE \
                collections.collection_id={} AND collections.creator_id={})"\
            .format(int(collection_id), int(image_id), int(collection_id), int(creator_id))
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def update_collections_private(collection_id, private, creator_id, conn, cur):
    try:
        cur.execute('SAVEPOINT save_point')
        if private:
            cmd = "UPDATE collections SET private=TRUE WHERE collection_id={}\
                    AND creator_id={}".format(int(collection_id), int(creator_id))
        else:
            cmd = "UPDATE collections SET private=False WHERE collection_id={}\
                    AND creator_id={}".format(int(collection_id), int(creator_id))
        cur.execute(cmd)
        conn.commit()
        return True
    except psycopg2.Error as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def get_collection_data(collection_id, limit, conn, cur):
    try:
        # cur.execute('SAVEPOINT save_point')
        cmd = "select collection_id, collection_name, creator_id, private, images.image_id,\
                uploader, file, created_at, tags  FROM collection_content \
                INNER JOIN images ON collection_id={} AND images.image_id=collection_content.image_id LIMIT {}".format(
            int(collection_id), int(limit))
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
