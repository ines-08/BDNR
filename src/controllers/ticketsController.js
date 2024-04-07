async function getTicketsPage(db, req, res) {
    console.log(req.query)
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
            event: event,
            tickets: tickets
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
};

async function buyticket(db, req, res) {
    const { event, tickettype, ticketquantity} = req.body;

    try {
        const tickets = await db.get(`ticket:${event}:${tickettype}`);
        console.log(tickets)
    }
    catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
    
};


module.exports = {
    getTicketsPage,
    buyticket
};
