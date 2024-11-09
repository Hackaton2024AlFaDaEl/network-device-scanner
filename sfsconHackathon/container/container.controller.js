
const view = require("./container.view");
const model = require("./container.model");

function startNetwork(req, res) {
    model.scanNetwork()
        .then(next => res.send(view.renderView(next)))
        .catch(next => res.redirect("/"));
}

module.exports = { startNetwork };