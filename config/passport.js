var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	})

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		})
	})

	var signupFn = function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err, user){
				if(err) return done(err);

				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken.'));
				} else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if(err) throw err;
						return done(null, newUser);
					});
				}
			})
		})
	}

	var loginFn = function(req, email, password, done){
		User.findOne({'local.email': email}, function(err, user){
			if(err) return done(err);
			if(!user) return done(null, false, req.flash('loginMessage', 'Could not found user'));
			if(!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Wrong password'));

			return done(null, user);
		})
	}

	// create local signup handle
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, signupFn));

	// create local login handle
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, loginFn));

}
