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
    console.log("inside addNotifs: ", req.app.locals.watchers);
    try {
        await db.put(`notification:${username}:${eventID}`).value(numberMin);

        const watcher = db.watch().key(`event:${eventID}`).watcher();

        watcher.on('put', (res) => {
            console.log("dcfdcgvghvbhgvb");
            //  res.event => {
            //     const key = event.key.toString();
            //     const value = JSON.parse(event.value.toString());
            //     const eventID = key.split(':')[1];
            //     const currentQuantity = parseInt(value.current_quantity);

            //     if (currentQuantity < numberMin) {
            //         sendAlarm(eventID, currentQuantity);
            //     }
        });

        watcher.on('error', (err) => {
             console.error('Watcher error:', err);
        });

        req.app.locals.watchers.push(watcher);
        console.log(req.app.locals.watchers);
        res.redirect(`/event?id=${eventID}`);
    
    } catch(error) {
        console.log(error);
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

function sendAlarm(eventID, currentQuantity) {
    console.log(`ALARM: Event ${eventID} has low ticket quantity (${currentQuantity})`);
}


module.exports = {
    getNotificationsPage,
    addNotifications
};