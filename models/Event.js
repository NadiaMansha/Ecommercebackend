const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const EventSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    images:{
        type:Array,
        required:true
    },

        
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isEvent:{
        type:Boolean,
        default:true
    },
    isMeetup:{
        type:Boolean,
        default:false
    },
    

});
module.exports=mongoose.model('Event',EventSchema);