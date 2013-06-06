
// getUniqueSubstrings returns a list of all unique strings extracted
// from the provided list of strings with trailing characters removed
function getUniqueSubstrings (items, trailer_len) {
	extracted_strings = [];
	for (var item in items) {
		var item_string = items[item];
		// Remove the trailer from the full string
		var extracted_string = item_string.substring(0, item_string.length - trailer_len);
		// If the extracted string isn't already in the list
		if (extracted_strings.indexOf(extracted_string) < 0) {
			// Add the extracted string
			extracted_strings.push(extracted_string);
		}
	}
	return extracted_strings;
};

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs'); // fs will be used to read and watch files

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* THE POOR MAN'S DATABASE
 *
 * Just to get this thing working, since it's about time I actually
 * played some Kerbal instead of working on this system, we'll keep
 * a global list of file names and a global list of user names.
 * These lists will be accessed by the view methods and any API
 * calls until there's a need for a full blown database.
 *
 * Iterating over the player list is quick since there are only a
 * few players, but as the screenshot lists grows, iterating over
 * the file list is going to be painful.
 */

// length of the timestamp in the filename
// used for extracting the user name from the file name
global_timestamp_len = 24;
// build the global list of files
global_files = fs.readdirSync('./public/images/klf');
// build the global of klf users
global_klf_users = getUniqueSubstrings(global_files, global_timestamp_len);

// watch the directory for new and changed files
fs.watch('./public/images/klf', function(event, filename) {
	if (event === 'rename') {
		// if the file isn't already in files
		if (global_files.indexOf(filename) < 0) {
			// add it
			console.log('Adding file: \'' + filename + '\'');
			global_files.push(filename);
		} else {
			// Find it and remove it? Rename it? Something needs to
			// happen here. For the time being, screenshots never get
			// deleted or are renamed in KLF
		}
		// rebuild the player list in case any new players have posted
		// a screenshot
		global_klf_users = getUniqueSubstrings(global_files, global_timestamp_len);
	}
});

app.get('/', routes.index);
app.get('/klf', routes.klf_main);
app.get('/klf/:user?', routes.klf_user);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
