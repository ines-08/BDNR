import sys
import json
import subprocess

ETCD_NODE = "etcd1"

if len(sys.argv) != 2:
    print("Usage: python populate.py <INPUT>")
    sys.exit(1)

JSON_FILE = sys.argv[1]
with open(JSON_FILE, "r") as file:
    data = json.load(file)
    file.close()

for key, value in data.items():
    command = f"ETCDCTL_API=3 etcdctl put {key} '{json.dumps(value)}'"
    subprocess.run(["docker-compose", "exec", ETCD_NODE, "sh", "-c", command])
