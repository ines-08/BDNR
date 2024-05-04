import sys
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor

ETCD_NODES = {
    "etcd1" : "http://etcd1:2379", 
    "etcd2" : "http://etcd2:2379", 
    "etcd3" : "http://etcd3:2379", 
    "etcd4" : "http://etcd4:2379", 
    "etcd5" : "http://etcd5:2379",     
}

def process_data(key, value, node, output=False):
    command = f"ETCDCTL_API=3 etcdctl put {key} '{json.dumps(value)}' --endpoints={ETCD_NODES[node]}"
    subprocess.run(["docker-compose", "exec", node, "sh", "-c", command], 
        stdout=subprocess.DEVNULL if not output else None, 
        stderr=subprocess.DEVNULL if not output else None, 
        check=True
    )

def process_data_chunk(keys, values, node):
    for key, value in zip(keys, values):
        process_data(key, value, node)

def populate_parallel(data, n):
    assert(n <= len(ETCD_NODES))

    keys = list(data.keys())
    values = list(data.values())

    # Divide the data into chunks for parallel processing
    chunk_size = len(keys) // n
    key_chunks = [keys[i:i+chunk_size] for i in range(0, len(keys), chunk_size)]
    value_chunks = [values[i:i+chunk_size] for i in range(0, len(values), chunk_size)]

    # Processes the chunks in parallel on different nodes
    with ThreadPoolExecutor(max_workers=n) as executor:
        for i, node in enumerate(ETCD_NODES.keys()):
            executor.submit(process_data_chunk, key_chunks[i], value_chunks[i], node)

def populate_single(data):
    for key, value in data.items():
        process_data(key, value, "etcd1")
    print(f"Populate done. Inserted {len(data.items())} key-value pairs")

def main():

    if len(sys.argv) not in [2, 3]:
        print("Usage: python populate.py <INPUT> [N]")
        sys.exit(1)

    JSON_FILE = sys.argv[1]
    with open(JSON_FILE, "r") as file:
        data = json.load(file)
        file.close()

    if len(sys.argv) == 3 and sys.argv[2]:
        populate_parallel(data, int(sys.argv[2]))
    else:
        populate_single(data)

if __name__ == "__main__":
    main()
