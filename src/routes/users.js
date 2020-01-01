const express=require('express');
const User=require('../model/database');
const router=express.Router();

router.get('/signin',(req,res,next)=>{
	res.render('signin');
});
router.post('/signin',async(req,res,next)=>{

});
router.get('/signup',(req,res,next)=>{
	res.render('signup');
});
router.post('/signup',async(req,res,next)=>{
	const {email,name,password,comfirm} = req.body;
        const errors = []
        if(email.length <= 0 || name.length <= 0 || password.length <= 0 || comfirm.length <= 0){
                errors.push({text: 'todos los campos son hobligatorios'});
        }
        if(password.length <= 4){
                errors.push({text: 'la contraseña debe ser mayor de 4 caracteres'});
        }
        if(password != comfirm){
                errors.push({text: 'las contraseñas no coinciden'});
        }
        if(errors.length > 0){
                res.render('signup',{email,name,password,comfirm,errors});
        }else{
                const emailUser = await User.findOne({email: email});
                if(emailUser){
                        res.redirect('/signup');
                        req.flash('error_msg','el correo ya esta en uso');
                }else{
                        const newUser = await new User({name,email,password});
                        newUser.password = newUser.encryptPassword(password);
                        await newUser.save();
                        console.log(newUser);
                        req.flash('success_msg','registrado correctamente');
                        res.redirect('/profile');
                }
        }
});

module.exports=router;
