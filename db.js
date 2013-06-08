var sqlite3 = require('sqlite3').verbose();

// Empty string means database not persisted after closing
var db = new sqlite3.Database('');

var createTables = function() {
    // Does the initial database setup. Only call this function once.
    db.serialize(function() {
        db.run("CREATE TABLE users (user_id INTEGER PRIMARY KEY ASC, name TEXT, UNIQUE(name))");
        db.run("CREATE TABLE images ( \
            image_id INTEGER PRIMARY KEY ASC, \
            name TEXT, \
            timestamp TEXT, \
            user_id INTEGER NOT NULL, \
            FOREIGN KEY(user_id) REFERENCES users(user_id) \
            )");
    });
}

var createUser = function(name, callback) {
    // Inserts a single user into the database
    // @param (string) name
    // @param (function) callback Called with the inserted user's ID

    db.run("INSERT INTO users (name) VALUES (?)", name, function(err) {
        if (err) {
            return console.error(err);
        }
        if (callback) callback(this.lastID);
    });
}

var getUsers = function(callback) {
    // Retrieves all users from the database
    // @param (function) callback Called with all user rows in the database

    db.all("SELECT * FROM users", function(err, rows) {
        if (err) {
            return console.error(err);
        }
        callback(rows);
    });
}

var createImage = function(name, timestamp, user_id, callback) {
    // Inserts a single image into the database
    // @param (string) name
    // @param (Date) timestamp
    // @param (int) user_id
    // @param (function) callback Called with the inserted image's ID

    ts = timestamp.toISOString();
    db.run("INSERT INTO images (name, timestamp, user_id) VALUES (?, ?, ?)", name, ts, user_id, function(err) {
        if (err) {
            return console.error(err);
        }
        if (callback) callback(this.lastID);
    });
}

createTables();

createUser('one', function(user_id){
    createImage('image1', new Date(), user_id);

    db.each("SELECT image_id, name, user_id, timestamp FROM images", function(err, row) {
        console.log(row.image_id + ": " + row.name + ', ' + row.user_id + ', ' + new Date(row.timestamp));
    });
});
createUser('two');

getUsers(function(users) {
    console.log(users);
});

db.close();
