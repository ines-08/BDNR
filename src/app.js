const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const adminMiddleware = require('./middlewares/adminMiddleware');
const profileRoutes = require('./routes/profileRoutes');
const homeRoutes = require('./routes/homeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rootRoutes = require('./routes/rootRoutes');
const { getSearchResults } = require('./controllers/apiController');

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

// Root
app.use('/', rootRoutes(db));
app.use('/login', rootRoutes(db));
app.use('/register', rootRoutes(db));

// Home
app.use('/home', homeRoutes(db));

// Admin
app.get('/admin', adminMiddleware, (req, res) => {
    res.render('admin');
});

// Event
app.use('/event', eventRoutes(db));

// Profile
app.use('/profile', profileRoutes(db));

// Search API
app.get('/api/search', (req, res) => getSearchResults(db, req, res));

// Server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});