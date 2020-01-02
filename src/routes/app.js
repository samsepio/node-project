const express=require('express');
const Image=require('../model/database2');
const router=express.Router();
const {isAuthenticated} = require('../config/auth');

router.get('/profile',(req,res,next)=>{
	res.render('profile');
});
router.post('/profile',async(req,res,next)=>{
	const {title,description,year,name,descript,favorite} = req.body;
	const errors = [];
	if(title.length <= 0 || description.length <= 0 || year.length <= 0 || descript.length <= 0 || favorite.length <= 0){
		errors.push({text: 'todos los campos son hobligatorios'});
	}
	if(year >= 18 || year <= 6){
		errors.push({text: 'Edad No Permitida'});
	}
	if(errors.length > 0){
		res.render('profile',{title,description,year,name,descript,favorite,errors});
	}else{
		const image = new Image();
        	image.title = req.body.title;
        	image.description = req.body.description;
        	image.descript = req.body.descript;
        	image.year = req.body.year;
        	image.religion = req.body.religion;
        	image.favorite = req.body.favorite;
        	image.filename = req.file.filenme;
        	image.originalname = req.file.originalname;
        	image.mimetype = req.file.mimetype;
        	image.path = '/img/uploads/'+req.file.filename;
        	image.size = req.file.size;
        	image.fieldname = req.file.fieldname;
        	image.encoding = req.file.encoding;
        	await image.save();
        	console.log(image);
		res.redirect('/profiles');
	};
});
router.get('/profiles',isAuthenticated,async(req,res,next)=>{
	const images = await Image.find();
	res.render('profiles',{
		images
	});
});

module.exports=router;
