from connect import conn, cur
from general_user import create_user, login_user, change_password, forgot_password_get_change_password_link, post_image, discovery,edit_post_caption
from watermark import apply_watermark
import time


if __name__ == '__main__':
    table = "users"
    first = 'Matthew'
    last = 'Olsen'
    email = 'matthewolsen402@gmail.com'
    password = 'password'

    # response = create_user(first, last, email, password, conn, cur)
    # print(response)
    #
    # time.sleep(1)

    response,user_id = login_user(email, password, conn, cur)
    print(response)
    #
    # response = change_password(email, password, "new_password", conn, cur)
    # print(response)
    #
    # response = forgot_password_get_change_password_link(email, conn, cur)
    # print(response)
    #
    # for i in range(100,125):
    #     fin = open('../../archive/elephant/{}.jpg'.format(i), 'rb')
    #     img = fin.read()
    #     fin.close()
    #
    #     response = post_image(user_id, "African Elephant!", img, conn, cur)
    #     print(response)

    # response = discovery(user_id, 32, conn, cur)
    # for tup in response:
    #    id, caption, uploader, img = tup
    #
    #     fin = open('{}.jpg'.format(id), 'wb')
    #     fin.write(img)
    #     fin.close()
    #
    #    filename = '{}.jpg'.format(id)
    #
    #    fin = open(filename, 'wb')
    #    fin.write(img)
    #    fin.close()
    #
    #    apply_watermark(filename)

    # change to whatever image_id and caption you want
    # response = edit_post_caption(1, 117, "big buffalo", conn, cur)
    # print(response)


