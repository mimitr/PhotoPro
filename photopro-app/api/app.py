#!/usr/bin/env python
from utils.database.comments import (
    post_comment_to_image,
    post_comment_to_comment,
    delete_comment,
    get_comments_to_image,
    get_comments_to_image,
    get_comments_to_comment,
)
from utils.database.watermark import apply_watermark
from utils.database.general_user import (
    create_user,
    login_user,
    change_password,
    forgot_password_get_change_password_link,
    post_image,
    discovery,
    discovery_with_search_term,
    search_by_tag,
    edit_post,
    profiles_photos,
    add_tags,
    get_tags,
    get_username_by_id,
    get_post_title_by_id,
    remove_tag,
    delete_image_post,
    set_user_timestamp,
)
from utils.database.connect import get_conn_and_cur
from utils.database.follows import follow, unfollow, is_following, get_followers

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import sys
import base64
import random
import os
import PIL

for i in sys.path:
    print(i)

from utils.database.likes import post_like, get_num_likes, get_likers, delete_like
from utils.database.watermark import apply_watermark
from utils.database.notifications import (
    send_notification,
    fetch_notification,
    clear_notification,
)
from utils.database.comments import (
    post_comment_to_image,
    post_comment_to_comment,
    delete_comment,
    get_comments_to_image,
    get_comments_to_image,
    get_comments_to_comment,
)

from utils.database.collections import (
    create_collection,
    add_photo_to_collection,
    get_users_collection,
    get_collection_data,
    delete_collection,
    delete_photo_from_collection,
    update_collections_private,
)

from utils.database.user_purchases import (
    add_purchase,
    delete_item_from_cart,
    get_user_purchases,
    update_user_purchases_details,
)


app = Flask(__name__)
app.user_id = None
app.last_query = ""
app.start_point = 0
CORS(app)


@app.route("/login", methods=["GET", "POST"])
def api_login():
    conn, cur = get_conn_and_cur()
    email = request.args.get("email")
    password = request.args.get("password")
    print(email, password)

    (result, user_id) = login_user(email, password, conn, cur)
    print(result, user_id)

    app.user_id = user_id

    conn.close()

    return jsonify({"result": result, "user_id": user_id})


@app.route("/create_user", methods=["GET", "POST"])
def api_create_user():
    conn, cur = get_conn_and_cur()
    first = request.args.get("first")
    last = request.args.get("last")
    email = request.args.get("email")
    password = request.args.get("password")
    username = request.args.get("username")
    if username is None:
        username = str(str(first) + " " + str(last))
    print(username)

    result = create_user(first, last, email, password, username, conn, cur)
    if result:
        (result, user_id) = login_user(email, password, conn, cur)
        print(result, user_id)
        app.user_id = user_id
        conn.close()
        return jsonify({"result": result})
    conn.close()
    return jsonify({"result": result})


@app.route("/change_password", methods=["GET", "POST"])
def api_change_password():
    conn, cur = get_conn_and_cur()
    email = request.args.get("email")
    password = request.args.get("password")
    new_password = request.args.get("new_password")
    result = change_password(email, password, new_password, conn, cur)
    conn.close()
    return {"result": result}


@app.route("/forgot_password_get_change_password_link", methods=["GET", "POST"])
def api_forgot_password():
    conn, cur = get_conn_and_cur()
    email = request.args.get("email")
    result = forgot_password_get_change_password_link(email, conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/post", methods=["POST"])
@cross_origin(supports_credentials=True)
def api_post_image():
    if request.method == "POST":
        user_id = app.user_id
        if user_id is None:
            return jsonify({"result": False})
        caption = request.form["caption"]
        image = request.form["image"]
        price = str(request.form["price"])
        title = request.form["title"]
        tags = str(request.form["tags"])
        tags = tags.split(",")

        print(price, title)

        image = image.split(",")[-1]
        image = base64.b64decode(image)
        conn, cur = get_conn_and_cur()
        result = post_image(user_id, caption, image, title, price, tags, conn, cur)
        if result:
            followers = get_followers(int(user_id), conn, cur)
            if followers:
                for tup in followers:
                    (follower,) = tup
                    print("~~~~~~~~~~~ Post photo notification sent ~~~~~~~~~~~~~")
                    send_notification(
                        int(follower), int(user_id), "posted", int(result), conn, cur
                    )
        conn.close()
        return jsonify({"result": result})


@app.route("/discovery")
def api_discovery():

    user_id = request.args.get("user_id")
    if user_id == None:
        user_id = 0
    batch_size = request.args.get("batch_size")
    query = request.args.get("query")

    print(
        "++++++++++++++++++++++ DISCOVERY API CALLED - %s ++++++++++++++++++++++++++++++"
        % query
    )
    start_point = 0

    if app.last_query == query:
        print("------------------ last query === query ----------------------")
        start_point = app.start_point
    else:
        print("---------------------- app.start_point reset to 0 ------------------")
        app.start_point = 0
    app.last_query = query
    if query is not None:
        connImages, curImages = get_conn_and_cur()
        result = search_by_tag(
            user_id, batch_size, query, start_point, connImages, curImages
        )
        if result:
            connImages.close()
    else:
        connImages2, curImages2 = get_conn_and_cur()
        print("==================== QUERY IS NONE =======================")
        result = discovery(user_id, batch_size, start_point, connImages2, curImages2)
        connImages2.close()
    start_point_before_iteration = app.start_point
    if not result:
        result = discovery_with_search_term(
            user_id, batch_size, query, start_point, connImages, curImages
        )
        connImages.close()
        if not result:
            return jsonify({"result": False})
        processed_result = []
        try:
            for tup in result:
                if query != app.last_query:  # bug fix for rapid searching
                    print(
                        "=============== THIS REQUEST FOR - %s - HAS BEEN CANCELLED ============="
                        % query
                    )
                    app.start_point = 0
                    return jsonify({"result": False})

                print(tup)
                (
                    id,
                    caption,
                    uploader,
                    img,
                    title,
                    price,
                    created_at,
                    tags,
                    num_likes,
                ) = tup
                if not num_likes:
                    num_likes = 0
                print(num_likes)
                file = "image.jpeg"
                photo = open(file, "wb")
                photo.write(img)
                photo.close()
                img = apply_watermark(file).getvalue()
                img = base64.encodebytes(img).decode("utf-8")

                print("id - %d, start_point - %d" % (id, app.start_point))
                if id > app.start_point:
                    app.start_point = id
                    processed_result.append(
                        {
                            "id": id,
                            "caption": caption,
                            "uploader": uploader,
                            "img": img,
                            "title": title,
                            "price": str(price),
                            "created_at": created_at,
                            "num_likes": num_likes,
                            "tags": tags,
                        }
                    )
                    print("processed result appended to %d" % len(processed_result))
        except PIL.UnidentifiedImageError as e:
            print("=================== Unidentified image error ===================")
            print(e)
            print("===========================================================")

        if len(processed_result) > 0:
            retval = jsonify({"result": processed_result})
            print(retval)
            return retval
        else:
            print("---------------- HEREE -------------------")
            return jsonify({"result": False})

    elif result:

        processed_result = []

        try:
            for tup in result:
                if query != app.last_query:  # bug fix for rapid searching
                    print(
                        "=============== THIS REQUEST FOR - %s - HAS BEEN CANCELLED ============="
                        % query
                    )
                    app.start_point = start_point_before_iteration
                    return jsonify({"result": False})
                print(tup)
                (
                    id,
                    caption,
                    uploader,
                    img,
                    title,
                    price,
                    created_at,
                    tags,
                    num_likes,
                ) = tup
                if not num_likes:
                    num_likes = 0
                print(num_likes)
                file = "image.jpeg"
                photo = open(file, "wb")
                photo.write(img)
                photo.close()
                img = apply_watermark(file).getvalue()
                img = base64.encodebytes(img).decode("utf-8")
                if id > app.start_point:
                    app.start_point = id
                    processed_result.append(
                        {
                            "id": id,
                            "caption": caption,
                            "uploader": uploader,
                            "img": img,
                            "title": title,
                            "price": str(price),
                            "created_at": created_at,
                            "num_likes": num_likes,
                            "tags": tags,
                        }
                    )

        except PIL.UnidentifiedImageError as e:
            print(e)
        if len(processed_result) > 0:
            retval = jsonify({"result": processed_result})
            print(retval)
            return retval
        else:
            return jsonify({"result": False})
    else:
        return jsonify({"result": False})


@app.route("/profile_photos")
def api_profile_photos():

    user_id = request.args.get("user_id")
    batch_size = int(request.args.get("batch_size"))

    if user_id is None:
        return jsonify({"result": False})

    if batch_size is None or batch_size <= 0:
        batch_size = 32

    conn, cur = get_conn_and_cur()
    result = profiles_photos(user_id, batch_size, conn, cur)
    conn.close()

    if result:

        processed_result = []

        for tup in result:
            id, caption, uploader, img, title, price, created_at, tags, num_likes = tup
            if not num_likes:
                num_likes = 0
            file = "image.jpeg"
            photo = open(file, "wb")
            photo.write(img)
            photo.close()
            img = apply_watermark(file).getvalue()
            img = base64.encodebytes(img).decode("utf-8")
            processed_result.append(
                {
                    "id": id,
                    "caption": caption,
                    "uploader": uploader,
                    "img": img,
                    "title": title,
                    "price": str(price),
                    "created_at": created_at,
                    "num_likes": num_likes,
                    "tags": tags,
                }
            )

        # print(imgarr[0])

        retval = jsonify({"result": processed_result})
        print(retval)
        return retval
    else:
        return jsonify({"result": False})


@app.route("/edit_post")
def api_edit_post():
    image_id = request.args.get("image_id")
    title = request.args.get("title")
    price = int(request.args.get("price"))
    caption = request.args.get("caption")
    tags = request.args.get("tags")
    conn, cur = get_conn_and_cur()
    result = edit_post(app.user_id, image_id, title, price, caption, tags, conn, cur)
    conn.close()

    return jsonify({"result": result})


@app.route("/post_like_to_image", methods=["GET", "POST"])
def api_post_like_to_image():
    image_id = request.args.get("image_id")
    user_id = app.user_id
    if image_id is not None and user_id is not None:
        conn, cur = get_conn_and_cur()
        result = post_like(image_id, user_id, conn, cur)
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/delete_like_from_image", methods=["GET", "POST"])
def api_delete_like_from_image():
    image_id = request.args.get("image_id")
    user_id = app.user_id
    if image_id is not None and user_id is not None:
        conn, cur = get_conn_and_cur()
        result = delete_like(image_id, user_id, conn, cur)
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/get_num_likes_of_image")
def api_get_num_likes_of_image():
    image_id = request.args.get("image_id")
    if image_id is not None and app.user_id is not None:
        conn, cur = get_conn_and_cur()
        result = get_num_likes(image_id, conn, cur)
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/delete_image_post")
def api_delete_image_post():
    image_id = request.args.get("image_id")
    user_id = app.user_id
    if image_id is not None and user_id is not None:
        conn, cur = get_conn_and_cur()
        result = delete_image_post(image_id, user_id, conn, cur)
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/get_likers_of_image")
def api_get_likers_of_image():
    image_id = request.args.get("image_id")
    limit = request.args.get("batch_size")
    if image_id is not None and app.user_id is not None and limit is not None:
        print("=======================================")
        conn, cur = get_conn_and_cur()
        result = get_likers(int(image_id), int(limit), conn, cur)
        conn.close()
        print("=======================================")
        if result != False:
            processed_result = []
            for tup in result:
                print(tup)
                id, first, last = tup
                processed_result.append(
                    {"user_id": id, "first_name": first, "last_name": last}
                )

            return jsonify({"result": processed_result})
    return jsonify({"result": False})


@app.route("/send_notification")
def api_send_notification():
    uploader_id = request.args.get("uploader_id")
    notif_type = request.args.get("notification")
    image_id = request.args.get("image_id")
    sender_id = app.user_id  # assumes that logged in user comments or likes image

    if uploader_id is not None and sender_id is not None and notif_type is not None:
        conn, cur = get_conn_and_cur()
        result = send_notification(
            uploader_id, sender_id, notif_type, image_id, conn, cur
        )
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/fetch_notification")
def api_fetch_notification():
    uploader_id = app.user_id
    if uploader_id is not None:
        conn, cur = get_conn_and_cur()
        result = fetch_notification(uploader_id, conn, cur)
        conn.close()
        if result != False:
            processed = []
            conn, cur = get_conn_and_cur()
            for tup in result:
                print(tup)
                uploader, sender, notification, timestamp, image_id = tup
                user = get_username_by_id(int(sender), conn, cur)
                if user == False:
                    user = sender

                title = image_id
                if image_id != None:
                    title = get_post_title_by_id(int(image_id), conn, cur)
                if title == False:
                    title = image_id

                processed.append(
                    {
                        "uploader": uploader,
                        "sender": user,
                        "type": notification,
                        "timestamp": timestamp,
                        "image_id": title,
                    }
                )
            conn.close()
            return jsonify({"result": processed})
    return jsonify({"result": False})


@app.route("/clear_notifications")
def api_clear_notification():
    uploader_id = app.user_id
    if uploader_id is not None:
        conn, cur = get_conn_and_cur()
        result = clear_notification(uploader_id, conn, cur)
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/set_last_active", methods=["POST"])
def api_set_last_active():
    user_id = app.user_id
    conn, cur = get_conn_and_cur()
    result = set_user_timestamp(user_id, conn, cur)
    conn.close()
    print("~~~~~~~~~~~~~~~~~~ set_user_timestamp returned - %s" % result)
    return jsonify({"result": result})


@app.route("/post_comment_to_image", methods=["GET", "POST"])
def api_post_comment_to_image():
    image_id = request.args.get("image_id")
    commenter = app.user_id
    comment = request.args.get("comment")
    if image_id is None or comment is None or commenter is None:
        return jsonify({"result": False})
    else:
        conn, cur = get_conn_and_cur()
        result = post_comment_to_image(image_id, commenter, comment, conn, cur)
        conn.close()
        return jsonify({"result": result})


@app.route("/post_comment_to_comment", methods=["GET", "POST"])
def api_post_comment_to_comment():
    image_id = request.args.get("image_id")
    comment_id = request.args.get("comment_id")
    commenter = app.user_id
    comment = request.args.get("comment")

    if image_id is None or comment_id is None or comment is None or commenter is None:
        return jsonify({"result": False})
    else:
        conn, cur = get_conn_and_cur()
        result = post_comment_to_comment(
            image_id, commenter, comment, comment_id, conn, cur
        )
        conn.close()
        return jsonify({"result": result})
    return jsonify({"result": result})


@app.route("/post_delete_comment", methods=["GET", "POST"])
def api_delete_comment():
    comment_id = request.args.get("comment_id")
    user_id = app.user_id
    if comment_id is None or user_id is None:
        return jsonify({"result": False})
    else:
        conn, cur = get_conn_and_cur()
        result = delete_comment(comment_id, user_id, conn, cur)
        conn.close()
        return jsonify({"result": result})


@app.route("/get_comments_to_image", methods=["GET", "POST"])
def api_get_comments_to_image():
    print(
        "++++++++++++++++++++++++ API CALL - get_comments_to_image ++++++++++++++++++++++++"
    )
    image_id = request.args.get("image_id")
    batch_size = request.args.get("batch_size")
    print("+++++++++++++ image_id - %s +++++++++++" % image_id)
    if image_id is None or batch_size is None:
        return jsonify({"result": False})
    else:
        conn, cur = get_conn_and_cur()
        result = get_comments_to_image(image_id, batch_size, conn, cur)
        conn.close()
        if not result:
            return jsonify({"result": result})
        else:
            processed_result = []
            for tup in result:
                (
                    comment_id,
                    image_id,
                    commenter,
                    comment,
                    reply_id,
                    created_at,
                    count,
                ) = tup
                if count is None:
                    count = 0
                processed_result.append(
                    {
                        "comment_id": comment_id,
                        "image_id": image_id,
                        "commenter": commenter,
                        "comment": comment,
                        "reply_id": reply_id,
                        "created_at": created_at,
                        "count": count,
                    }
                )
            return jsonify({"result": processed_result})


@app.route("/get_comments_to_comment", methods=["GET", "POST"])
def api_get_comments_to_comment():
    comment_id = request.args.get("comment_id")
    batch_size = request.args.get("batch_size")
    if comment_id is None or batch_size is None:
        return jsonify({"result": False})
    else:
        conn, cur = get_conn_and_cur()
        result = get_comments_to_comment(comment_id, batch_size, conn, cur)
        conn.close()
        if not result:
            return jsonify({"result": result})
        else:
            processed_result = []
            for tup in result:
                (
                    comment_id,
                    image_id,
                    commenter,
                    comment,
                    reply_id,
                    created_at,
                    count,
                ) = tup
                if count is None:
                    count = 0
                processed_result.append(
                    {
                        "comment_id": comment_id,
                        "image_id": image_id,
                        "commenter": commenter,
                        "comment": comment,
                        "reply_id": reply_id,
                        "created_at": created_at,
                        "count": count,
                    }
                )
            return jsonify({"result": processed_result})


@app.route("/get_tags")
def api_get_tags():
    image_id = request.args.get("image_id")
    if image_id is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = get_tags(image_id, conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/add_tags")
def api_add_tags():
    image_id = request.args.get("image_id")
    tags = request.args.get("tags")
    tags = tags.split(",")
    if image_id is None or tags is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = add_tags(app.user_id, image_id, tags, conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/remove_tag")
def api_remove_tag():
    image_id = request.args.get("image_id")
    tag = request.args.get("tag")
    if image_id is None or tag is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = remove_tag(app.user_id, image_id, tag, conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/create_collection", methods=["GET", "POST"])
def api_create_collection():
    collection_name = request.args.get("collection_name")
    private = request.args.get("private")
    user_id = app.user_id

    if user_id is None or collection_name is None or private is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = create_collection(
        int(user_id), str(collection_name), bool(int(private)), conn, cur
    )
    conn.close()
    return jsonify({"result": result})


@app.route("/delete_collection", methods=["GET", "POST"])
def api_delete_collection():
    collection_id = request.args.get("collection_id")
    user_id = app.user_id

    if user_id is None or collection_id is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = delete_collection(int(collection_id), int(user_id), conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/add_photo_to_collection", methods=["GET", "POST"])
def api_add_photo_to_collection():
    collection_id = request.args.get("collection_id")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if user_id is None or collection_id is None or image_id is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = add_photo_to_collection(
        int(collection_id), int(user_id), int(image_id), conn, cur
    )
    conn.close()
    return jsonify({"result": result})


@app.route("/delete_photo_from_collection", methods=["GET", "POST"])
def api_delete_photo_from_collection():
    collection_id = request.args.get("collection_id")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if user_id is None or collection_id is None or image_id is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = delete_photo_from_collection(
        int(collection_id), int(image_id), int(user_id), conn, cur
    )
    conn.close()
    return jsonify({"result": result})


@app.route("/update_collections_private", methods=["GET", "POST"])
def api_update_collections_private():
    collection_id = request.args.get("collection_id")
    private = request.args.get("private")
    user_id = app.user_id

    if user_id is None or collection_id is None or private is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = update_collections_private(
        int(collection_id), bool(int(private)), int(user_id), conn, cur
    )
    conn.close()
    return jsonify({"result": result})


@app.route("/get_users_collection")
def api_get_users_collection():
    user_id = request.args.get("user_id")
    limit = request.args.get("batch_size")

    if limit is None:
        limit = 32

    if user_id is None and limit is not None:
        return jsonify({"result": False})

    conn, cur = get_conn_and_cur()
    result = get_users_collection(user_id, limit, conn, cur)
    conn.close()

    if result:

        processed_result = []

        for tup in result:
            collection_id, collection_name, creator_id, private, num_photos, img = tup
            if num_photos is None:
                num_photos = 0
            num_photos = int(num_photos)
            if img:
                file = "image.jpeg"
                photo = open(file, "wb")
                photo.write(img)
                photo.close()
                img = apply_watermark(file).getvalue()
                img = base64.encodebytes(img).decode("utf-8")
            else:
                img = ""
            processed_result.append(
                {
                    "collection_id": collection_id,
                    "collection_name": collection_name,
                    "creator_id": creator_id,
                    "private": private,
                    "num_photos": num_photos,
                    "img": img,
                }
            )
        retval = jsonify({"result": processed_result})
        print(retval)
        return retval

    else:
        return jsonify({"result": False})


@app.route("/get_collection_data")
def api_get_collection_data():
    user_id = app.user_id
    collection_id = request.args.get("collection_id")
    limit = request.args.get("batch_size")

    if limit is None:
        limit = 32

    if user_id is None and limit is not None and collection_id is not None:
        return jsonify({"result": False})

    conn, cur = get_conn_and_cur()
    result = get_collection_data(collection_id, limit, conn, cur)
    conn.close()

    if result:

        processed_result = []

        for tup in result:
            (
                collection_id,
                collection_name,
                creator_id,
                private,
                img_id,
                img_caption,
                uploader,
                img,
                title,
                price,
                created_at,
                tags,
                num_likes,
            ) = tup
            if not num_likes:
                num_likes = 0
            file = "image.jpeg"
            photo = open(file, "wb")
            photo.write(img)
            photo.close()
            img = apply_watermark(file).getvalue()
            img = base64.encodebytes(img).decode("utf-8")
            processed_result.append(
                {
                    "collection_id": collection_id,
                    "collection_name": collection_name,
                    "creator_id": creator_id,
                    "private": private,
                    "id": img_id,
                    "caption": img_caption,
                    "uploader": uploader,
                    "img": img,
                    "title": title,
                    "price": str(price),
                    "created_at": created_at,
                    "num_likes": num_likes,
                    "tags": tags,
                }
            )
        retval = jsonify({"result": processed_result})
        print(retval)
        return retval

    return jsonify({"result": result})


@app.route("/follow", methods=["GET", "POST"])
def api_follow():
    to_follow = request.args.get("to_follow")
    user_id = app.user_id

    if user_id is None or to_follow is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = follow(int(user_id), int(to_follow), conn, cur)
    if result:
        send_notification(int(to_follow), int(user_id), "follow", None, conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/unfollow", methods=["GET", "POST"])
def api_unfollow():
    following = request.args.get("following")
    user_id = app.user_id

    if user_id is None or following is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = unfollow(int(user_id), int(following), conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/is_following", methods=["GET", "POST"])
def api_is_following():
    following = request.args.get("following")
    user_id = app.user_id

    if user_id is None or following is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = is_following(int(user_id), int(following), conn, cur)
    conn.close()
    return jsonify({"result": result})


@app.route("/add_purchase", methods=["GET", "POST"])
def api_add_purchase():
    save_for_later = request.args.get("save_for_later")
    purchased = request.args.get("purchased")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if (
        user_id is None
        or purchased is None
        or image_id is None
        or save_for_later is None
    ):
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = add_purchase(
        int(user_id),
        int(image_id),
        bool(int(save_for_later)),
        bool(int(purchased)),
        conn,
        cur,
    )
    return jsonify({"result": result})


@app.route("/delete_item_from_cart", methods=["GET", "POST"])
def api_delete_item_from_cart():
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if user_id is None or image_id is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = delete_item_from_cart(int(user_id), int(image_id), conn, cur)
    return jsonify({"result": result})


@app.route("/get_user_purchases", methods=["GET", "POST"])
def api_get_user_purchases():
    user_id = app.user_id
    save_for_later = request.args.get("save_for_later")
    purchased = request.args.get("purchased")

    if user_id is None or save_for_later is None or purchased is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = get_user_purchases(
        int(user_id), bool(int(save_for_later)), bool(int(purchased)), conn, cur
    )
    conn.close()
    if result:

        processed_result = []

        for tup in result:
            (
                user_id,
                image_id,
                save_for_later,
                purchased,
                title,
                caption,
                price,
                img,
            ) = tup
            file = "image.jpeg"
            photo = open(file, "wb")
            photo.write(img)
            photo.close()
            img = apply_watermark(file).getvalue()
            img = base64.encodebytes(img).decode("utf-8")
            processed_result.append(
                {
                    "user_id": user_id,
                    "image_id": image_id,
                    "save_for_later": save_for_later,
                    "purchased": purchased,
                    "title": title,
                    "caption": caption,
                    "price": str(price),
                    "img": img,
                }
            )
        # print("+++++++++++++PROCESSED RESULT+++++++++++++++")
        # print(processed_result)
        retval = jsonify({"result": processed_result})
        return retval
    return jsonify({"result": result})


@app.route("/update_user_purchases_details", methods=["GET", "POST"])
def api_update_user_purchases_details():
    save_for_later = request.args.get("save_for_later")
    purchased = request.args.get("purchased")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if (
        user_id is None
        or purchased is None
        or image_id is None
        or save_for_later is None
    ):
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = update_user_purchases_details(
        int(user_id),
        int(image_id),
        bool(int(save_for_later)),
        bool(int(purchased)),
        conn,
        cur,
    )
    conn.close()
    return jsonify({"result": result})


@app.route("/download")
def api_download():
    image_id = request.args.get("image_id")
    if not image_id:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = download_image(image_id, conn, cur)
    return jsonify({"result": result})


@app.route("/get_user_username", methods=["GET", "POST"])
def api_get_user_username():
    uid = request.args.get("user_id")

    if uid is None:
        return jsonify({"result": False})
    conn, cur = get_conn_and_cur()
    result = get_username_by_id(int(uid), conn, cur,)
    conn.close()
    return jsonify({"result": result})

