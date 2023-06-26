let mongooz= require('mongoose');

let todoSchema = new mongooz.Schema({
    taskname:{
        type:String,
        required:true
        
    },
    status:{
        type:String,
        required:true,
        enum:['pending','done'],
        default:'pending'
    },
    tag:{
        type:String,
        required:true,
        enum:["personal", "official", "family"],
        default:"personal"
    },
    userID:{
        type:String,
    }
})

let Todomod= mongooz.model('todo',todoSchema);

module.exports={Todomod};