const utils = require('../utils/utils');

async function getNotificationsPage(db, req, res) {

        if (!req.session.userInfo) {
            req.flash('error', 'Event not found');
        }
    
        try {
            const notifications = [];
            const username = req.session.userInfo.username;
            const nots = await db.getAll().prefix(`notification:${username}:`).json();
            
            if(nots) {
                for (key in nots) {
                    const parts = key.split(":");
                    const eventID = parts[2];
                    let event = await db.get(`event:${eventID}`);
                    notifications.push({
                        event,
                        'numbermin': nots[key]
                    })
                }
            }

            res.render('notifications', {
                user: req.session.userInfo,
                notifications: notifications
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
        const event = await db.get(`event:${eventID}`).json();
        utils.getNotifications(db, req, event.name, eventID, numberMin);

        res.redirect(`/event?id=${eventID}`);
    
    } catch(error) {
        console.log(error);
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}


module.exports = {
    getNotificationsPage,
    addNotifications
};