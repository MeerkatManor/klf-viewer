var sqlite3 = require('sqlite3').verbose();

// Empty string means database not persisted after closing
var db = new sqlite3.Database('');

var createTables = function() {
    db.serialize(function() {
        db.run("CREATE TABLE users (user_id INTEGER PRIMARY KEY ASC, name TEXT, UNIQUE(name))");
        db.run("CREATE TABLE images (image_id INTEGER PRIMARY KEY ASC, name TEXT, timestamp TEXT)");
    });
}

var createUsers = function(users) {
    db.serialize(function() {
        var query = db.prepare("INSERT INTO users (name) VALUES (?)"),
            i;

        for (i = 0; i < users.length; i++) {
            query.run(users[i]);
        }

        query.finalize();
    });
}

var createImage = function(name, timestamp) {
    ts = timestamp.toISOString();
    db.run("INSERT INTO images (name, timestamp) VALUES (?, ?)", name, ts);
}

createTables();
createUsers(['one', 'two', 'three']);
createImage('image1', new Date());
db.each("SELECT image_id, name, timestamp FROM images", function(err, row) {
    console.log(row.image_id + ": " + row.name);
    console.log(new Date(row.timestamp));
});

db.close();
