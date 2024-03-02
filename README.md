# BDNR

## Run

```bash
$ cd src/
$ bash start.sh
```

This will set up 6 containers into Docker within the same network:

- a distributed etcd cluster of 5 nodes;
- a server for the web application (currently nodejs);

Then open [localhost:3000](http://localhost:3000) to see the app running.