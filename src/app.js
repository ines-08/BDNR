const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

const PORT = 3000;
const htmlPath = path.join(__dirname, "html");

const baseStructure = fs.readFileSync(
    path.join(htmlPath, "index.html"),
    "utf8"
);

// Fetch the response of a request
async function getResponse(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
}

// Base structure
app.get("/", async (req, res) => {
    res.send(baseStructure);
});

app.get("/admin", async (req, res) => {
    res.send(baseStructure);
});

// Create server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});