from email.policy import default
import subprocess

# Please change this in PROD environment
ETCD_NODES = {
    "etcd1" : "http://localhost:2381", 
    "etcd2" : "http://localhost:2382", 
    "etcd3" : "http://localhost:2383", 
    "etcd4" : "http://localhost:2384", 
    "etcd5" : "http://localhost:2385",     
}

DEFAULT_NODE = ETCD_NODES['etcd1']

QUERIES = {
    "Getting all ticket types": "put some 'thing'",
}

def run_query(query):
    print(query)
    subprocess.run(["docker-compose", "-f", "docker-compose-dev.yml", "exec", DEFAULT_NODE, "sh", "-c", "ETCDCTL_API=3", "etcdctl", "--endpoints={DEFAULT_NODE}", query], check=True)

def run():
    for description, query in QUERIES.items():
        print(description)
        run_query(query)

if __name__ == '__main__':
    run()