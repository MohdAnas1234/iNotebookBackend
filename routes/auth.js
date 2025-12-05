const express = require('express');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET= 'AnasisaGoodBoy'

// Route-1  Creat a user using: POST "/api/auth/createuser".doesnt require auth  nom login require
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','password must be atleast 5 charecter').isLength({min:5}),
], async(req,res)=>{


      //if there are error, return bad request and error

   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({success:false,errors:errors.array()});
   }

   //check whether the user with exist already
   try{

       let user = await User.findOne({email: req.body.email});
       console.log(user)
       if(user){
        return res.status(400).json({success:false,error:"Sorry a user with this email already exist"})
       }
          
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password ,salt);


       //Create a new User
       user= await User.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email,
       });
      const data ={
        user:{
          id: user.id
        }
      }
       const authtoken = jwt.sign(data,JWT_SECRET);
  
       
      //  res.json({success:true,user});
  
      res.json({success:true,authtoken})
   }
 catch(error){
  console.error("Error details:", error);  // show full object
  return res.status(500).send("Internal Server Error");
}

})


//  Route-2   Authenticate a user using: POST "/api/auth/".doesnt require auth  nom login require
router.post('/login',[
  
    body('email','Enter a valid email').isEmail(),
    body('password','Password Cannot be blank').exists(),
    
  ], async(req,res)=>{
    

  //if there are error, return bad request and error

   const errors = validationResult(req);
   if(!errors.isEmpty()){
    
    return res.status(400).json({success: false,errors:errors.array()});
   }

   const {email,password} = req.body;
   try{
     let user = await User.findOne({email});
     if(!user){
      
      return res.status(400).json({success:false,error:"Please try to login with correct credentials"})
     }

     const passwordCompare = await bcrypt.compare(password,user.password);
     if(!passwordCompare){
      
      return res.status(400).json({success:false,error:"Please try to login with correct credentials"});
     }

    const data ={
        user:{
          id: user.id
        }
      }
       const authtoken = jwt.sign(data,JWT_SECRET);
      let success= true;
      res.json({success:true,authtoken})
   }catch(error){
     console.error(error.message); 
  return res.status(500).send("Internal Server Error");
   }
})

//  Route-3   Get loggedin User detail using: POST "/api/auth/getUser".doesnt require auth   login require

router.post('/getuser',fetchuser, async(req,res)=>{

try {
  const userId = req.user.id;
  const user =await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  console.error(error.message); 
  return res.status(500).send("Internal Server Error");
}
})
module.exports = router