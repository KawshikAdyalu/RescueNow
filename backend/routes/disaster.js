const express=require('express')
const router=express.Router();
const authenticate=require('../middleware/auth')
const {createDisaster,getDisaster,updateDisaster,deleteDisaster,getNearbyDisasters}=require('../controllers/disasterController')

router.post('/',authenticate,createDisaster);
router.get('/',getDisaster)
router.get('/nearby', getNearbyDisasters);

router.put('/:id', authenticate, updateDisaster);     
router.delete('/:id', authenticate, deleteDisaster);

module.exports=router;
