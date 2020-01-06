const express=require('express');
const Image=require('../model/database2');
const router=express.Router();
const path=require('path');
const {unlink}=require('fs-extra');
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
		image.name = req.body.name;
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
		image.user = req.user.id;
        	await image.save();
        	console.log(image);
		res.redirect('/profiles');
	};
});
router.get('/edit/:id',isAuthenticated,async(req,res,next)=>{
	const dimages = await Image.findById(req.params.id);
	res.render('edit',{
		dimages
	})
});
router.put('/edit/:id',async(req,res,next)=>{
	const {title,description,name,year,favorite,descript} = req.body;
	const errors = [];
	if(title.length <= 0 || description.length <= 0 || descript.length <= 0 || name.length <= 0 || year.length <= 0 || favorite.length <= 0){
		errors.push({text: 'todos los campos son hobligatorios'});
	}
	if(year <= 6 || year >= 18){
		errors.push({text: 'la edad no es valida'});
	}
	if(errors.length > 0){
		res.render('edit',{title,description,descript,favorite,name,year,errors});
	}else{
		await Image.findByIdAndUpdate(req.params.id,{title,description,descript,year,name,favorite});
        	res.redirect('/profiles');
	}
});
router.get('/search',isAuthenticated,async(req,res,next)=>{
	res.render('search');
});
router.post('/search',async(req,res,next)=>{
	const {name} = req.body;
	const nameUser = await Image.findOne({name: name});
	if(nameUser){
		res.render('search');
	}else{
		res.send('usuario no encontrado');
	}
});
router.get('/delete/:id',isAuthenticated,async(req,res,next)=>{
	const {id} = req.params;
	const image = await Image.findByIdAndDelete(id);
	unlink(path.resolve('./src/public/'+image.path));
	req.flash('success_msg','perfil heliminado correctamente ahora create otro')
	res.redirect('/profile');
});
router.get('/myperfil',isAuthenticated,async(req,res,next)=>{
	const imagess = await Image.find({user: req.user.id});
	res.render('myperfil',{
		imagess
	});
});
router.get('/img/:id',isAuthenticated,async(req,res,next)=>{
	const image = await Image.findById(req.params.id);
	console.log(image);
	res.render('user',{
		image
	})
});
router.get('/profiles',isAuthenticated,async(req,res,next)=>{
	const images = await Image.find();
	res.render('profiles',{
		images
	});
});

module.exports=router;
