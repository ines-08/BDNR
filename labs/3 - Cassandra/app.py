from flask import Flask, render_template, request, redirect, url_for, session
from cassandra.cluster import Cluster
from flask_session import Session
from datetime import datetime

app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

cluster = Cluster()
session_database = cluster.connect('bookit')

@app.route('/')
def index():
    if not session.get('username'):
        return redirect('/login')
        
    bookmarks = session_database.execute('SELECT * FROM bookmarks')
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
        session_database.execute(
             """
             INSERT INTO bookmarks (url_md5, url_original, time_t, tags)
             VALUES (%s, %s, %s, %s)
             """, 
             (str(hash(url)), url, datetime.now(), tag)
        )

        for tag_unique in tag:
            session_database.execute(
                """
                INSERT INTO bookmarks_by_tags (tag, url_md5, url_original, time_t)
                VALUES (%s, %s, %s, %s)
                """,
                (tag_unique, str(hash(url)), url, datetime.now())
            )    

        return redirect(url_for('index'))   

@app.route('/bookmarks/<url_md5>')
def bookmarks(url_md5):
    query_prepare = session_database.prepare('SELECT * FROM bookmarks WHERE url_md5=?')
    bookmark_spec = session_database.execute(query_prepare, [url_md5])
    bookmarks_list = [(bookmark.url_original, bookmark.tags, bookmark.time_t) for bookmark in bookmark_spec]
    return render_template('bookmarks.html', bookmark=bookmarks_list)

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/addregister', methods=['POST'])
def addregister():
    username = request.form['username']
    password = request.form['password']
 
    session_database.execute(
        """
        INSERT INTO user (username, password)
        VALUES (%s, %s)
        """,
        (username, password)
    )    

    return redirect(url_for('login'))   

@app.route('/login')    
def login():
    return render_template('login.html')

@app.route('/madelogin', methods=['POST'])
def madelogin():
    username = request.form['username']
    password = request.form['password']

    user_query = session_database.prepare('SELECT password FROM user WHERE username=?')
    result = session_database.execute(user_query, [username])
    pass_database =[(r.password) for r in result][0]

    if (hash(pass_database) == hash(password)):
        session['username'] = username
        return redirect(url_for('index'))

    else:
        return redirect(url_for('login'))    

@app.route('/logout')
def logout():
    session['username'] = None
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
