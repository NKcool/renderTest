require('dotenv').config()

const mongoose = require("mongoose")
mongoose.connect(process.env.MongoUrl)
.then(()=>{
    console.log("DB connected");
}).catch(()=>{
    console.log("DB connection faild !");
})


const newSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    QueAttemped:{
        type:Array,
    },
    score:{
        type:Number,
        default: 0
    },
    LanguageProficiency:{
        type:Number,
        default: 0
    }
    
})

const questionSchema = new mongoose.Schema({
    subject: {
      type: String,
    },
    questions: {
      type: Array,
    },
  });


const collection = mongoose.model("collection",newSchema)
const Question = mongoose.model("Question", questionSchema);
module.exports = {collection,Question}