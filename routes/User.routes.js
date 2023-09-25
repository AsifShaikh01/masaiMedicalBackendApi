const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {UserModel} = require("../model/User.model");

const userRouter = express.Router();

userRouter.post("/signup", async(req,res)=>{
   const {email , password , cPassword} = req.body;
   try {
    const existingUser = await UserModel.find({email});
    if(existingUser){
        res.send("user with this email already registered!!")
    }

    const hashedPassword = await bcrypt.hash(password,12);
    const user = new UserModel({email , password:hashedPassword , cPassword})
    await user.save();

    const token = jwt.sign({email:user.email , id:user._id},"masai");
    res.send({"msg":"user registered!!" , "token":token})
    
   } catch (error) {
    res.send(error)
   }
})

userRouter.post("/login" , async(req,res)=>{
    const {email,password} = req.body;
    try {
        const existingUser = await UserModel.find({email});
        if(!existingUser){
            res.send("user not found!!")
        }

        const reHashedPassword = await bcrypt.compare(password,existingUser.password);
        if(!reHashedPassword){
            res.send("Invalid credentials!!")
        }
        const token = jwt.sign({email:existingUser.email , id:existingUser._id},"masai");
        res.send({"msg":"Login successfull!!","token":token})
        
    } catch (error) {
        res.send(error)
    }
})

module.exports={userRouter}