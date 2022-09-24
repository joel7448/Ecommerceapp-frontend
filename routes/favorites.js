const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Favorite = require("../models/Favorite");
const authenticate = require("../verifytoken")

router.post("/addtofavorites",async function(req,res){

    const find =await Favorite.find({$and:[{customer:req.body.email},{Productname:req.body.Productname}]});
    
if(find.length==0){
    const newproduct = new Favorite({
        customer : req.body.email,
        Productname : req.body.Productname,
        category : req.body.category,
        description:req.body.description,
        price : req.body.price,
        image : req.body.image
    })
    try{
        const product = await newproduct.save();
        
        res.status(201).json("Added to favorites");

    }
    catch(err){
        
    res.status(500).json(err);
    }}
    else{
        res.status(500).json("Already in favorites");
    }
})

router.get("/getfavorites/:id",authenticate,async function(req,res){
try{
    const data = await Favorite.find({customer:req.params.id});
    res.status(200).json(data);
}
catch(err){
    res.status(500).json(err);
}

})

module.exports = router