const utils = require('../utils/utils');
const { v4: uuidv4 } = require('uuid');

async function getStatistics(db, req, res) {
    let stats = {}
    const event_types = await utils.getEventTypeKeys(db);
    
    for (const event_type of event_types) {
        const events = await db.get(`search:type:${event_type}`).json();
        let total = 0;
        stats[event_type] = {};
        for (const event_id in events) {
            
            const ticket_types = await utils.getTicketTypes(db);

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
    
    let initial_quantity = 0
    let ticketTypes = await utils.getTicketTypes(db);
    ticketTypes.forEach(ticketType => {
        const quantityKey = `${ticketType.toLowerCase()}TotalQuantity`;
        initial_quantity += parseInt(req.body[quantityKey]) || 0;
    });

    try {
        // add event
        const eventInfo = { 
            name: req.body.eventName,
            description : req.body.eventDescription,
            location : req.body.eventLocation,
            type : req.body.eventType,
            date : req.body.eventDate.replace('T', ' '),
            current_quantity: initial_quantity
        }
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

            await db.put(`ticket:${event_id}:${ticketTypeLowerCase}`).value(JSON.stringify(ticketInfo));
        }

        // add words to search index
        const words = utils.getWords([req.body.eventName, req.body.eventDescription, req.body.eventLocation]);
        for (const word of words) {
            const wordIndex = await db.get(`search:text:${word}`);
            if (wordIndex) {
                const wordIndexArray = JSON.parse(wordIndex);
                wordIndexArray.push(event_id);
                await db.put(`search:text:${word}`).value(JSON.stringify(wordIndexArray));
            }
            else {
                await db.put(`search:text:${word}`).value(JSON.stringify([event_id]));
            }
        }

        // add location and type to their respective indexes
        const eventTypeKeys = await utils.getEventTypeKeys(db);
        const eventLocationKeys = await utils.getEventLocationKeys(db);
        const eventTypeAndLocationKeys = eventTypeKeys.concat(eventLocationKeys);

        for (const key of eventTypeAndLocationKeys){
            const eventIndex = await db.get(`${key}`);
            if ( eventIndex ) {
                const eventIndexArray = JSON.parse(eventIndex);
                eventIndexArray.push(event_id);
                await db.put(key).value(JSON.stringify(eventIndexArray));
            }
        }

        req.flash('success', 'Event successfully generated');
        res.redirect(`/home`);

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
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
        const eventTypes = await utils.getEventTypeKeys(db); 
        const eventLocations = await utils.getEventLocationKeys(db);   
        const ticketTypes = await utils.getTicketTypes(db);
        
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
    getStatistics,
    getAdminPage,
    createEvent
};