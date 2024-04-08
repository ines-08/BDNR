async function getEventPage(db, req, res) {
    const eventID = req.query?.id;

    try {
        const event = await db.get(`event:${eventID}`)?.json(); 
        if (!event) {
            req.flash('error', 'Event not found');
            res.redirect('/home');
        }

        const tickets = []
        const ticket_info = await db.getAll().prefix(`ticket:${eventID}:`).json();
        if (ticket_info) {
            for (const key in ticket_info) {
                tickets.push({
                    'type': key.split(':')[2],
                    ...ticket_info[key],
                });
            }
        }

        const favourites = await db.get(`favourite:${req.session.userInfo.username}`).json();
        const isFavourites = favourites.includes(eventID);

    
        res.render('event', { 
            event: event,
            tickets: tickets,
            isFavourite: isFavourites
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getEventPage
};