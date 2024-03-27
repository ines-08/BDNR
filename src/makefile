all: cleanup requirements setup generate populate

cleanup_containers:
	-docker stop etcd1
	-docker stop etcd2
	-docker stop etcd3
	-docker stop etcd4
	-docker stop etcd5
	-docker stop server1
	-docker stop server2
	-docker stop server3
	-docker rm etcd2
	-docker rm etcd1
	-docker rm etcd3
	-docker rm etcd4
	-docker rm etcd5
	-docker rm server1
	-docker rm server2
	-docker rm server3

cleanup_db:
	rm -rf db
	mkdir db
	touch db/db.empty

requirements:
	pip3 install Faker

setup:
	docker-compose up -d

generate:
	python3 data/generate.py data/data.json

populate:
	python3 data/populate.py data/data.json

cleanup: cleanup_containers cleanup_db

restart: cleanup_containers setup populate