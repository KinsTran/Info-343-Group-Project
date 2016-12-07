var express = require("express");
var Yelp = require("yelp");

var app = express();
var yelp = new Yelp({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.TOKEN,
    token_secret: process.env.TOKEN_SECRET
});

app.use(express.static("./static"));

// fetches the data from the Yelp API using the "yelp" module
app.get("/api/v1/search", function(req, res, next) {
    var params = {
        term: "restaurant",
        ll: req.query.lat + "," + req.query.lng
    };
    yelp.search(params)
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json(err);
        });
});

app.listen(3000, function() {
    console.log("server is listening on http://localhost:3000");
});