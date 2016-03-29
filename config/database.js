var url = 'localhost'
var dbName = 'authenticatedDb';
var user = 'linhduyit';
var pwd = '123456';

var options = {
	user: user,
	pass: pwd
}
module.exports = {
	uri: 'mongodb://' + url + '/' + dbName,
	options: options
}