async function getNotificationsPage(db, req, res) {
    const eventID = req.query?.eventid;
    console.log("EVENTID", eventID)

    try {

        const event = await db.get(`event:${eventID}`)?.json(); 
        if (!event) {
            req.flash('error', 'Event not found');
            res.redirect('/home');
        }
    
        res.render('notifications', {
            user: req.session.userInfo,
            eventid: eventID,
            event: event,
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

async function addNotifications(db, req, res) {
    const username = req.session.userInfo.username;
    const eventID = req.body?.event;
    const numberMin = req.body?.minimumtickets;
    
    try {
        await db.put(`notification:${username}:${eventID}`).value(numberMin);
        res.redirect(`/event?id=${eventID}`);
    } catch(error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getNotificationsPage,
    addNotifications
};