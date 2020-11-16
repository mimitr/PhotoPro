import psycopg2

num_related_photos = 3


def get_terms_and_values_for_image(image_id, conn, cur):
    try:
        cmd = "select term, value from auto_tags where image_id={} ORDER by value DESC".format(
            int(image_id)
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


def update_recommendation_term(user_id, term, value, coefficient, conn, cur):
    try:
        cmd = "select value from recommendations where user_id={} AND term ILIKE '{}'".format(
            int(user_id), term
        )
        cur.execute(cmd)
        print(cmd)
        conn.commit()

        result = cur.fetchone()
        print(result)
        if result is not None:
            new_value = float(result[0]) + value * coefficient
            cmd = "UPDATE recommendations SET value={} WHERE user_id={} AND term='{}'".format(
                new_value, int(user_id), term
            )
        else:
            new_value = value
            cmd = "INSERT INTO RECOMMENDATIONS (user_id, term, value) VALUES ({}, '{}', {})".format(
                int(user_id), term, new_value
            )

        cur.execute("SAVEPOINT save_point")
        print(cmd)
        cur.execute(cmd)
        conn.commit()

        return result

    except psycopg2.Error as e:
        print("~~~~~~~~Error in update_recommendation_term1~~~~~~~~~~~")
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print("~~~~~~~~Error in update_recommendation_term2~~~~~~~~~~~")
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def get_recommendation_photos(user_id, score, batch_size, conn, cur):
    try:
        # cmd = "select images.image_id,caption, uploader, file, title, price, created_at, tags,  num_likes,SUM(recommendations.value) as score\
        #         from num_likes_per_image RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id \
        #         JOIN auto_tags ON images.image_id=auto_tags.image_id \
        #         JOIN recommendations ON auto_tags.term=recommendations.term WHERE recommendations.user_id=1 \
        #         GROUP BY images.image_id,num_likes ORDER BY score DESC,created_at DESC".format(user_id)
        if score is not None:
            cmd = "select image_id, caption, uploader, file, title, price, created_at, tags, num_likes, score from \
                    get_recommendation_scores WHERE user_id={} AND uploader!={} AND score < {} LIMIT {}".format(
                int(user_id), int(user_id), float(score), int(batch_size)
            )
        else:
            print("~~~~~~~~~~~~~~ SCORE IS NONE ~~~~~~~~~~~~~~~~~~")
            cmd = "select image_id, caption, uploader, file, title, price, created_at, tags, num_likes, score from \
                                get_recommendation_scores WHERE user_id={} AND uploader!={} LIMIT {}".format(
                int(user_id), int(user_id), int(batch_size)
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


def get_related_images(image_id, num_images, conn, cur):
    try:
        cmd = "select img_id,count(tag) from images_with_common_tags({}) GROUP BY img_id ORDER BY count DESC LIMIT {}".format(
            image_id, num_images
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        print("get_related_images result: ", result)
        num_img_found = len(result)
        print("input image id")
        print(image_id)
        print("")
        print("number of related images")
        print(num_img_found)
        print("")
        related_imgs = []
        if num_img_found > 0:
            for img_id, count in result:
                cmd = "select image_id,uploader from images where image_id={};".format(
                    img_id
                )
                conn.commit()
                cur.execute(cmd)
                data = cur.fetchall()
                for tup in data:
                    # print(tup)
                    (id, uploader,) = tup
                    related_imgs.append(id)
                    print("related image id:")
                    print(img_id)
                    print("num of matching tags:")
                    print(count)
                    print("")

        num_extra_needed = num_images - num_img_found
        print("number of random images to pull from discovery")
        print(num_extra_needed)

        cmd = "select image_id,uploader from images LIMIT {};".format(num_extra_needed)
        conn.commit()
        cur.execute(cmd)
        data = cur.fetchall()
        for tup in data:
            # print(tup)
            (id, uploader,) = tup
            related_imgs.append(id)

        print("related")
        print(related_imgs)

        return related_imgs

    except psycopg2.Error as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False
    except Exception as e:
        print(e)
        # cur.execute('ROLLBACK TO SAVEPOINT save_point')
        return False


def get_related(user_id, image_id, conn, cur):
    cur.execute("SAVEPOINT save_point")
    try:
        num_related_images_get = 3
        relate_img_ids = get_related_images(image_id, num_related_images_get, conn, cur)

        cmd = "select images.image_id, caption, uploader, file, title, price, created_at, tags, num_likes FROM num_likes_per_image\
                    RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id\
                    WHERE (images.image_id= {} AND uploader!={}) \
                    OR (images.image_id= {} AND uploader!={})\
                    OR (images.image_id= {} AND uploader!={})\
                     ORDER BY created_at DESC LIMIT {}".format(
            int(relate_img_ids[0]),
            user_id,
            int(relate_img_ids[1]),
            user_id,
            int(relate_img_ids[2]),
            user_id,
            num_related_images_get,
        )
        print(cmd)
        cur.execute(cmd)
        conn.commit()
        data = cur.fetchall()

        length = len(data)
        if length == 0:
            return False
        else:
            return data
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False
    except psycopg2.ProgrammingError as e:
        print(e)
        cur.execute("ROLLBACK TO SAVEPOINT save_point")
        return False


def init_user_recommendation(user_id, conn, cur):
    try:
        cmd = "select term, SUM(value) as score from recommendations GROUP\
                BY term HAVING COUNT(*)>1 ORDER BY score DESC LIMIT 50"
        cur.execute(cmd)
        conn.commit()
        result = cur.fetchall()
        for i in result:
            (term, value) = i
            value = float(value)
            if value > 3:
                value = 3
            update_recommendation_term(int(user_id), term, value, 0.01, conn, cur)
        return True
    except Exception as e:
        print(e)
        conn.rollback()
        return False
    except psycopg2.Error as e:
        error = e.pgcode
        print(error)
        conn.rollback()
        return False


def get_global_recommendations(score, batch_size, conn, cur):
    try:
        # cmd = "select images.image_id,caption, uploader, file, title, price, created_at, tags,  num_likes,SUM(recommendations.value) as score\
        #         from num_likes_per_image RIGHT JOIN images ON num_likes_per_image.image_id=images.image_id \
        #         JOIN auto_tags ON images.image_id=auto_tags.image_id \
        #         JOIN recommendations ON auto_tags.term=recommendations.term WHERE recommendations.user_id=1 \
        #         GROUP BY images.image_id,num_likes ORDER BY score DESC,created_at DESC".format(user_id)
        if score is not None:
            cmd = "select image_id, caption, uploader, file, title, price, created_at, tags, num_likes, score from \
                    get_global_recommendation_scores WHERE score < {} ORDER BY score DESC, created_at DESC LIMIT {}".format(
                float(score), int(batch_size)
            )
        else:
            print("~~~~~~~~~~~~~~ SCORE IS NONE ~~~~~~~~~~~~~~~~~~")
            cmd = "select image_id, caption, uploader, file, title, price, created_at, tags, num_likes, score from \
                                get_global_recommendation_scores ORDER BY score DESC, created_at DESC LIMIT {}".format(
                int(batch_size)
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
