# TickETCD - BDNR Project

## Run

### Docker

```bash
$ cd src/
$ bash start.sh
```

This will set up 8 containers into Docker within the same network:

- a distributed etcd cluster of 5 nodes;
- three servers for the web application;

Then open [localhost:3001](http://localhost:3001), [localhost:3002](http://localhost:3002) or [localhost:3003](http://localhost:3003) to see multiple instances of the app running.

### Local

Simply run the following commands:

```bash
$ cd src/
$ npm install
$ node app.js
```

Then open [localhost:3001](http://localhost:3001) to see the app running.