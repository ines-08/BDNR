async function inputSearch(input, res, db) {
    const wordsArray = input.split(" ");

    // Iterate through the array and decode each word and convert to lowercase
    for (let i = 0; i < wordsArray.length; i++) {
        // Decode the URI component to replace "%20" with space
        wordsArray[i] = decodeURIComponent(wordsArray[i]).toLowerCase();
    }

    const eventMatches = new Map();

    try {
        for (const input of wordsArray) {
            const matches = await db.getAll().prefix(`search:text:${input}`).json();
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
        return sets.reduce((accumulator, current) => {
            return new Set([...accumulator].filter(value => current.has(value)));
        });

    } catch (error) {
        return new Set();
    }
}

async function typeSearch(type, res, db) {
    result = new Set();
    try {
        const matches = await db.get(`search:type:${type}`).json();
        if (matches) {
            for (const key in matches) {
                result.add(matches[key])
            }
        }
        return result;
    } catch (error) {
        return result;
    }
}

async function locationSearch(location, res, db) {
    result = new Set();
    try {
        const matches = await db.get(`search:location:${location}`).json();
        if (matches) {
            for (const key in matches) {
                result.add(matches[key])
            }
        }
        return result;
    } catch (error) {
        return result;
    }
}

async function getSearchResults(db, req, res) {

    try {
        
        // ensure we do not have default values
        if (req?.query.input === '' && req?.query.type === 'all' && req?.query.location === 'all') {
            const default_search = await db.getAll().prefix('event:').limit(10).json();
            res.send(JSON.stringify(default_search, null, 2));
            return;
        }

        let searchedFields = [];

        if (req?.query.input !== ''){
            const inputSet = await inputSearch(req?.query.input, res, db);
            searchedFields.push(inputSet);
        }
        if(req?.query.type !== 'all') {
            const typeSet = await typeSearch(req?.query.type, res, db);
            searchedFields.push(typeSet);
        }
        if(req?.query.location !== 'all') {
            const locationSet = await locationSearch(req?.query.location, res, db);
            searchedFields.push(locationSet);
        }

        let result = new Set(searchedFields[0]);

        if (searchedFields.length > 1) {
            // Use reduce to compute the intersection
            result = searchedFields.slice(1).reduce((intersection, set) => {
                // Filter elements in intersection set to keep only those present in the current set
                return new Set([...intersection].filter(element => set.has(element)));
            }, result);
        }
        
        const commonEventsArray = Array.from(result);
        const events = [];
    
        // Iterate over the commonWordsArray and add the corresponding events to the events array
        for (const event_id of commonEventsArray) {
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