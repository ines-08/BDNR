# Delete old versions
# docker stop lab2
# docker rm lab2

# Run
docker run -d --name lab2 -v ./mongo-data:/data/db -p 27017:27017 mongo

# Kill old port
# kill -9 $(lsof -ti:8080)

# Run web server
# php -S localhost:8080

# Interactive CLI - Mongosh
# docker run -it --rm --network container:lab2 mongo mongosh