const express=require('express')
const router=express.Router();
const {register,login}=require("../controllers/authController.js")
const authenticate=require('../middleware/auth')
router.post('/register',register)
router.post('/login',login)
router.get('/auth',authenticate,(req,res)=>{
    res.json({message:"access granted!!",
                user:req.user,
    })
})
module.exports=router;