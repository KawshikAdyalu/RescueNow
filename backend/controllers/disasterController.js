const Disaster=require('../models/Disaster')

const createDisasater=async(req,res)=>{
    try{
        const{type,description,location}=req.body;

        const disaster=new Disaster({
            type,
            description,
            location,
            createdBy:req.user.id
        });

        await disaster.save();

        res.status(201).json({message:"Disaster reported successfully",disaster});
        
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
};

const getDisaster=async(req,res)=>{
    try{
        const disasters=await Disaster.find().populate('createdBy','username email');
        res.json(disasters)
    }
    catch(err)
    {
        res.status(500).json({message:err.message})
    }
}

module.exports={createDisasater,getDisaster}