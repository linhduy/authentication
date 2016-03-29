module.exports = function(app, passport){
	//==========================
	// HOME PAGE
	//==========================
	app.get('/', function(req, res){
		res.render('index.ejs');
	})

	//==========================
	// LOGIN PAGE (show login form)
	//==========================
	app.get('/login', function(req, res){
		res.render('login.ejs', { message: req.flash('loginMessage') });
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
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	})

	// signup process
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', { user : req.user });
  });
}

function isLoggedIn(req, res, next) {
	console.log("============================================");
	console.log(req);
	console.login("============================================");
	if(req.isAuthenticated()) return next();
	res.redirect('/login');
}