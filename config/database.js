// var url = 'localhost'
// var dbName = 'authenticatedDb';
var url = "ds061355.mlab.com:61355"
var dbName = 'heroku_c8n7mw7p';
var user = 'linhduy';
var pwd = 'nguyenlinhduy9820';

var options = {
	user: user,
	pass: pwd
}
module.exports = {
	uri: 'mongodb://' + url + '/' + dbName,
	options: options
}