let mongooz=require('mongoose');

let connectDb= async ()=>{
   try {
      await mongooz.connect(process.env.MONGO_DB);
      console.log('connected');
   } catch (error) {
     console.log('error connection to atlas db')
   }
}

 module.exports={connectDb};