const utils = require('../utils/utils');

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

        res.render('admin', {
            clusterInfo: JSON.stringify(clusterInfo),
            nodes: nodes,
        });

    } catch (error) {
        req.flash('error', 'Internal server error: lost DB connection');
        res.redirect('/home');
    }
}

module.exports = {
    getAdminPage
};