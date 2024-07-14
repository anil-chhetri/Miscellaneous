from flask import Blueprint, render_template
import markdown
import os
import datetime

main = Blueprint('main', __name__)

@main.route('/')
def index():
    posts = os.listdir('posts')
    posts = [post.split('.')[0] for post in posts]
    return render_template('index.html', posts=posts)

@main.route('/post/<post_name>')
def post(post_name):
    file_path = os.path.join('posts', f'{post_name}.md')
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
            html_content = markdown.markdown(content)
        current_date = datetime.datetime.now().strftime("%B %d, %Y")
        return render_template('post.html', content=html_content, current_date=current_date)
    else:
        return render_template('404.html'), 404
