from cassandra.cluster import Cluster

# Connect to the Cassandra server running on the localhost
cluster = Cluster()

# Connect to the 'bdnr-test' keyspace
session = cluster.connect('bdnr-test')

# Execute a CQL statement to insert a new product and a new shopping cart item
product = ("00", 1, "Lightsaber Z42", 100000)
session.execute(
    """
    INSERT INTO catalog (product_id, stock, product_description, cost)
    VALUES (%s, %s, %s, %s)
    """,
    product
)

cart_item = ("1001", "00", 1, "Lightsaber Z42", 100000)
session.execute(
    """
    INSERT INTO shopping_cart (user_id, product_id, count, product_description, time_added, cost)
    VALUES (%s, %s, %s, %s, toUnixTimestamp((now()), %s)
    """,
    cart_item
)