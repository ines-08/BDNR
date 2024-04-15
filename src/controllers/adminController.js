const utils = require('../utils/utils');
const { v4: uuidv4 } = require('uuid');

async function getStatistics(db, req, res) {
    let stats = {}
   
    let event_types = await db.getAll().prefix(`search:type:`).keys()
    event_types = event_types.map(type => type.split(':')[2]);
    
    for (const event_type of event_types) {
        const events = await db.get(`search:type:${event_type}`).json();
        let total = 0;
        stats[event_type] = {};
        for (const event_id in events) {
            let ticket_types = await db.getAll().prefix(`ticket:${events[event_id]}:`).keys()
            ticket_types = ticket_types.map(type => type.split(':')[2]);
            for (const ticket_type in ticket_types) {
                const details = await db.get(`ticket:${events[event_id]}:${ticket_types[ticket_type]}`).json();
                const price_per_ticket_type = details.price * (details.total_quantity - details.current_quantity);
                total += price_per_ticket_type;
                if (!stats[event_type][ticket_types[ticket_type]])
                    stats[event_type][ticket_types[ticket_type]] = price_per_ticket_type;
                else
                    stats[event_type][ticket_types[ticket_type]] += price_per_ticket_type;

            }
        }
        stats[event_type]['total'] = total;
    }
    return stats;

}

async function createEvent(db, req, res) {
    const event_id = uuidv4();
    console.log(event_id);
    
    let initial_quantity = 0
    let ticketTypes = getTicketTypes();
    ticketTypes.forEach(ticketType => {
        const quantityKey = `${ticketType.toLowerCase()}TotalQuantity`;
        initial_quantity += parseInt(req.body[quantityKey]) || 0; // Add quantity to current_quantity
    });

    try { 
        const eventInfo = { 
            name: req.body.eventName,
            description : req.body.eventDescription,
            location : req.body.eventLocation,
            type : req.body.eventType,
            date : req.body.eventDate.replace('T', ' '),
            current_quantity: initial_quantity
        }
        console.log(eventInfo)
        await db.put(`event:${event_id}`).value(JSON.stringify(eventInfo));

        // add tickets
        for (const ticketType of ticketTypes) {
            const ticketTypeLowerCase = ticketType.toLowerCase();
            const quantityKey = `${ticketTypeLowerCase}TotalQuantity`;
            const priceKey = `${ticketTypeLowerCase}TicketPrice`;
            const ticketInfo = {
                total_quantity: req.body[quantityKey],
                current_quantity: req.body[quantityKey],
                price: req.body[priceKey]
            };
            console.log(ticketInfo);

            await db.put(`ticket:${event_id}:${ticketTypeLowerCase}`).value(JSON.stringify(ticketInfo));
        }

        req.flash('success', 'Event successfully generated');
        res.redirect(`/event?id=${event_id}`);
    } catch (error) {
    req.flash('error', 'Internal server error: lost DB connection');
    res.redirect('/home');
    }

}

function getTicketTypes() {
    return ['Pink', 'Yellow', 'Green', 'Red'];
}

async function getAdminPage(db, req, res) {

    try {

        const clusterInfo = await utils.getClusterMembers(utils.config.cluster.dev[0]);
        const nodes = [];
        
        for (const node of utils.config.cluster.dev) {

            try {
                const nodeInfo = await utils.getNodeInfo(node);
                nodes.push(JSON.stringify(nodeInfo))
            } catch (error) {
                nodes.push(JSON.stringify({ name: node, message: "NOT FOUND, MORREU!" }));
            }
        }
        const stats = await getStatistics(db, req, res);

        let eventTypes = await db.getAll().prefix('search:type:').keys();   
        eventTypes = eventTypes.map(type => type.split(":").pop());

        let eventLocations = await db.getAll().prefix('search:location:').keys();   
        eventLocations = eventLocations.map(type => type.split(":").pop());

        const ticketTypes = getTicketTypes();
        
        res.render('admin', {
            clusterInfo: JSON.stringify(clusterInfo),
            nodes: nodes,
            statistics: stats,
            eventTypes: eventTypes,
            eventLocations: eventLocations,
            ticketTypes: ticketTypes,
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getAdminPage,
    createEvent
};