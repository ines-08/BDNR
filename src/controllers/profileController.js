async function getProfilePage(db, req, res) {
    try {
        const userID = req.query?.username;

        const user = await db.get(`user:${userID}`)?.json(); 
        if (!user) {
            req.flash('error', 'User not found');
            res.redirect('/home');
            return;
        }

        const purchases = [];
        const user_purchases = await db.getAll().prefix(`purchase:${userID}:`).json();
        if (user_purchases) {
            for (const key in user_purchases) {
                const event_id = key.split(':')[2];
                const event_name = (await db.get(`event:${event_id}`).json()).name;
                purchases.push({
                    'event_name': event_name,
                    'event_id': event_id,
                    'info': user_purchases[key]
                });
            }
        }

        const favourites = await db.get(`favourite:${req.session.userInfo.username}`).json();
        const favourite_names = [];

        for (const key in favourites) {
            const event_id = favourites[key];
            const event_name = (await db.get(`event:${event_id}`).json()).name;
            favourite_names.push({
                "event_id" : event_id,
                "event_name": event_name
            });
        }

        res.render('profile', { 
            user: user, 
            purchases: purchases,
            favourites: favourite_names,
            error_message: req.flash('error'), 
            success_message: req.flash('success'),
        });

    } catch (error) {
        console.error(error);
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
}

module.exports = {
    getProfilePage
};