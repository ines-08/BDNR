const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
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
const DEFAULT_ROLE = 'admin'; // TODO: change later

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', './views');
const db = new Etcd3({ hosts: CLUSTER });

// User middleware
const authenticationMiddleware = (req, res, next) => {
    if (req.session.userInfo) {
        next();
    } else {
        req.flash('error', 'You need to login first!');
        res.redirect('/');
    }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
    if (req.session.userInfo && req.session.userInfo.role === 'admin') {
        next();
    } else {
        req.flash('error', 'Non-admin users cannot access this page');
        res.redirect('/home');
    }
};

// Fetch the response of a request
async function getResponse(request) {
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
}

// root
app.get('/', (req, res) => {
    res.render('index', { 
        error_message: req.flash('error'), 
        success_message: req.flash('success') 
    });
});

// home
app.get('/home', authenticationMiddleware, async (req, res) => {
    const search = req.query?.search;
    let events = [];
    console.log("search");
    console.log(search);
    console.log("---------");

    if (search) {
        events = await getResponse(new URL(`/api/search?input=${search}`));
    } else {
        events = await db.getAll().prefix('event:').limit(10).json();
    }

    events = Object.keys(events).map(key => {
        return {
            id: key.split(':')[1],
            ...events[key]
        };
    });

    res.render('home', { 
        userInfo: req.session.userInfo, 
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
app.get('/event', authenticationMiddleware, (req, res) => {
    res.render('event');
});

// profile
app.get('/profile', authenticationMiddleware, (req, res) => {
    res.render('profile');
});

// login action
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.get(`user:${username}`)?.json();  
        if (user && user.password === password) {
            req.session.userInfo = user;
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

// Search events
app.get('/api/search', async (req, res) => {
    const input = req.query?.input;
    const events = [];

    try {
        const matches = await db.get(`search:event:${input}`).json();

        if (matches) {
            for (const id of matches) {
                const event = await db.get(`event:${id}`).json();
                if (event) {
                    event.id = id
                    events.push(event);
                }
            }   
        }

        res.send(JSON.stringify(events, null, 2));

    } catch (error) {
        res.send('Internal server error: lost DB connection');
    }
});

// Create server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});