const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const { Etcd3 } = require("etcd3");

const profileRoutes = require('./routes/profileRoutes');
const homeRoutes = require('./routes/homeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rootRoutes = require('./routes/rootRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { getSearchResults } = require('./controllers/apiController');

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

const db = new Etcd3({ hosts: CLUSTER_DEV });
const app = express();
const PORT = parseInt(process.argv[2], 10) || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', './views');

// Root
app.use('/', rootRoutes(db));
app.use('/login', rootRoutes(db));
app.use('/register', rootRoutes(db));

// Home
app.use('/home', homeRoutes(db));

// Admin
app.use('/admin', adminRoutes(db));

// Event
app.use('/event', eventRoutes(db));

// Profile
app.use('/profile', profileRoutes(db));

// Search Events API
app.get('/api/search', async (req, res) => await getSearchResults(db, req, res));

// Server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});