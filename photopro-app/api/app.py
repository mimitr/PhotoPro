from flask import Flask

app = Flask(__name__)

@app.route('/post')
def post_image():
    return {
        'image': True
    }