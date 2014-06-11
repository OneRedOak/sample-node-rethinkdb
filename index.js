var express = require("express"),
    nano = require('nano')('http://localhost:5984'),
    app = express();

nano.db.destroy('test');
nano.db.create('test');

var db = nano.db.use('test');

app.get("/", function (req, res) {
  res.send("Hey buddy!");
});

app.get("/:name", function (req, res) {
  db.get(req.params.name, function (err, body) {
    if (body === undefined) {
      db.insert({'name': req.params.name}, req.params.name, function(err, b) {
        if (err) {
          res.send(500);
        } else {
          res.send("Created a new thing with name " + req.params.name);
        }
      });
    } else {
      res.send(body);
    }
  });
});

app.listen(3000, function () {
  console.log('Express listening on port 3000');
});
