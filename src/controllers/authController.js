const bcrypt=require('bcrypt'), users=require('../models/userModel');
exports.loginForm=(req,res)=>res.render('login');
exports.login=async(req,res,next)=>{try{const user=await users.findByEmail(req.body.correo);if(!user||!await bcrypt.compare(req.body.password,user.password_hash))return res.status(401).render('login',{error:'Correo o contraseña inválidos.'});req.session.user={id:user.id_usuario,nombre:user.nombre,es_admin:user.es_admin};res.redirect('/');}catch(e){next(e)}};
exports.registerForm=(req,res)=>res.render('register');
exports.register=async(req,res,next)=>{try{await users.create({...req.body,password_hash:await bcrypt.hash(req.body.password,12)});res.redirect('/login');}catch(e){next(e)}};
exports.logout=(req,res)=>req.session.destroy(()=>res.redirect('/login'));
