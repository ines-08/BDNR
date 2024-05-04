import subprocess

ETCD_NODES = {
    "etcd1" : "http://etcd1:2379", 
    "etcd2" : "http://etcd2:2379", 
    "etcd3" : "http://etcd3:2379", 
    "etcd4" : "http://etcd4:2379", 
    "etcd5" : "http://etcd5:2379",     
}

DEFAULT_NODE = 'etcd1'
DEFAULT_ADDRESS = ETCD_NODES[DEFAULT_NODE]

QUERIES = [
    { "description": "A simple put", "code": "put some thing", "output": False },
    { "description": "Getting all ticket types", "code": "get ticket:types", "output": True }
]

def run_query(query, output=True):
    command = f"ETCDCTL_API=3 etcdctl --endpoints={DEFAULT_ADDRESS} {query}"
    subprocess.run([
        "docker-compose",
        "exec", DEFAULT_NODE, "sh", "-c", command
    ], 
        stdout=subprocess.DEVNULL if not output else None, 
        stderr=subprocess.DEVNULL if not output else None, 
        check=True
    )

def run():
    for query in QUERIES:
        print(query['description'])
        run_query(query['code'], query['output'])

if __name__ == '__main__':
    run()