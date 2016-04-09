var async = require("async");

module.exports = function(app, passport){
	//==========================
	// HOME PAGE
	//==========================
	app.get('/', function(req, res){
		// async.auto({ 
		// 	get_data: function(callback){ 
		// 		console.log('in get_data');
		// 		callback(null, 'data', 'converted to array'); 
		// 	}, 
		// 	make_folder: function(callback){ 
		// 		console.log('in make_folder');
		// 		callback(null, 'folder'); 
		// 	},
		// 	write_file: ['get_data', 'make_folder', function(callback, results){ 
		// 		console.log('in write_file', results); 
		// 		callback(null, 'filename'); 
		// 	}] 
		// 	// email_link: ['write_file', function(callback, results){ 
		// 	// 	console.log('in email_link', JSON.stringify(results));
		// 	// 	callback(null, {'file':results.write_file, 'email':'user@example.com'}); 
		// 	// }] 
		// }, function(err, results) { 
		// 	console.log('err = ', err); 
		// 	console.log('results = ', results); 
		// 	res.render('index');
		// });
		res.render('index');
	})

	//==========================
	// LOGIN PAGE (show login form)
	//==========================
	app.get('/login', function(req, res){
		res.render('login', { message: req.flash('loginMessage') });
	})
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	//==========================
	// SIGN UP PAGE (show sign up form)
	//==========================
	app.get('/signup', function(req, res){
		res.render('signup', { message: req.flash('signupMessage') });
	})

	// signup process
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', { user : req.user });
  });

	//==========================
	// LOGIN FACEBOOK PAGE (show login facebook form)
	//==========================
	app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));

}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) return next();
	res.redirect('/login');
}