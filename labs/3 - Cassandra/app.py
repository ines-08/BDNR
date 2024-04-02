from flask import Flask, render_template, request, redirect, url_for
from cassandra.cluster import Cluster
from datetime import datetime

app = Flask(__name__)

cluster = Cluster()
session = cluster.connect('bookit')

@app.route('/')
def index():
    bookmarks = session.execute('SELECT * FROM bookmarks')
    bookmarks_list = [(bookmark.url_original, bookmark.tags, bookmark.url_md5) for bookmark in bookmarks]
    return render_template('index.html', bookmarks=bookmarks_list)

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        url = request.form['url']
        tag = {request.form['tags']}

        print(f"URL: {url}, Tag: {tag}, Hash: {hash(url)}")
        session.execute(
             """
             INSERT INTO bookmarks (url_md5, url_original, time_t, tags)
             VALUES (%s, %s, %s, %s)
             """, 
             (str(hash(url)), url, datetime.now(), tag)
        )

        for tag_unique in tag:
            session.execute(
                """
                INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t)
                VALUES (%s, %s, %s, %s)
                """,
                (tag_unique, str(hash(url)), url, datetime.now())
            )    

        return redirect(url_for('index'))   


@app.route('/bookmarks/<url_md5>')
def bookmarks(url_md5):
    query_prepare = session.prepare('SELECT * FROM bookmarks WHERE url_md5=?')
    bookmark_spec = session.execute(query_prepare, [url_md5])
    bookmarks_list = [(bookmark.url_original, bookmark.tags, bookmark.time_t) for bookmark in bookmark_spec]
    return render_template('bookmarks.html', bookmark=bookmarks_list)

if __name__ == '__main__':
    app.run(debug=True)
