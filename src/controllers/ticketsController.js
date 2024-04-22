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
            user: req.session.userInfo,
            eventid: eventID, 
            event: event,
            tickets: tickets
        });

    } catch (error) {
        req.flash('error', 'Error to get tickets page');
        res.redirect('/home');
    }
};

async function buyTickets(db, req, res) {

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

    let now = new Date();
    let d = now.toLocaleString();
    const data = {
         "date": d,
         "tickets": value
    }
    
    try {

        let oldEvent = await db.get(`event:${eventID}`).json();
        let oldData = await db.get(`purchase:${username}:${eventID}`).json();

        if (oldData) {
            oldData.push(data);
            await db.put(`purchase:${username}:${eventID}`).value(JSON.stringify(oldData));
        } else {
            await db.put(`purchase:${username}:${eventID}`).value(JSON.stringify([data]));
        }

        for (let v in value) {
            let oldTickets = await db.get(`ticket:${eventID}:${value[v].type}`).json();
            let data = {
                'total_quantity': oldTickets.total_quantity,
                'current_quantity': oldTickets.current_quantity - value[v].quantity,
                'price': oldTickets.price
            }
            await db.put(`ticket:${eventID}:${value[v].type}`).value(JSON.stringify(data));
            oldEvent.current_quantity -= value[v].quantity
        }

        await db.put(`event:${eventID}`).value(JSON.stringify(oldEvent));
        req.flash('success', `Tickets purchased successfully!`);
        res.redirect(`/event?id=${eventID}`);

    } catch (error) {

        req.flash('error', 'Error in purchasing tickets action');
        res.redirect('/home');
    }
};

async function deleteTickets(db, req, res) {

    const username = req.session.userInfo.username;
    const eventID = req.body.event;

    try {

        const purchase = await db.get(`purchase:${username}:${eventID}`).json();
        let oldEvent = await db.get(`event:${eventID}`).json();

        let mantained = [];
        let deleted = [];
        for (let key in purchase) {
            if (purchase[key].date != req.body.date) {
                mantained.push(purchase[key]);
            } else {
                deleted = purchase[key];
            }
        }
        
        for (let index in deleted.tickets) {
    
            let oldTickets = await db.get(`ticket:${eventID}:${deleted.tickets[index].type}`).json();

            let data = {
                'total_quantity': oldTickets.total_quantity,
                'current_quantity': oldTickets.current_quantity + Number(deleted.tickets[index].quantity),
                'price': oldTickets.price
            }
            oldEvent.current_quantity += Number(deleted.tickets[index].quantity);
            await db.put(`ticket:${eventID}:${deleted.tickets[index].type}`).value(JSON.stringify(data));
        }
    
        await db.put(`event:${eventID}`).value(JSON.stringify(oldEvent));
        await db.put(`purchase:${username}:${eventID}`).value(JSON.stringify(mantained));

        req.flash('success', `Tickets deleted successfully!`);
        res.redirect(`/profile?username=${username}`);

    } catch(error) {
        req.flash('error', 'Error deleting tickets');
        res.redirect('/home');
    }
}

module.exports = {
    getTicketsPage,
    buyTickets,
    deleteTickets
};
