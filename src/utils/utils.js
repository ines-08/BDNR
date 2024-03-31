const fs = require('fs');

const config = JSON.parse(fs.readFileSync('configuration.json'));

async function getResponse(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
}

async function getNodeInfo(node) {
    return getResponse(`${node}/v2/stats/self`);
}

async function getClusterMembers(node) {
    return getResponse(`${node}/v2/members`);
}

module.exports = { getResponse, getNodeInfo, getClusterMembers, config };