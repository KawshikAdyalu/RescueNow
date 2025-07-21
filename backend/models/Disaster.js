const mongoose=require('mongoose')

const disasterSchema=new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,ref:"User",
        required:true,
    },
    status:{
        type:String,
        default:'active'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

    
    
})

module.exports=mongoose.model('Disaster',disasterSchema);