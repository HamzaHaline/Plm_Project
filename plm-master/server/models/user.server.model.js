var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var config = {
    saltBytes : 16,
    hashBytes: 32,
    iterations: 78912
};

var UserSchema = new Schema({
	email: {
	    type: String,
	},
	username: {
		type: String,
		trim: true,
		required: true
	},
	password: {
	    type: String,
	    required: true
	},
	isAdmin: {
	    type: Boolean,
	    required: true
	},
	isManager: {
	    type: Boolean,
	    required: true
	},
	fromDukeOAuth: {
		type: Boolean,
		require: true
	},
	loggedIn: {
	    type: Boolean,
        required: true
	},
	salt: String
	//provider: String,
	//providerId: String,
	//providerData: {},
	//todos: {}//we will use this in the next tutorial to store TODOs
});

UserSchema.index({ username: 1, fromDukeOAuth: 1}, { unique: true });

UserSchema.pre('save', 
	function(next) {
	    var temp = this;
		if (temp.password) {
		    this.salt = crypto.randomBytes(128).toString('base64');
		    var iterations = 987;

		    for (var i = 0; i<iterations; i++) {
		        this.password += this.salt;
		    }

			var md5 = crypto.createHash('md5');
			this.password = md5.update(this.password).digest('hex');

		}

		next();
	}
);

UserSchema.methods.authenticate = function(password, salt) {
    for (var i = 0; i < 987; i++) {
        password += salt;
    }

	var md5 = crypto.createHash('md5');
	md5 = md5.update(password).digest('hex');

	return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var possibleUsername = username + (suffix || '');

	this.findOne(
		{username: possibleUsername},
		function(err, user) {
			if (!err) {
				if (!user) {
					callback(possibleUsername);
				}
				else {
					return this.findUniqueUsername(username, (suffix || 0) + 1, callback);
				}
			}
			else {
				callback(null);
			}
		}
	);
};

mongoose.model('User', UserSchema);