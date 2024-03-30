from flask import Flask, render_template
from cassandra.cluster import Cluster

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/products')
def products():
    # cluster = Cluster(['127.0.0.1'])  # Connect to Cassandra cluster
    # session = cluster.connect('bdnr_test')  # Connect to keyspace
    # catalog = session.execute('SELECT * FROM catalog')  # Fetch data from Cassandra
    # products = [{'product_id': row.product_id, 'product_description': row.product_description} for row in catalog]
    # session.shutdown()
    # cluster.shutdown()
    return render_template('products.html', products=products)

if __name__ == '__main__':
    app.run(debug=True)
