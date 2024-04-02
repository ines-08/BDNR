from distutils.command.clean import clean
import sys
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor

ETCD_NODES = {
    "etcd1" : "http://localhost:2381", 
    "etcd2" : "http://localhost:2382", 
    "etcd3" : "http://localhost:2383", 
    "etcd4" : "http://localhost:2384", 
    "etcd5" : "http://localhost:2385",     
}

def process_data(key, value, node):
    command = f"ETCDCTL_API=3 etcdctl put {key} '{json.dumps(value)}' --endpoints={ETCD_NODES[node]}"
    subprocess.run(["docker-compose", "-f", "docker-compose-dev.yml", "exec", node, "sh", "-c", command], check=True)

def process_data_chunk(keys, values, node):
    for key, value in zip(keys, values):
        process_data(key, value, node)

def populate(data):

    keys = list(data.keys())
    values = list(data.values())

    # Divide the data into chunks for parallel processing
    chunk_size = len(keys) // len(ETCD_NODES)
    key_chunks = [keys[i:i+chunk_size] for i in range(0, len(keys), chunk_size)]
    value_chunks = [values[i:i+chunk_size] for i in range(0, len(values), chunk_size)]

    # Processes the chunks in parallel on different nodes
    with ThreadPoolExecutor(max_workers=len(ETCD_NODES)) as executor:
        for i, node in enumerate(ETCD_NODES.keys()):
            executor.submit(process_data_chunk, key_chunks[i], value_chunks[i], node)

def populate_single(data):
    for key, value in data.items():
        process_data(key, value, "etcd1")

def main():

    if len(sys.argv) != 2:
        print("Usage: python populate.py <INPUT>")
        sys.exit(1)

    JSON_FILE = sys.argv[1]
    with open(JSON_FILE, "r") as file:
        data = json.load(file)
        file.close()
    
    # populate(data)
    populate_single(data)

if __name__ == "__main__":
    main()
