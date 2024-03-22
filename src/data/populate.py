import sys
import json
import subprocess

if len(sys.argv) != 2:
    print("Usage: python script.py json_file")
    sys.exit(1)

# Name of the container in which you want to execute the command
container_name = "etcd1"

# Get the JSON file name from command line arguments
json_file = sys.argv[1]

# Read the JSON file
with open(json_file, "r") as f:
    data = json.load(f)

# Iterate over the keys and values in the JSON
for key, value in data.items():
    # Format the etcdctl command
    command = f"ETCDCTL_API=3 etcdctl put {key} '{json.dumps(value)}'"
    print(command)
    
    # Execute the command inside the container
    subprocess.run(["docker-compose", "exec", container_name, "sh", "-c", command])
