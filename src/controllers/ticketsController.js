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
    console.log(req.body)
    const eventID = req.body?.event;
    const listType = req.body?.tickettype;
    const listQuantity = req.body?.ticketquantity
    
    const value = []
    console.log(eventID)
    console.log('/event?id=<%= eventID %>')

    for (const index in listType) {
        console.log("index", index)
        if (listQuantity[index] > 0) {
            value.push({
                'type': listType[index],
                'quantity': listQuantity[index],
            })
        }
    }
    
    res.redirect(`/event?id=${eventID}`)
};


module.exports = {
    getTicketsPage,
    buytickets
};
