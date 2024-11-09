const view = require("./home.view");


function load(req, res) {
    res.send(view.renderView())
}

module.exports = { load }