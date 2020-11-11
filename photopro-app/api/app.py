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
    remove_tag,
    delete_image_post,
)
from utils.database.connect import (
    conn,
    cur,
    connImages,
    curImages,
    connImages2,
    curImages2,
)
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
    get_like_notification,
    get_comment_notification,
    get_user_timestamp,
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

print(conn, cur)

app = Flask(__name__)
app.user_id = None
app.last_query = ""
app.start_point = 0
CORS(app)


@app.route("/login", methods=["GET", "POST"])
def api_login():
    email = request.args.get("email")
    password = request.args.get("password")
    print(email, password)

    (result, user_id) = login_user(email, password, conn, cur)
    print(result, user_id)

    app.user_id = user_id

    return jsonify({"result": result, "user_id": user_id})


@app.route("/create_user")
def api_create_user():
    first = request.args.get("first")
    last = request.args.get("last")
    email = request.args.get("email")
    password = request.args.get("password")

    result = create_user(first, last, email, password, conn, cur)
    if result:
        (result, user_id) = login_user(email, password, conn, cur)
        print(result, user_id)
        app.user_id = user_id
        return jsonify({"result": result})

    return jsonify({"result": result})


@app.route("/change_password")
def api_change_password():
    email = request.args.get("email")
    password = request.args.get("password")
    new_password = request.args.get("new_password")
    result = change_password(email, password, new_password, conn, cur)

    return {"result": result}


@app.route("/forgot_password_get_change_password_link")
def api_forgot_password():
    email = request.args.get("email")
    result = forgot_password_get_change_password_link(email, conn, cur)

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

        result = post_image(user_id, caption, image, title, price, tags, conn, cur)

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
        result = search_by_tag(
            user_id, batch_size, query, start_point, connImages, curImages
        )
    else:
        print("==================== QUERY IS NONE =======================")
        result = discovery(user_id, batch_size, start_point, connImages2, curImages2)

    if not result:
        result = discovery_with_search_term(
            user_id, batch_size, query, start_point, connImages, curImages
        )

        if not result:
            return jsonify({"result": False})
        processed_result = []

        try:
            start_point_before_iteration = app.start_point
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
    user_id = app.user_id
    if user_id is None:
        return jsonify({"result": False})
    batch_size = int(request.args.get("batch_size"))
    if batch_size is None or batch_size <= 0:
        batch_size = 32

    result = profiles_photos(user_id, batch_size, conn, cur)

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
    result = edit_post(app.user_id, image_id, title, price, caption, tags, conn, cur)

    return jsonify({"result": result})


@app.route("/post_like_to_image", methods=["GET", "POST"])
def api_post_like_to_image():
    image_id = request.args.get("image_id")
    user_id = app.user_id
    if image_id is not None and user_id is not None:
        result = post_like(image_id, user_id, conn, cur)
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/delete_like_from_image", methods=["GET", "POST"])
def api_delete_like_from_image():
    image_id = request.args.get("image_id")
    user_id = app.user_id
    if image_id is not None and user_id is not None:
        result = delete_like(image_id, user_id, conn, cur)
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/get_num_likes_of_image")
def api_get_num_likes_of_image():
    image_id = request.args.get("image_id")
    if image_id is not None and app.user_id is not None:
        result = get_num_likes(image_id, conn, cur)
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/delete_image_post")
def api_delete_image_post():
    image_id = request.args.get("image_id")
    user_id = app.user_id
    if image_id is not None and user_id is not None:
        result = delete_image_post(image_id, user_id, conn, cur)
        return jsonify({"result": result})
    return jsonify({"result": False})


@app.route("/get_likers_of_image")
def api_get_likers_of_image():
    image_id = request.args.get("image_id")
    limit = request.args.get("batch_size")
    if image_id is not None and app.user_id is not None and limit is not None:
        print("=======================================")
        result = get_likers(int(image_id), int(limit), conn, cur)
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


@app.route("/fetch_notification")
def api_fetch_notifications():
    user_id = app.user_id
    timestamp = get_user_timestamp(user_id, conn, cur)

    like_notifs = get_like_notification(user_id, timestamp, conn, cur)
    comment_notifs = get_comment_notification(user_id, timestamp, conn, cur)

    results = []

    if like_notifs != False:
        for tup in like_notifs:
            title, image, liker, created_at = tup
            created_at = created_at.strftime("%Y/%m/%d, %H:%M:%S")
            results.append(
                {
                    "title": title,
                    "image_id": image,
                    "liker": liker,
                    "created_at": created_at,
                }
            )
    if comment_notifs != False:
        for tup in comment_notifs:
            title, image, commenter, comment, created_at = tup
            created_at = created_at.strftime("%Y/%m/%d, %H:%M:%S")
            results.append(
                {
                    "title": title,
                    "image_id": image,
                    "commenter": commenter,
                    "comment": comment,
                    "created_at": created_at,
                }
            )
    if results:
        results = sorted(results, key=lambda x: x["created_at"], reverse=True)
        return jsonify({"notifications": results})

    return jsonify({"notifications": False})


@app.route("/post_comment_to_image", methods=["GET", "POST"])
def api_post_comment_to_image():
    image_id = request.args.get("image_id")
    commenter = app.user_id
    comment = request.args.get("comment")
    if image_id is None or comment is None or commenter is None:
        return jsonify({"result": False})
    else:
        result = post_comment_to_image(image_id, commenter, comment, conn, cur)
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
        result = post_comment_to_comment(
            image_id, commenter, comment, comment_id, conn, cur
        )
        return jsonify({"result": result})
    return jsonify({"result": result})


@app.route("/post_delete_comment", methods=["GET", "POST"])
def api_delete_comment():
    comment_id = request.args.get("comment_id")
    user_id = app.user_id
    if comment_id is None or user_id is None:
        return jsonify({"result": False})
    else:
        result = delete_comment(comment_id, user_id, conn, cur)
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
        result = get_comments_to_image(image_id, batch_size, conn, cur)
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
        result = get_comments_to_comment(comment_id, batch_size, conn, cur)
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
    result = get_tags(image_id, conn, cur)
    return jsonify({"result": result})


@app.route("/add_tags")
def api_add_tags():
    image_id = request.args.get("image_id")
    tags = request.args.get("tags")
    tags = tags.split(",")
    if image_id is None or tags is None:
        return jsonify({"result": False})

    result = add_tags(app.user_id, image_id, tags, conn, cur)
    return jsonify({"result": result})


@app.route("/remove_tag")
def api_remove_tag():
    image_id = request.args.get("image_id")
    tag = request.args.get("tag")
    if image_id is None or tag is None:
        return jsonify({"result": False})

    result = remove_tag(app.user_id, image_id, tag, conn, cur)
    return jsonify({"result": result})


@app.route("/create_collection", methods=["GET", "POST"])
def api_create_collection():
    collection_name = request.args.get("collection_name")
    private = request.args.get("private")
    user_id = app.user_id

    if user_id is None or collection_name is None or private is None:
        return jsonify({"result": False})
    result = create_collection(
        int(user_id), str(collection_name), bool(int(private)), conn, cur
    )
    return jsonify({"result": result})


@app.route("/delete_collection", methods=["GET", "POST"])
def api_delete_collection():
    collection_id = request.args.get("collection_id")
    user_id = app.user_id

    if user_id is None or collection_id is None:
        return jsonify({"result": False})
    result = delete_collection(int(collection_id), int(user_id), conn, cur)
    return jsonify({"result": result})


@app.route("/add_photo_to_collection", methods=["GET", "POST"])
def api_add_photo_to_collection():
    collection_id = request.args.get("collection_id")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if user_id is None or collection_id is None or image_id is None:
        return jsonify({"result": False})
    result = add_photo_to_collection(
        int(collection_id), int(user_id), int(image_id), conn, cur
    )
    return jsonify({"result": result})


@app.route("/delete_photo_from_collection", methods=["GET", "POST"])
def api_delete_photo_from_collection():
    collection_id = request.args.get("collection_id")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if user_id is None or collection_id is None or image_id is None:
        return jsonify({"result": False})
    result = delete_photo_from_collection(
        int(collection_id), int(image_id), int(user_id), conn, cur
    )
    return jsonify({"result": result})


@app.route("/update_collections_private", methods=["GET", "POST"])
def api_update_collections_private():
    collection_id = request.args.get("collection_id")
    private = request.args.get("private")
    user_id = app.user_id

    if user_id is None or collection_id is None or private is None:
        return jsonify({"result": False})
    result = update_collections_private(
        int(collection_id), bool(int(private)), int(user_id), conn, cur
    )
    return jsonify({"result": result})


@app.route("/get_users_collection")
def api_get_users_collection():
    limit = request.args.get("batch_size")
    user_id = app.user_id
    if limit is None:
        limit = 32

    if user_id is None and limit is not None:
        return jsonify({"result": False})

    result = get_users_collection(user_id, limit, conn, cur)

    if result:

        processed_result = []

        for tup in result:
            collection_id, collection_name, creator_id, private, num_photos = tup
            if num_photos is None:
                num_photos = 0
            num_photos = int(num_photos)
            processed_result.append(
                {
                    "collection_id": collection_id,
                    "collection_name": collection_name,
                    "creator_id": creator_id,
                    "private": private,
                    "num_photos": num_photos,
                }
            )
        retval = jsonify({"result": processed_result})
        print(retval)
        return retval

    else:
        return jsonify({"result": False})


@app.route("/get_collection_data")
def api_get_collection_data():
    collection_id = request.args.get("collection_id")
    limit = request.args.get("batch_size")
    user_id = app.user_id
    if limit is None:
        limit = 32

    if user_id is None and limit is not None and collection_id is not None:
        return jsonify({"result": False})
    result = get_collection_data(collection_id, limit, conn, cur)

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
