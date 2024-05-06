from concurrent.futures import ThreadPoolExecutor
from copyreg import constructor
import sys
import json
import subprocess
import time

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

def populate_parallel(data):

    keys = list(data.keys())
    values = list(data.values())

    # Divide the data into chunks for parallel processing
    chunk_size = len(keys) // len(ETCD_NODES)
    remainder = len(keys) % len(ETCD_NODES)
    key_chunks = [keys[i:i+chunk_size] for i in range(0, len(keys), chunk_size)]
    value_chunks = [values[i:i+chunk_size] for i in range(0, len(values), chunk_size)]

    # Processes the chunks in parallel on different nodes
    with ThreadPoolExecutor(max_workers=len(ETCD_NODES)) as executor:
        for i, node in enumerate(ETCD_NODES.keys()):
            executor.submit(process_data_chunk, key_chunks[i], value_chunks[i], node)

    if remainder:
        remainder_chunk_keys = keys[-remainder:]
        remainder_chunk_values = values[-remainder:] 
        process_data_chunk(remainder_chunk_keys, remainder_chunk_values, "etcd1")

def populate_single(data):
    for key, value in data.items():
        process_data(key, value, "etcd1")

def main():

    if len(sys.argv) not in [2, 3]:
        print("Usage: python populate.py <INPUT> [-p]")
        sys.exit(1)

    JSON_FILE = sys.argv[1]
    with open(JSON_FILE, "r") as file:
        data = json.load(file)
        file.close()

    print(f"Populating ETCD with {len(data.items())} key-value pairs...")
    start_time = time.time()

    if len(sys.argv) == 3 and sys.argv[2] == '-p':
        populate_parallel(data)
    else:
        populate_single(data)

    end_time = time.time()
    print(f"Populate done. Inserted {len(data.items())} key-value pairs in {round(end_time - start_time, 1)} seconds")

if __name__ == "__main__":
    main()
