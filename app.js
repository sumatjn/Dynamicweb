const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');
//var morgan = require('morgan');
const port = 4000;

var menu = [
    {'name':'Home','link':'/'},
    {'name':'Restaurants','link':'/restaurants'},
    {'name':'City','link':'/city'},
    {'name':'Contact Master','link':'/city'}
  ]

app.use(cors());


//Static File path
app.use(express.static(__dirname+'/public'));
//html
app.set('views','./src/views');


//view engine
app.set('view engine','ejs');

//For logs
//app.use(morgan('tiny'))

app.get('/',function(req,res){
    //res.send("<h1>Hiii From express</h1>")
    res.render('index',{title:'index Page',menu:menu})
    
});


app.get('/api/auth/register',function(req,res){
    //res.send("<h1>Hiii From express</h1>")
    res.render('register',{title:'Register Page',menu:menu})
    
});


app.get('/api/auth/login',function(req,res){
    //res.send("<h1>Hiii From express</h1>")
    res.render('Login',{title:'Home Page',menu:menu})
    
});

app.get('/Userdetails',function(req,res){
    //res.send("<h1>Hiii From express</h1>")
    //res.render('Login',{title:'Home Page',menu:menu})
    res.render('Userdetails')
    console.log('Test login Done details1');
});

app.get('/addContact',function(req,res){
    res.render('Addcontactus');
    console.log('Test login Done Userdetails');
});


//Add the user
app.post('/addContact',(req,res) => {
    console.log(req.body);
    const data = {
        "_id":parseInt(req.body._id),
        "name":req.body.name,
        "city":req.body.city,
        "phone":req.body.phone,
        "isActive":true
    }
    db.collection(col_name).insert(data,(err,result) => {
        if(err){
            throw err
        }else{
            res.redirect('/')
        }
    })
});

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})