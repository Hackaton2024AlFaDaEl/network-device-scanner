
const view = require("./detail.view");
const model = require("./detail.model");

function initDetail(req, res) {
    ip = req.query.ip;
    
    model.fetchAndProcessCVEs(ip).then(cve => {
        res.send(view.renderView(cve));
    });
}

module.exports = { initDetail };