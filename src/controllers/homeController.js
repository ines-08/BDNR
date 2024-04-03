const utils = require('../utils/utils');

async function getHomePage(db, req, res) {
    try {
        const search = req.query?.search;
        const type = req.query?.type;
        const location = req.query?.location;
        console.log(req?.query);
        let events = (!search && !type && !location) 
            ? await db.getAll().prefix('event:').limit(10).json() 
            : await utils.getResponse(`http://localhost:${utils.config.port}/api/search?input=${search}&type=${type}&location=${location}`)
    
        events = Object.keys(events).map(key => {
            return {
                id: key.split(':')[1],
                ...events[key]
            };
        });
        
        res.render('home', { 
            user: req.session.userInfo, 
            error_message: req.flash('error'), 
            success_message: req.flash('success'),
            search: search,
            events: events,
            eventTypes: utils.data_config.EVENT_TYPES,
            locations: utils.data_config.EVENT_LOCATIONS
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