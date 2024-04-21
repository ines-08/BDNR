const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const profileRoutes = require('./routes/profileRoutes');
const homeRoutes = require('./routes/homeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes')
const rootRoutes = require('./routes/rootRoutes');
const adminRoutes = require('./routes/adminRoutes');
const utils = require('./utils/utils');

const { Etcd3 } = require("etcd3");
const { getSearchResults } = require('./controllers/apiController');

const app = express();
const db = new Etcd3({ hosts: utils.config.cluster.dev });
const PORT = utils.config.port

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
app.use('/logout', rootRoutes(db));

// Home
app.use('/home', homeRoutes(db));

// Admin
app.use('/admin', adminRoutes(db));

// Event
app.use('/event', eventRoutes(db));

// Tickets
app.use('/tickets', ticketsRoutes(db));
app.use('/buytickets', ticketsRoutes(db));
app.use('/deletetickets', ticketsRoutes(db));

// Profile
app.use('/profile', profileRoutes(db));

// Search Events API
app.get('/api/search', async (req, res) => await getSearchResults(db, req, res));

// Server
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});