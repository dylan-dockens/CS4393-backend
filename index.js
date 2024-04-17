const port = 4000;
const express = require("express");
const jsonwebtokenerror = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");



app.use(express.json());
app.use(cors());

// Database connection with MongoDB: mongodb+srv://patelv0227:<password>@cluster0.jneaddo.mongodb.net/
mongoose.connect("mongodb+srv://patelv0227:8te0QFB3JmeQxhp4@cluster0.jneaddo.mongodb.net/cs4393");

// API Creation

app.get("/", (req,res)=>{
    res.send("Express App is Running");
});

// Schema creating for User Model
const Users = mongoose.model('Users', {
    name: {
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating End Point for Resgistering Users
app.post('/signup', async (req,res)=>{

    let check = await Users.findOne({email:req.body.email})
    if(check) {
        return res.status(400).json({success:false,errors:"exisiting User found with the same email address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }

    const user = new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    });

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({success:true,token})
})

// Creating Endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else {
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else {
        res.json({success:false,errors:"Wrong Email Id"});
    }
})

app.listen(port, (error)=>{
    if (!error) {
        console.log("Server Running on Port: " + port);
    }
    else {
        console.log("Error: " + error);
    }
});