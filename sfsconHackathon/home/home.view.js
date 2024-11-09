const renderHTML = require('../public/public');

function renderView() {
    return renderHTML('home.css', `
        <script>
            function clickEvent() {
                document.getElementById("1").setAttribute("class", "rotate");
            }
        </script>
        <div class="container">
            <a class="scan-button" onclick="clickEvent()" href="/list">Start</a>
            <img src="circle.png" class="circle" id="1">
        </div>
    `);
}

module.exports = { renderView }