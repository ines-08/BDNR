const utils = require('../utils/utils');

const PORT = 3001; // TODO: change

async function getHomePage(db, req, res) {
    try {
        const search = req.query?.search;
        
        let events = search 
            ? await utils.getResponse(`http://localhost:${PORT}/api/search?input=${search}`) 
            : await db.getAll().prefix('event:').limit(10).json();
    
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