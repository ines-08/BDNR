const utils = require('../utils/utils');

async function getNotificationsPage(db, req, res) {

        if (!req.session.userInfo) {
            req.flash('error', 'You need login first');
            res.redirect('/home');
        }
    
        try {

            const notifications = [];
            const username = req.session.userInfo.username;
            const keys = await db.getAll().prefix(`notification:${username}:`).json();
            
            if (keys) {
                for (let key in keys) {
                    const parts = key.split(":");
                    const eventID = parts[2];
                    const event = await db.get(`event:${eventID}`).json();
                    notifications.push({
                        event: { ...event, id: eventID },
                        info: keys[key],
                    })
                }
            }

            res.render('notifications', {
                user: req.session.userInfo,
                notifications: notifications
            });

        } catch (error) {
            req.flash('error', 'Error on getting Notification details page');
            res.redirect('/home');
        }
}

async function addNotifications(db, req, res) {

    const username = req.session.userInfo.username;
    const eventID = req.body?.event;
    const numberMin = req.body?.minimumtickets;
   
    try {

        await db.put(`notification:${username}:${eventID}`).value(JSON.stringify({
            'limit': numberMin, 
            'active': false
        }));

        utils.getNotifications(db, req, eventID, numberMin, username);

        req.flash('success', `You will be notified when the number of tickets for this event is less than ${numberMin}`);
        res.redirect(`/event?id=${eventID}`);
    
    } catch(error) {
        req.flash('error', 'Error when creating notification');
        res.redirect('/home');
    }
}

module.exports = {
    getNotificationsPage,
    addNotifications
};