async function getTicketsPage(db, req, res) {
    const eventID = req.query?.eventid;

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
    
        res.render('tickets', {
            eventid: eventID, 
            event: event,
            tickets: tickets
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
};

async function buytickets(db, req, res) {
    const username = req.session.userInfo.username;
    const eventID = req.body?.event;
    const listType = req.body?.tickettype;
    const listQuantity = req.body?.ticketquantity;
    
    const value = [];

    for (const index in listType) {
        if (listQuantity[index] > 0) {
            value.push({
                'type': listType[index],
                'quantity': listQuantity[index],
            })
        }
    }
    
    console.log(value)
    console.log(username)
    let thing = await db.put(`purchase:${username}:${eventID}`).value(value);
    res.redirect(`/home`);
};


module.exports = {
    getTicketsPage,
    buytickets
};
