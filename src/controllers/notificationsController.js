async function getNotificationsPage(req, res) {

        if (!req.session.userInfo) {
            req.flash('error', 'Event not found');
        }
    
        res.render('notifications', {
            user: req.session.userInfo,
        });

}

async function addNotifications(db, req, res) {
    const username = req.session.userInfo.username;
    const eventID = req.body?.event;
    const numberMin = req.body?.minimumtickets;
    
    try {
        await db.put(`notification:${username}:${eventID}`).value(numberMin);
      
        // const watcher = client.watch();

        // watcher.prefix('event:').create().then(() => {
        //     console.log('Watching for changes on event quantities...');
        // });

        // watcher.on('data', (res) => {
        //     res.events.forEach(event => {
        //         const key = event.kv.key.toString();
        //         const value = JSON.parse(event.kv.value.toString());
        //         const eventID = key.split(':')[1];
        //         const currentQuantity = parseInt(value.current_quantity);

        //         if (currentQuantity < numberMin) {
        //             sendAlarm(eventID, currentQuantity);
        //         }
        //     });
        // });

        // watcher.on('error', (err) => {
        //     console.error('Watcher error:', err);
        // });

        res.redirect(`/event?id=${eventID}`);
    
    } catch(error) {
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