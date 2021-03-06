#!/usr/bin/env python
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import sys
import base64

for i in sys.path:
    print(i)

from utils.database.connect import conn, cur
from utils.database.general_user import (
    create_user,
    login_user,
    change_password,
    forgot_password_get_change_password_link,
    post_image,
    discovery,
    discovery_with_search_term,
    edit_post_caption,
    profiles_photos,
)
from utils.database.likes import post_like, get_num_likes, get_likers
from utils.database.watermark import apply_watermark

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

    return jsonify({"result": result})


@app.route("/logout", methods=["GET", "POST"])
def app_logout():

    app.user_id = None

    return jsonify({"result": True})


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

        print(price, title)

        image = image.split(",")[-1]
        image = base64.b64decode(image)

        result = post_image(user_id, caption, image, title, price, conn, cur)

        return jsonify({"result": result})


@app.route("/discovery")
def api_discovery():
    user_id = request.args.get("user_id")
    if user_id == None:
        user_id = 0
    batch_size = request.args.get("batch_size")
    query = request.args.get("query")
    if query is not None:
        result = discovery_with_search_term(user_id, batch_size, query, conn, cur)
    else:
        result = discovery(user_id, batch_size, conn, cur)

    if result:

        processed_result = []

        for tup in result:
            id, caption, uploader, img, title, price, created_at = tup
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
                    "created_at": created_at
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
            id, caption, uploader, img, title, price, created_at = tup
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
                    "created_at":created_at
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
    caption = request.args.get("caption")
    result = edit_post_caption(app.user_id, image_id, caption, conn, cur)

    return jsonify({"result": result})

@app.route("/get_tags")
def api_get_tags():
    image_id = request.args.get("image_id")
    result = get_tags(image_id, conn, cur)
    return jsonify({"result": result})

@app.route("/add_tag")
def api_add_tag():
    image_id = request.args.get("image_id")
    result = add_tag(app.user_id, image_id, tag, conn, cur)
    return jsonify({"result": result})

@app.route("/remove_tag")
def api_remove_tag():
    image_id = request.args.get("image_id")
    result = remove_tag(app.user_id, image_id, tag, conn, cur)
    return jsonify({"result": result})
