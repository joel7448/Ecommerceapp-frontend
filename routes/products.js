const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const authenticate = require("../verifytoken")


router.post("/plants",async function(req,res){

    const newproduct = new Product({
     
        Productname : req.body.Productname,
        category : req.body.category,
        favorites : false,
        description:req.body.description,
        price : req.body.price,
        
        image : req.body.image
    })
    try{
        const product = await newproduct.save();
        console.log(product);
        res.status(201).json(product);

    }
    catch(err){
        console.log(err);
    res.status(500).json(err);
    }
})

router.get("/menu",authenticate,async function(req,res){
    try{
        const menu = await Product.find();
        res.status(200).json(menu);
      

    }
    catch(err){
    
res.status(500).json(err);
    }
})


router.put("/addfavorites/:id",async function(req,res){
try{
    
    const find = await Product.findOne({_id:req.params.id});
    if(!find.favorites){
        const update = await Product.findOneAndUpdate({_id:req.params.id},{
            $set:{favorites:true}
        })
    }
    else{
        const update = await Product.findOneAndUpdate({_id:req.params.id},{
            $set:{favorites:false}
        })
    }
    
    res.status(200).json("Successfully updated");
}
catch(err){
    res.status(500).json(err);

}
})

router.get("/favorites",authenticate,async function(req,res){
    try{
    const data = await Product.find({favorites:true});
    res.status(200).json(data);
    }
    catch(err){
        res.status(500).json(err);
    }

})

router.get("/menu/:id",authenticate,async function(req,res){
    try{
        console.log(req.params.id);
    const data = await Product.findOne({Productname:req.params.id});
    console.log(data);
    res.status(200).json(data);

    }
    catch(err){
        res.status(500).json(err);
    }

})


module.exports = router