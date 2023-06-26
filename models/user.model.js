let mongooz= require('mongoose');

let uzerSchema = new mongooz.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    IP:{
        type:String,
        required:true
    }
})

let Uzermod= mongooz.model('user',uzerSchema);

module.exports={Uzermod};