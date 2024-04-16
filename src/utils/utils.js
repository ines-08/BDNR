const fs = require('fs');

const config = JSON.parse(fs.readFileSync('configuration.json'));
const data_config = JSON.parse(fs.readFileSync('data/configurations.json'));

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

function normalize(text) {
    return text.replace(/[^\w\s]/g, ' ').toLowerCase();
}

function extractWords(text) {
    return normalize(text).split(' ').filter(function(word) {
        return word.trim().length > 0;
    });
}

function getWords(textElements) {
    let result = []
    for (const element of textElements) {
        const words = extractWords(element);
        result.push(...words);
    }
    return result;
}

async function getTicketTypes(db) {
    return db.get('ticket:types').json();
}

async function getEventTypeKeys(db) {
    return db.get('event:types').json();
}

async function getEventLocationKeys(db) {
    return db.get('event:locations').json();
}

module.exports = { 
    getResponse, 
    getNodeInfo, 
    getClusterMembers, 
    normalize,
    extractWords,
    getWords,
    getTicketTypes,
    getEventTypeKeys,
    getEventLocationKeys,
    config, 
    data_config
};