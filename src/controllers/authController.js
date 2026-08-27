const bcrypt=require('bcrypt'), users=require('../models/userModel');
exports.loginForm=(req,res)=>res.render('login');
const esHashBcrypt=h=>/^\$2[aby]\$/.test(h||'');
exports.login=async(req,res,next)=>{try{const user=await users.findByEmail(req.body.correo);const valido=user&&(esHashBcrypt(user.password_hash)?await bcrypt.compare(req.body.password,user.password_hash):req.body.password===user.password_hash);if(!valido)return res.status(401).render('login',{error:'Correo o contraseña inválidos.'});req.session.user={id:user.id_usuario,nombre:user.nombre,es_admin:user.es_admin};res.redirect('/');}catch(e){next(e)}};
exports.registerForm=(req,res)=>res.render('register');
exports.register=async(req,res,next)=>{try{await users.create({...req.body,password_hash:await bcrypt.hash(req.body.password,12)});res.redirect('/login');}catch(e){if(e.code==='23505')return res.status(409).render('register',{error:'Ese correo ya está registrado.'});next(e);}};
exports.logout=(req,res)=>req.session.destroy(()=>res.redirect('/login'));
