//controller used by the template
exports.render = function(req, res) {
    res.render('index', { //see views/index.ejs
    	title: 'MEAN MVC',
    	user: req.user ? req.user.username : ''
    });
};