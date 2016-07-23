var normalizedPath = require("path").join(__dirname, "../app/policies");
var policies = {};
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    // require("./routes/" + file);
    console.log("normalizedPath --------_> ", normalizedPath);
   	console.log("file -------------------> ", file);

   	var dir = normalizedPath + "/" + file;

   	var objName = file.slice(0, file.indexOf("."));

   	var checkAdmin = require(dir);
   	policies[objName] = require(dir);
});

module.exports = policies;