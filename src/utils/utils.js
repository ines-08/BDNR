const fs = require('fs');

const config = JSON.parse(fs.readFileSync('configuration.json'));

async function getResponse(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
}

module.exports = { getResponse, config };