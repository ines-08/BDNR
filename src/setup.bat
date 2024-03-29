@echo off

rem Cleanup Containers
docker stop etcd1
docker stop etcd2
docker stop etcd3
docker stop etcd4
docker stop etcd5
docker stop server1
docker stop server2
docker stop server3
docker rm etcd2
docker rm etcd1
docker rm etcd3
docker rm etcd4
docker rm etcd5
docker rm server1
docker rm server2
docker rm server3
for /f "tokens=*" %%i in ('docker images -q') do docker rmi -f %%i

rem Cleanup Database
rmdir /s /q db
mkdir db
echo. > db\db.empty

rem Install Requirements
pip3 install Faker

rem Setup
docker-compose up -d

rem Generate Data
python data\generate.py data\data.json

rem Populate Data
python data\populate.py data\data.json

goto :eof
