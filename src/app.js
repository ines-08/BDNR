const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const adminMiddleware = require('./middlewares/adminMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const utils = require('./utils/utils');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const { Etcd3 } = require("etcd3");

const PORT = parseInt(process.argv[2], 10) || 3001;

const CLUSTER = [
    'http://etcd1:2379',
    'http://etcd2:2379',
    'http://etcd3:2379',
    'http://etcd4:2379',
    'http://etcd5:2379'
];

const CLUSTER_DEV = [
    'http://127.0.0.1:2381',
    'http://127.0.0.1:2382',
    'http://127.0.0.1:2383',
    'http://127.0.0.1:2384',
    'http://127.0.0.1:2385'
];

const DEFAULT_ROLE = 'admin'; // TODO: change later

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', './views');
const db = new Etcd3({ hosts: CLUSTER_DEV });

// root
app.get('/', (req, res) => {
    res.render('index', { 
        error_message: req.flash('error'), 
        success_message: req.flash('success') 
    });
});

// home
app.get('/home', authMiddleware, async (req, res) => {
    const search = req.query?.search;
    let events = search 
        ? await utils.getResponse(`http://localhost:${PORT}/api/search?input=${search}`) 
        : await db.getAll().prefix('event:').limit(10).json();

    events = Object.keys(events).map(key => {
        return {
            id: key.split(':')[1],
            ...events[key]
        };
    });

    res.render('home', { 
        user: req.session.userInfo, 
        error_message: req.flash('error'), 
        success_message: req.flash('success'),
        search: search,
        events: events,
    });
});

// admin
app.get('/admin', adminMiddleware, (req, res) => {
    res.render('admin');
});

// event
app.get('/event', authMiddleware, async (req, res) => {
    const eventID = req.query?.id;

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
    
        res.render('event', { 
            event: event,
            tickets: tickets
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
});

// Profile
app.use('/profile', profileRoutes);

// login action
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.get(`user:${username}`)?.json();  
        if (user && user.password === password) {
            req.session.userInfo = { ...user, username: username };
            res.redirect('/home');
        } else {
            req.flash('error', 'Invalid login credentials');
            res.redirect('/');
        }

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
});

// register action
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const user = await db.get(`user:${username}`);
    
        if (!user) {
            const userInfo = { email: email, username: username, password: password, role: DEFAULT_ROLE };
            await db.put(`user:${username}`).value(JSON.stringify(userInfo));
            req.flash('success', 'Registed successfuly');
        } else {
            req.flash('error', 'Invalid register: username already exists!');
        }

        res.redirect('/');

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/');
    }
});

// Search API
app.get('/api/search', async (req, res) => {
    const wordsArray = req.query?.input.split(" ");
    
    // Iterate through the array and decode each word and convert to lowercase
    for (let i = 0; i < wordsArray.length; i++) {
        // Decode the URI component to replace "%20" with space
        wordsArray[i] = decodeURIComponent(wordsArray[i]).toLowerCase();
    }

    const events = [];
    try {
        const eventMatches = new Map();

        for (const input of wordsArray) {
            const matches = await db.getAll().prefix(`search:event:${input}`).json();
            if (matches) {
                for (const key in matches) {
                    for (const id of matches[key]) {
                        if (eventMatches.has(input)) {                
                            eventMatches.get(input).push(id);
                        } else {
                            eventMatches.set(input, [id]);
                        }
                    }
                }
            }
        }
        
        // Filter events that match all words in wordsArray
        const values = Array.from(eventMatches.values());
        const sets = values.map(value => new Set(value));
        const commonWordsArraySet = sets.reduce((accumulator, current) => {
            return new Set([...accumulator].filter(value => current.has(value)));
        });

        const commonWordsArray = Array.from(commonWordsArraySet)

        // Iterate over the commonWordsArray and add the corresponding events to the events array
        for (const event_id of commonWordsArray) {
            const event = await db.get(`event:${event_id}`).json();
            if (event) {
                event.id = event_id;
                events.push(event);
            }
        }
        
        res.send(JSON.stringify(events, null, 2));

    } catch (error) {
        res.send(JSON.stringify([]));
    }
});

// Create server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});