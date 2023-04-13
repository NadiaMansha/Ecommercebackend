const Event=require('../models/Event');
const User=require('../models/User');
const {upload}=require('../middleware/multer');

//@desc Get all events
//@route GET /events
//@access Public
 const getEvents=async (req,res)=>{
    try {
        const events=await Event.find().lean();
        res.status(200).json({success:true,data:events});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//@desc Get single event
//@route GET /events/:id
//@access Public
    const getEvent=async (req,res)=>{
        try {
            const event=await Event.findById(req.params.id).lean();
            if(!event){
                return res.status(400).json({success:false,error:'No event found'});
            }
            res.status(200).json({success:true,data:event});
        } catch (error) {
            res.status(500).json({success:false,error:error.message});
        }
    }

//@desc Create new event
//@route POST /events
//@access Private
const createEvent=async (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(400).json({ message: err });
      } else {
        // Get other form data
      const {name,description,date,time,location,price}=req.body;

        const eventImages = req.files.map(file => file.filename);
  
        // Save event data to database 
        const newEvent = new Event({
            name,
            description,
            date,
            time,
            location,
            price,
            images:eventImages,
            user:req.user.id
        });
        newEvent.save();

       //send response 
        res.status(201).json({ message: 'Event created successfully!', event: newEvent});
        }
    });
    };



//@desc Update event
//@route PUT /events/:id
//@access Private
const updateEvent=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({success:false,error:'No event found'});
        }
        const {name,description,date,time,location,price}=req.body;
        if(name){
            event.name=name;
        }
        if(description){
            event.description=description;
        }
        if(date){
            event.date=date;
        }
        if(time){
            event.time=time;
        }
        if(location){
            event.location=location;
        }
        if(price){
            event.price=price;
        }
        await event.save();
        res.status(200).json({success:true,data:event});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//@desc Delete event
//@route DELETE /events/:id
//@access Private
const deleteEvent=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({success:false,error:'No event found'});
        }
        await event.remove();
        res.status(200).json({success:true,data:{}});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//@desc Add user to event
//@route PUT /events/:id
//@access Private
const addUserToEvent=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({success:false,error:'No event found'});
        }
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({success:false,error:'No user found'});
        }
        event.users.push(user);
        await event.save();
        res.status(200).json({success:true,data:event});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//@desc Remove user from event
//@route PUT /events/:id
//@access Private
const removeUserFromEvent=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({success:false,error:'No event found'});
        }
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(400).json({success:false,error:'No user found'});
        }
        event.users.pull(user);
        await event.save();
        res.status(200).json({success:true,data:event});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//@desc Get events for user
//@route GET /events/user/:id
//@access Private
const getEventsForUser=async (req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(400).json({success:false,error:'No user found'});
        }
        const events=await Event.find({user:req.params.id}).lean();
        res.status(200).json({success:true,data:events});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}

//block an event
const blockEvent=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.id);
        if(!event){
            return res.status(400).json({success:false,error:'No event found'});
        }
        event.isBlocked=true;
        await event.save();
        res.status(200).json({success:true,data:event});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
    }
}




        







module.exports={
    getEvents,
    getEvent,
    createEvent,
}