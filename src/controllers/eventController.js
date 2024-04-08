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

        let isFavourites = false;
        if (favourites) {
            isFavourites = favourites.includes(eventID);
        }

    
        res.render('event', { 
            eventid: eventID,
            event: event,
            eventID: eventID,
            tickets: tickets,
            isFavourite: isFavourites
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

async function addFavourite(db, req, res){
    const eventID = req.body.eventID;
    try{
        const favourites = await db.get(`favourite:${req.session.userInfo.username}`).json();

        if (!favourites) {
            await db.put(`favourite:${req.session.userInfo.username}`).value(JSON.stringify([eventID]));
        }
        else {
            favourites.push(eventID);
            await db.put(`favourite:${req.session.userInfo.username}`).value(JSON.stringify(favourites));
        }

        res.redirect(`/event?id=${eventID}`);
    }
    catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
    


}

async function removeFavourite(db, req, res){
    const eventID = req.body.eventID;
    try{
        const favourites = await db.get(`favourite:${req.session.userInfo.username}`).json();

        if (favourites) {
            const updatedFavs = favourites.filter(item => item !== eventID);
            await db.put(`favourite:${req.session.userInfo.username}`).value(JSON.stringify(updatedFavs));
        }

        res.redirect(`/event?id=${eventID}`);
    }
    catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getEventPage,
    addFavourite,
    removeFavourite
};