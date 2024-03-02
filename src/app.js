const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const { Etcd3 } = require("etcd3");

const PORT = 3000;
const htmlPath = path.join(__dirname, "html");

const home = fs.readFileSync(
    path.join(htmlPath, "index.html"),
    "utf8"
);

const node = fs.readFileSync(
    path.join(htmlPath, "node.html"),
    "utf8"
);

// Connect to etcd
const etcd = new Etcd3({
    hosts: [
      'http://etcd1:2379',
      'http://etcd2:2379',
      'http://etcd3:2379',
      'http://etcd4:2379',
      'http://etcd5:2379'
    ]
});

// Array to store messages
const messages = [];

etcd.watch()
  .key('bdnr')
  .create()
  .then(watcher => {
    watcher
      .on('disconnected', () => console.log('disconnected...'))
      .on('connected', () => console.log('successfully reconnected!'))
      .on('put', res => {
        const message = `key 'bdnr' got set to: ${res.value.toString()}`;
        messages.push(message);
        console.log(message);
      });
  });

// Fetch the response of a request
async function getResponse(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
}

// Home
app.get("/", async (req, res) => {
    res.send(home);
});

// Node info
app.get("/admin", async (req, res) => {

    const nodeID = req?.query?.node;
    await etcd.put(`bdnr`).value(`node${nodeID}`);
    const keys = await etcd.getAll().strings();
    const logs = messages.join('</br>');

    const html = node.replace('<main></main>', `<main>
                                                    Node: ${nodeID} </br>
                                                    Current keys: ${JSON.stringify(keys)} </br>
                                                    Messages: </br> ${messages} </br>
                                                </main>`)
    res.send(html);
});

// Create server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});