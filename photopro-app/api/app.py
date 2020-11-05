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
    edit_post,
    profiles_photos,
    add_tags,
    get_tags,
    remove_tag,
    delete_image_post
)
from utils.database.connect import conn, cur
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import sys
import base64

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
    get_collection_data
)

print(conn, cur)

app = Flask(__name__)
app.user_id = None
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
        tags = tags.split(',')

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
    print("START QUERY")
    if query is not None:
        result = discovery_with_search_term(user_id, batch_size, query, conn, cur)
    else:
        result = discovery(user_id, batch_size, conn, cur)
    print("END QUERY")
    if result:

        processed_result = []

        for tup in result:
            id, caption, uploader, img, title, price, num_likes, created_at = tup
            if not num_likes:
                num_likes = 0
            file = "image.jpeg"
            photo = open(file, "wb")
            photo.write(img)
            photo.close()
            img = apply_watermark(file).getvalue()
            img = base64.encodebytes(img).decode("utf-8")
            # print(img)
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
                }
            )

        # print(imgarr[0])

        retval = jsonify({"result": processed_result})
        print(retval)
        return retval
    else:
        return jsonify({"result": False})


@app.route("/profile_photos")
def api_profile_photos():
    user_id = app.user_id
    if user_id is None:
        return jsonify({"result": False})
    batch_size = request.args.get("batch_size")
    if batch_size is None:
        batch_size = -1

    result = profiles_photos(user_id, batch_size, conn, cur)

    if result:

        processed_result = []

        for tup in result:
            id, caption, uploader, img, title, price, num_likes, created_at = tup
            if not num_likes:
                num_likes = 0
            file = "image.jpeg"
            photo = open(file, "wb")
            photo.write(img)
            photo.close()
            img = apply_watermark(file).getvalue()
            img = base64.encodebytes(img).decode("utf-8")
            # print(img)
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


@app.route("/delete_like_from_image")
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
        result = get_likers(image_id, limit, conn, cur)

        processed_result = []
        for tup in result:
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
        result = post_comment_to_comment(image_id, commenter, comment, comment_id, conn, cur)
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
    image_id = request.args.get("image_id")
    batch_size = request.args.get("batch_size")
    if image_id is None or batch_size is None:
        print("no params")
        return jsonify({"result": False})
    else:
        print("yes params?")
        result = get_comments_to_image(image_id, batch_size, conn, cur)
        if not result:
            return jsonify({"result": result})
        else:
            processed_result = []
            for tup in result:
                comment_id, image_id, commenter, comment, reply_id, created_at, count = tup
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
                        'count': count
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
                comment_id, image_id, commenter, comment, reply_id, created_at, count = tup
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
                        'count': count
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
    tags = tags.split(',')
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


@app.route("/create_collection")
def api_create_collection():
    collection_name = request.args.get("collection_name")
    private = request.args.get("private")
    user_id = app.user_id

    if user_id is None or collection_name is None or private is None:
        return jsonify({"result": False})
    result = create_collection(int(user_id), str(collection_name), bool(private), conn, cur)
    return jsonify({"result": result})


@app.route("/add_photo_to_collection")
def api_add_photo_to_collection():
    collection_id = request.args.get("collection_id")
    image_id = request.args.get("image_id")
    user_id = app.user_id

    if user_id is None or collection_id is None or image_id is None:
        return jsonify({"result": False})
    result = add_photo_to_collection(int(user_id), int(collection_id), int(image_id), conn, cur)
    return jsonify({"result": result})
