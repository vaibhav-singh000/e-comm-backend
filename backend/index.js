const express= require('express');
const cors=require('cors');
require('./db/config');
const user=require("./db/user");
const Product = require('./db/Product');
const app=express();
app.use(cors());
app.use(express.json());
app.post("/register",async (req,resp)=>{
    let User = new user(req. body);
    let result=await User.save();
    result=result.toObject();
    delete result.password;
resp.send(result);
});
app.post("/login", async (req, resp) => {
    if (req.body.pass && req.body.email) {
        let User = await user.findOne(req.body).select("-pass");
        if (User) {
            // Jwt.sign({user}, jwtKey, {expiresIn:"2h"},(err,token)=>{
            //     if(err){
            //         resp.send("Something went wrong")  
            //     }
                resp.send(User)
            // })
        } else {
            resp.send({ result: "No User found" })
        }
    } else {
        resp.send({ result: "No User found" })
    }
});
app.post("/add-product",async(req,resp)=>{
    let product=new Product(req.body);
    let result=await product.save();
    resp.send(result);
})
app.get("/products",async (req,resp)=>{
    let product=await Product.find();
    if(product.length>0)
    {
        resp.send(product);
    }
    else{
        resp.send("No result found")
    }
});
app.delete('/product/:id',async(req,resp)=>{
    const result=await Product.deleteOne({_id:req.params.id});
    resp.send(result);
});
app.get("/product/:id",async(req,resp)=>{
  let result=await Product.findOne({ _id:req.params.id});
  if(result)
  {
    resp.send(result)
  }
  else 
  {
    resp.send({result:"No result Found"})
  }
})
app.put("/productss/:id",async(req,resp)=>{
    let result=await Product.updateOne(
    {_id:req.params.id},
    {
      $set:req.body 
    }) 
    resp.send(result);
});
app.get("/search/:key",async(req,resp)=>{
    let result=await Product.find({
        "$or":[
               {name:{$regex:req.params.key}},
               {catagory:{$regex:req.params.key}},
               {company:{$regex:req.params.key}}
        ]
});
    resp.send(result);
})
app.listen(5000);