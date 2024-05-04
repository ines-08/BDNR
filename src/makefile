all: cleanup requirements setup generate populate

cleanup_containers:
	-docker stop etcd1
	-docker stop etcd2
	-docker stop etcd3
	-docker stop etcd4
	-docker stop etcd5
	-docker stop server
	-docker rm etcd2
	-docker rm etcd1
	-docker rm etcd3
	-docker rm etcd4
	-docker rm etcd5
	-docker rm server

cleanup_db:
	rm -rf db
	mkdir db
	touch db/db.empty

requirements:
	python3 -m pip install -r requirements.txt

setup:
	docker-compose up -d

generate:
	python3 data/generate.py data/data.json

populate:
	python3 data/populate.py data/data.json 5

cleanup: cleanup_containers cleanup_db