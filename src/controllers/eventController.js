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
            user: req.session.userInfo,
            eventid: eventID,
            event: event,
            eventID: eventID,
            tickets: tickets,
            isFavourite: isFavourites,
            error_message: req.flash('error'), 
            success_message: req.flash('success'),
        });

    } catch (error) {
        req.flash('error', 'Error getting event details page');
        res.redirect('/home');
    }
}

async function addFavourite(db, req, res){
    const eventID = req.body.eventID;

    try {
        const favourites = await db.get(`favourite:${req.session.userInfo.username}`).json();

        if (!favourites) {
            await db.put(`favourite:${req.session.userInfo.username}`).value(JSON.stringify([eventID]));
        }
        else {
            favourites.push(eventID);
            await db.put(`favourite:${req.session.userInfo.username}`).value(JSON.stringify(favourites));
        }

        req.flash('success', 'Event added to your favourites list');
        res.redirect(`/event?id=${eventID}`);
    }
    
    catch (error) {
        req.flash('error', 'Error in add favourite action');
        res.redirect('/home');
    }
}

async function removeFavourite(db, req, res){
    const eventID = req.body.eventID;

    try {
        const favourites = await db.get(`favourite:${req.session.userInfo.username}`).json();

        if (favourites) {
            const updatedFavs = favourites.filter(item => item !== eventID);
            await db.put(`favourite:${req.session.userInfo.username}`).value(JSON.stringify(updatedFavs));
        }

        req.flash('success', 'Event removed from your favourites list');
        res.redirect(`/event?id=${eventID}`);
    }

    catch (error) {
        req.flash('error', 'Error in remove favourite action');
        res.redirect('/home');
    }
}

module.exports = {
    getEventPage,
    addFavourite,
    removeFavourite
};