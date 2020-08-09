const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('./UserSchema');
const app = express();

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());





//Register User
router.post('/register',(req,res) => {
    var hashedpassword = bcrypt.hashSync(req.body.password,8);
    User.create({
        name:req.body.name,
        email:req.body.email,
        password:hashedpassword,
        role:req.body.role?req.body.role:'User',
    },(err,user) => {
        if(err) return res.status(500).send("Error in resgiter");
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Comtrol-Allow-Headers','Origin, X-Requested-With,Content-Type,Accept');
        res.status(200).send("Regsitration Successful");
        console.log('Regsitration');
    })
});





//login
router.post('/login',(req,res) => {
    console.log(req.body.email);
    console.log(req.body.password);
   // User.findOne({email:JSON.stringify(req.body.email)},(err,user)=>{
    User.findOne({email:req.body.email},(err,user)=>{
        if(err) return res.status(500).send("Error on server");
        if(!user)return res.status(404).send('No User Found');
        else{
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(401).send({auth:false,token:null})
            var token = jwt.sign({id:user._id},config.secert,{expiresIn:86400});
            //res.header('x-access-token',token);
           //res.send({auth:true,token:token})
         //  res.send({redirect: '/api/auth/Userdetails'});
         console.log(token);
         if(token)
         {
            console.log('Test login token');
        // res.header('x-access-token', token);
         res.send({redirect: '/api/auth/Userdetails?token='+token});
         }

            console.log('Test login Done');

        //  res.header('x-access-token', token);
           // res.send();
            //res.redirect('/Userdetails');
        }
       
    })
     
    
})


//GetUser Info
router.get('/userInfo',(req,res) => {
    //var token = req.headers['x-access-token'];
    var query = require('url').parse(req.url,true).query;
    var token=query.token;
    console.log('Test login Done details3');
    console.log(token);

   // var token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMWM4ZjY3MTM2MTNlMzE4OGI4MGYzZCIsImlhdCI6MTU5NjM4MTcwNSwiZXhwIjoxNTk2NDY4MTA1fQ.EqgSCZkel7oXQ82HoJSO_9Dj6HfNySilYw6JfAXCZT0";
    if(!token) res.status(401).send({auth:false,token:'No Token Provided'})
    jwt.verify(token,config.secert,(err,data) => {
        if(err) return res.status(500).send('Error in Token');
        User.findById(data.id,{password:0},(err,user) => {
            if(err) return res.send("Error finding user")
            if(!user) return res.send("No user Found")
            console.log('Test login Done1');
            //res.send(user)

          // res.redirect('/Userdetails');
           res.render('Userdetails',{title:'User details',user:user});
              
           console.log(user);
          //console.log(user.email);
            console.log('Test login Done5');

        })
        
    })
    //res.redirect('/Userdetails');
   

})



router.get('/Userdetails',(req,res)=> {
    
    var query = require('url').parse(req.url,true).query;
var token=query.token;
console.log('Test login Done details1');
console.log(token);
    res.redirect('/api/auth/userInfo?token='+token);
   // res.render('Userdetails');
    //res.redirect('/Userdetails');
    console.log('Test login Done details');

});

//Get all user
router.get('/users',(req,res) => {
    User.find({},(err,user) => {
        if(err) throw err;
        res.send(user)
    })
})

module.exports = router;
