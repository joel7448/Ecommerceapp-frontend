const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");



//User register route
router.post("/register",async function (req, res){
 
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);
  req.body.password = hash;
    const newUser = new User({
        firstname: req.body.firstname,
        lastname:req.body.lastname,
        otp:"0",
        email: req.body.email,
        password: req.body.password,
        address:req.body.address,
        city : req.body.city,
        country : req.body.country,
        pincode : req.body.pincode
      });
      try {
        const user = await newUser.save();
        res.status(201).json(user);
      } catch (err) {
        res.status(500).json(err);
      }
})


router.post("/signin",async function(req, res) {
    try{
  const user = await User.findOne({email:req.body.email});
  console.log(user);
  if(user){
    console.log(req.body.password);
   
   const bytes = await bcrypt.compare(req.body.password, user.password);
   console.log(bytes);
   if(bytes){
    const token = jwt.sign({_id:user._id},process.env.SECRET,{expiresIn:"5d"});
    res.json({
      message : "Successfully logged in",
      userid : user._id,
      token,
      email:user.email
    })
    
   }
   else{
    res.status(401).json({
      message : "Invalid password"
    });
   }
  }
  else{
    res.status(401).json({
      message : "Invalid username"
    });
  }
  
    }
    catch(error){
      res.status(500).json({
        message : error
      });
    }
  })


  //password reset
  router.put("/forgotpassword",async function(req,res){
try{
    const user = await User.findOne({email:req.body.email});
    
    if(user){
        let otp ="";
        const characters ='0123456789';

        for(let i=0;i<5;i++){
            otp+=characters[Math.floor(Math.random()*characters.length)];
            
        }
       
       console.log(otp);
        const result = await User.findOneAndUpdate({email:req.body.email},{
            $set:{otp:`${otp}`},
           
          }
          );
        
      
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'joel.joel52@gmail.com',
              pass: process.env.PASS
            }
          });

          var mailOptions = {
            from: 'joel.joel52@gmail.com',
            to: `${req.body.email}`,
            subject: 'User verification',
            html:`<span>Verification code :<h1>${otp}</h1> `
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.json({
                message:"Error"
            })
            } else {
              console.log('Email sent: ' + info.response);
              res.json({
                message: "Verification code has been sent to your mail"
               
            })
            }
          });
          res.status(200).json(result);
    }
    else{
        res.status(200).json("User doesn't exist");
    }

}
catch(err){
    console.log(err);
}
  })

  //OTP verification
  router.post("/forgotpassword/:otp",async function(req,res){
    try{
        console.log(req.body);
        console.log(req.params.otp);
    const otp = await User.findOne({otp:req.params.otp});
    const user = await User.findOne({email:req.body.email});
    console.log(user );
    if(user && otp){
        
        res.status(200).json(otp);
    }
    else{
        res.status(401).json(false);
    }
}
catch(err){
    console.log(err);
}
  })


  //password update
  router.put("/updatepassword",async function(req,res){
    try{

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
   const find = await User.findOneAndUpdate({email:req.body.email},{
    $set:{"password":req.body.password}
   })
   res.status(200).json(find);
}
catch(err){
  res.status(500).json(err)
console.log(err);
}
  })

module.exports = router;

