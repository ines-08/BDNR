import sys
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor

ETCD_NODES = ["etcd1", "etcd2", "etcd3", "etcd4", "etcd5"]

def process_data_chunk(keys, values, node):
    for key, value in zip(keys, values):
        command = f"ETCDCTL_API=3 etcdctl put {key} '{json.dumps(value)}'"
        subprocess.run(["docker-compose", "exec", node, "sh", "-c", command], check=True)

def main():

    if len(sys.argv) != 2:
        print("Usage: python populate.py <INPUT>")
        sys.exit(1)

    JSON_FILE = sys.argv[1]
    with open(JSON_FILE, "r") as file:
        data = json.load(file)

    keys = list(data.keys())
    values = list(data.values())

    chunk_size = len(keys) // len(ETCD_NODES)
    key_chunks = [keys[i:i+chunk_size] for i in range(0, len(keys), chunk_size)]
    value_chunks = [values[i:i+chunk_size] for i in range(0, len(values), chunk_size)]

    with ThreadPoolExecutor(max_workers=len(ETCD_NODES)) as executor:
        for i, node in enumerate(ETCD_NODES):
            executor.submit(process_data_chunk, key_chunks[i], value_chunks[i], node)

if __name__ == "__main__":
    main()