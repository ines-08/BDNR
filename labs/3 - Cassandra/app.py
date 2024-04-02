from flask import Flask, render_template, request, redirect, url_for
from cassandra.cluster import Cluster
from datetime import datetime

app = Flask(__name__)

cluster = Cluster()
session = cluster.connect('bookit')

@app.route('/')
def index():
    bookmarks = session.execute('SELECT * FROM bookmarks')
    bookmarks_list = [(bookmark.url_original, bookmark.tags) for bookmark in bookmarks]
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


@app.route('/bookmark/<url>')
def bookmark(bookmark_id):
    query_prepare = session.prepare('SELECT * FROM bookmarks WHERE id=?')
    bookmark_spec = session.execute(query_prepare, [bookmark_id])
    bookmark = [{'bookmark_url': row.url, 'bookmark_tags': row.tags} for row in bookmark_spec] 
    return render_template('bookmark.html', bookmark=bookmark)

if __name__ == '__main__':
    app.run(debug=True)
