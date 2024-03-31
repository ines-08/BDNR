async function getSearchResults(db, req, res) {
    const wordsArray = req.query?.input.split(" ");
    
    // Iterate through the array and decode each word and convert to lowercase
    for (let i = 0; i < wordsArray.length; i++) {
        // Decode the URI component to replace "%20" with space
        wordsArray[i] = decodeURIComponent(wordsArray[i]).toLowerCase();
    }

    const events = [];
    try {
        const eventMatches = new Map();

        for (const input of wordsArray) {
            const matches = await db.getAll().prefix(`search:event:${input}`).json();
            if (matches) {
                for (const key in matches) {
                    for (const id of matches[key]) {
                        if (eventMatches.has(input)) {                
                            eventMatches.get(input).push(id);
                        } else {
                            eventMatches.set(input, [id]);
                        }
                    }
                }
            }
        }
        
        // Filter events that match all words in wordsArray
        const values = Array.from(eventMatches.values());
        const sets = values.map(value => new Set(value));
        const commonWordsArraySet = sets.reduce((accumulator, current) => {
            return new Set([...accumulator].filter(value => current.has(value)));
        });

        const commonWordsArray = Array.from(commonWordsArraySet)

        // Iterate over the commonWordsArray and add the corresponding events to the events array
        for (const event_id of commonWordsArray) {
            const event = await db.get(`event:${event_id}`).json();
            if (event) {
                event.id = event_id;
                events.push(event);
            }
        }
        
        res.send(JSON.stringify(events, null, 2));

    } catch (error) {
        res.send(JSON.stringify([]));
    }
};

module.exports = {
    getSearchResults
};