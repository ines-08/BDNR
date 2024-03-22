# Install project dependencies
pip3 install Faker

# Init project infrastructure
docker-compose up -d

# Generate data and populate ECTD cluster
python3 data/generate.py data/data.json
python3 data/populate.py data/data.json