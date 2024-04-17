import subprocess

# Please change this in PROD environment
ETCD_NODES = {
    "etcd1" : "http://localhost:2381", 
    "etcd2" : "http://localhost:2382", 
    "etcd3" : "http://localhost:2383", 
    "etcd4" : "http://localhost:2384", 
    "etcd5" : "http://localhost:2385",     
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
        "docker-compose", "-f", "docker-compose-dev.yml", 
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