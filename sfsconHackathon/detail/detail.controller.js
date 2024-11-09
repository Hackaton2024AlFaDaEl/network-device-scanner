
const view = require("./detail.view");
const model = require("./detail.model");

function initDetail(req, res) {
    console.log(req.query);

    ip = req.query.ip;
    manu = req.query.manu;
    model.fetchAndProcessCVEs(manu).then(cve => {
        res.send(view.renderView(cve));
    });
}

module.exports = { initDetail };