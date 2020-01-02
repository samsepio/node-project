const helpers = {};

helpers.isAuthenticated = (req,res,next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error_msg','debes iniciar secion');
	res.redirect('/signin');
};

module.exports=helpers;
