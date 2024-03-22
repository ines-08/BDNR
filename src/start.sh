docker rmi $(docker images -q)
docker-compose up -d
python3 data/populate.py data/data.json