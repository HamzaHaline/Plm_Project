var User = require('mongoose').model('User');
var Storage = require('mongoose').model('Storage');

exports.initDatabase = function() {

    User.findOne({username: 'admin'}, function(err, obj){
        if (!obj) {
            var admin = new User();
            admin.username = 'admin';
            admin.password = 'PassworD';
            admin.email = 'random@duke.edu';
            admin.isAdmin = true;
            admin.loggedIn = false;
            admin.save(function(err){
                //console.log(admin);
            });
        }
    });

    Storage.findOne({temperatureZone: 'freezer'}, function(err, obj){
        if (!obj) {
            var storage = new Storage();
            storage.temperatureZone = 'freezer';
            storage.capacity = 20000;
            storage.save(function(err){
                //console.log(admin);
            });
        }
    });

    Storage.findOne({temperatureZone: 'refrigerator'}, function(err, obj){
        if (!obj) {
            var storage = new Storage();
            storage.temperatureZone = 'refrigerator';
            storage.capacity = 20000;
            storage.save(function(err){
                //console.log(admin);
            });
        }
    });

    Storage.findOne({temperatureZone: 'warehouse'}, function(err, obj){
        if (!obj) {
            var storage = new Storage();
            storage.temperatureZone = 'warehouse';
            storage.capacity = 20000;
            storage.save(function(err){
                //console.log(admin);
            });
        }
    });

    return true;
}