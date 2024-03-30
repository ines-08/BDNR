async function getAdminPage(db, req, res) {

    try {
        res.render('admin', {});

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getAdminPage
};