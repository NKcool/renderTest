require('dotenv').config()
const express = require('express')
const app = express();
const {collection,Question} = require('./mongo.js')
app.use(express.json());
const cors = require('cors');
app.use(cors());


app.get("/users", async (req, res) => {
    try {
    let user = await collection.find({},{username:1,score:1,_id:0});
    res.send(user);
    } catch (error) {
        res.send("error")
    }
})
app.post("/users", async (req, res) => {
    const data = {
        username: req.body.name,
        password: req.body.password,
        language: req.body.language
    }
    try {
        let user = await collection.findOne({ username: req.body.name })

        if (user) {
            return res.send("user exist")
        } else {

            await collection.insertMany([data])
            user = await collection.findOne({ username: req.body.name })
            res.json({ "user": user })

        }
    } catch {
        res.send("user exist");
    }
})
app.post("/users/login", async (req, res) => {
    try {
        const user = await collection.findOne({ username: req.body.name })
        if (user == null) {
            return res.send("user not exist")
        }

        if (user.password == req.body.password) {
            res.json({
                status: "success",
                user: user
            })
        } else {
            res.send("Not allow")
        }
    } catch (e) {
        res.status(500).send();
    }
})
app.post("/changelanguage",async(req,res)=>{
    const id = req.body.id;
    const lan = req.body.language

    const update = {
        $set: {
          language:lan,
          score: 0,
          LanguageProficiency:0,
          QueAttemped:[]  
        }
    }

    try {
        const result = await collection.findOneAndUpdate({_id:id},update, {
          returnOriginal: false, // Set to false to get the updated document
        });
    
        if (result) {
          console.log('Document updated:', result.value);
          res.status(200).json({"user":result})

        } else {
            res.send("error occour while updating")
        }
      } catch (error) {
        console.log(error);
        res.send("error occour while updating")
      }

})
app.post("/updateScore",async(req,res)=>{
    const id = req.body.id;
    const LP = req.body.LP;
    const score = req.body.score;
    const QueAttemped = req.body.QueAttemped;
    const update = {
        $set: {
          score: score,
          LanguageProficiency:LP,
          QueAttemped:QueAttemped
        }
    }

    try {
        const result = await collection.findOneAndUpdate({_id:id},update, {
          returnOriginal: false, // Set to false to get the updated document
        });
    
        if (result) {
          console.log('Document updated:', result);
          res.status(200).json({"user":result})

        } else {
            res.send("error occour while updating")
        }
      } catch (error) {
        console.log(error);
        res.send("error occour while updating")
      }

})
app.post("/questions", async (req, res) => {
    const lan = req.body.language
    try {
    let data = await Question.find({subject:lan});
    console.log(data);
    if(data == null){
        res.send("error")
    }else{
    res.json(data);
    }
    } catch (error) {
        res.send("error")
    }
})


app.listen(4000, () => {
    console.log("started at 4000")
})