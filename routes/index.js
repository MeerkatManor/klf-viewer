
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { title: 'Jobynet' });
};

exports.klf_main = function(req, res) {
	res.render('klf_main', { title: 'Kerbal Live Feed' });
};

exports.klf_user = function(req, res) {
	// This view builds a page with all the player's screenshots. This is not
	// the long-term goal, by any means - just a stopgap until somebody codes
	// something smart, like a proper image gallery with filters and stuff.
	//
	// Since there's no database underneath and we currently store all the
	// file names in a giant list, unfortunately we will have to traverse
	// the entire file list to filter out a user's screenshots.
	//
	// So, we walk through the global file list, and for each file that has
	// a filename that corresponds with the requested user, we add it to a
	// new list. This list gets passed to the view to build the page.

	var localfiles = [];
	for (file in global_files) {
		var file_string = global_files[file];
		// Pull the username out of the filename
		var extracted_user = file_string.substring(0, file_string.length - global_timestamp_len);
		// Does it match the requested user?
		if (req.params.user === extracted_user) {
			// Push the filename
			localfiles.push(file_string);
		} else {
		}
	}
	res.render('klf_user', { title: req.params.user + '\'s Live Feed', user: req.params.user, userfiles: localfiles.reverse() });
	// });
};

