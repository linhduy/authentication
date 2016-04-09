var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

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

	var facebookAuthFn = function(accessToken, refreshToken, profile, cb){
		console.log('accessToken');
		console.log(accessToken);
		console.log('refreshToken');
		console.log(refreshToken);
		console.log('profile');
		console.log(profile);

		var checkUser = function(profile, cb){
			User.findOne({'facebook.id': profile.id}, function(err, user){
				if(err) return cb(err);
				return cb(null, user || null);
			})
		};
		
		var createUser = function(token, profile, cb){
			var newUser = new User();
			newUser.facebook.id    = profile.id;
			newUser.facebook.token = token;
			newUser.facebook.name = profile.userName || profile.displayName || null;
			newUser.facebook.email = profile.emails[0].value || null;
			newUser.save(function(err){
				if(err) throw err;
				return cb(null, newUser);
			})
		};

		process.nextTick(function(){
			checkUser(profile, function(err, user){
				if(err) return cb(err);
				if(user) return cb(null, user);
				createUser(accessToken, profile, function(err, user){
					if(err) return cb(err);
					if(!user) return cb('could not link to account');
					return cb(null, user);
				})
			});
		});
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

	// authenticate facebook
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: configAuth.facebookAuth.profileFields
	}, facebookAuthFn));

}
