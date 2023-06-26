require('dotenv').config();
 let express=require('express');
 let cors=require('cors');
 let {connectDb}=require('./config/db');
 let {Uzermod} = require('./models/user.model');
 let bcrypt = require('bcrypt');
 let jwt = require('jsonwebtoken');
 let {auth} = require('./middleware/auth');
 let {Todomod} = require('./models/todos.model');

 let app=express();
 app.use(express.json());
 app.use(cors());
 


 app.get('/',(req,res)=>{
    res.send({msg:'Home Page'});
 })

 app.post('/signup',async (req,res)=>{
   let {email,password, IP} = req.body;
   let user= await Uzermod.find({email});
   if(user.length>0){
      res.send({message:'user already exist'});
   }
   else{
      try {
         const hashed_pass = bcrypt.hashSync(password, 7);
         await Uzermod.create({email,password:hashed_pass,IP});
         res.status(200).send({message:'Signup Successful'});
      } catch (error) {
         console.log(error);
         res.status(500).send({message:'Error in Signup'} );
      }
   }
 })

 app.post('/login', async (req,res)=>{
    let {email,password} = req.body;
    let user = await Uzermod.findOne({email});
    if(user){
      try {
         let check_pass = bcrypt.compareSync(password, user.password);
         if(check_pass){
            let token = jwt.sign({ userID : user._id }, process.env.SECRET_KEY);
            res.send({message:'Login successful',token});
         } 
         else{
            res.status(500).send({message:'Wrong Password'});
         }
      } catch (error) {
         res.status(500).send({message:'Login failed !'});
      }
     
    }
    else{
      res.status(500).send('User not found please Signup!');
    }
 })



  app.post('/todos',auth, async( req,res)=>{
   try {
      let {taskname,status,tag}=req.body;
      let user = await Uzermod.findOne({_id:req.userID});
       if(user){
         await Todomod.create({taskname,status,tag,userID:req.userID});
         res.send({message:"Todo created successfully"});
       }
       else{
         res.send({message:'Wrong token inserted!'});
       }
   } catch (error) {
      res.status(500).send({message:'Todo creation failed!'})
   }
  })

 app.get('/todos',auth, async(req,res)=>{
    try {
      let todos = await Todomod.find({userID:req.userID});
      res.send({data:todos});
    } catch (error) {
      res.status(500).send({error:'Error in getting todos'})
    }
 })

 app.put('/todos/update/:todoID',auth, async (req,res)=>{
   let {taskname,status,tag} = req.body;
   let {todoID}=req.params;
   try {
      await Todomod.findByIdAndUpdate({_id:todoID},{taskname,status,tag});
      res.status(200).send({message:'Todo updated successfully'});
   } catch (error) {
      res.status(500).send({message:'Error updating '});
   }
 })

 app.delete('/todos/delete/:todoID',auth, async (req,res)=>{
   let {todoID}=req.params;
   try {
      await Todomod.findByIdAndDelete({_id:todoID});
      res.status(200).send({message:'Todo deleted successfully'});
   } catch (error) {
      res.status(500).send({message:'Error deleting!'});
   }
 })


 app.listen(process.env.PORT,()=>{
    connectDb();
    console.log('server running on 7000');
 })