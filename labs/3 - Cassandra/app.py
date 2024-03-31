from flask import Flask, render_template, request
from cassandra.cluster import Cluster

app = Flask(__name__)

cluster = Cluster()
session = cluster.connect()

session.set_keyspace('bookit')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/bookmarks')
def bookmarks():
    all_bookmarks = session.execute('SELECT * FROM bookmarks')
    return render_template('bookmarks.html', bookmarks=all_bookmarks)

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        url = request.form['url']
        tag = request.form['tags']

        print(f"URL: {url}, Tag: {tag}")

        session.execute(
            """
            INSERT INTO bookmarks VALUES (%s, %s, %s, %s)
            """, 
            tag, sha256(url), url, datetime.now()
        )

        session.execute(
            """
            INSERT INTO bookmarks_by_ta VALUES (%s, %s, %s)
            """,
            tag, sha256(url), url, datetime.now()
        )    

        return "Book submitted with success"    


@app.route('/bookmark/<int:bookmark_id>')
def bookmark(bookmark_id):
    query_prepare = session.prepare('SELECT * FROM bookmarks WHERE id=?')
    bookmark_spec = session.execute(query_prepare, [bookmark_id])
    bookmark = [{'bookmark_url': row.url, 'bookmark_tags': row.tags} for row in bookmark_spec] 
    return render_template('bookmark.html', bookmark=bookmark)

if __name__ == '__main__':
    app.run(debug=True)
