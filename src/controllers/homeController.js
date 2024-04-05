const utils = require('../utils/utils');

async function getHomePage(db, req, res) {
    try {
        const search = req.query?.search;
        const type = req.query?.type;
        const location = req.query?.location;
        let events = (!search && !type && !location) 
            ? await db.getAll().prefix('event:').limit(10).json() 
            : await utils.getResponse(`http://localhost:${utils.config.port}/api/search?input=${search}&type=${type}&location=${location}`)
    
        events = Object.keys(events).map(key => {
            return {
                id: key.split(':')[1],
                ...events[key]
            };
        });

        let eventTypes = await db.getAll().prefix('search:type:').keys();   
        eventTypes = eventTypes.map(type => type.split(":").pop());
        
        
        let eventLocations = await db.getAll().prefix('search:location:').keys();   
        eventLocations = eventLocations.map(type => type.split(":").pop());

        res.render('home', { 
            user: req.session.userInfo, 
            error_message: req.flash('error'), 
            success_message: req.flash('success'),
            search: search,
            type: type,
            location: location,
            events: events,
            eventTypes: eventTypes,
            eventLocations: eventLocations
        });
    
    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getHomePage
};