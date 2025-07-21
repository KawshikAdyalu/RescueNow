const express=require('express')
const router=express.Router();
const authenticate=require('../middleware/auth')
const {createDisasater,getDisaster}=require('../controllers/disasterController')

router.post('/',authenticate,createDisasater);
router.get('/',getDisaster)

module.exports=router;
