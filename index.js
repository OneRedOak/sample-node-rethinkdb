var express = require("express"),
    r = require('rethinkdb'),
    app = express();

var connection = null;
r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
  if (err) {
    conosle.log('Error connecting to RethinkDB: ' + err);
  } else {
    connection = conn;
  }
});

app.get("/", function (req, res) {
  res.send("Hey buddy!");
});

app.get("/:name", function (req, res) {
  r.table('table').filter(r.row('name').eq(req.params.name)).
    run(connection, function(err, cursor) {
      if(cursor.length < 1) {
        r.table('table').insert({
          name: req.params.name
        }).run(connection, function(err, result) {
          if (err) {
            res.send(500);
          }
          res.send('Created a new thing with name ' + req.params.name);
        });
      } else {
        cursor.toArray(function(err, result) {
          if (err) {
            console.log('Error converting data: ' + err);
          }
          console.log(JSON.stringify(result, null, 2));
          res.send(JSON.stringify(result, null, 2));
        });
      }
    });
/*
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
*/
});

app.listen(3000, function () {
  console.log('Express listening on port 3000');
});
