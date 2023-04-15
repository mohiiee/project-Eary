const router = require("express").Router();
const conn=require('../db/connection');
const authorized=require("../middleware/authorize");
const util =require("util");
const admin=require("../middleware/admin");
const{ body, validationResult}=require("express-validator");
const upload =require("../middleware/uploadaudio");
const fs = require("fs");

// create new answer in answers table in database
router.post("/add",admin,
body("QuestionID").isNumeric().withMessage("enter valid Question ID"),//foregin key
body("answer").isString().withMessage("Please Enter your answer"),
body("Periority").isNumeric().withMessage("enter valid the order"), 

async(req,res)=>{
    try{
     //validdation request // law fe error hyrg3aly 
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const checkQuestionExists = await query("select * from questions where Question_ID = ?",[req.body.QuestionID]);
    if (checkAudioExists.length==0){
        res.status(400).json({
            errors:[{
            msg:"question  is not found",
            },
        ],
        });
    }
    // prepare question object
    const Ques={
        QuestionID:req.body.QuestionID,
        answer:req.body.answer,
        Periority:req.body.Periority,
    };
    // insert into database
    //const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    await query("insert into answers set ?",Ques);

    res.status(200).json({
        msg:"question created",
    });
    }
    catch(err){
        res.status(500).json(err);
    }
});
//update answer
router.put("/update/:Question_ID",
admin,
body("answer").isString().withMessage("Please Enter your answer"),
body("Periority").isNumeric().withMessage("enter valid the order"), 
async(req,res)=>{
    try{
     //validdation request // law fe error hyrg3aly
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    // 2- check if question exist
    const Q= await query("select * from answers where Question_ID = ? ",[req.params.Question_ID]);
    if (!Q[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }
    // prepare question object
    const Ques={
        answer: req.body.answer,
        Periority: req.body.Periority,
    }
    //update question
        await query("update answers set ? where Question_ID =?",
        [
            Ques,
            Q[0].Question_ID
        ]);
        res.status(200).json({
            msg:"question updated"
        });
    }
    catch(err){
        res.status(500).json(err);
    }
});


//delete anwer
router.delete("/delete/:Question_ID",
admin,
async(req,res)=>{
    try{
    // 2- check if question exist
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const Q= await query("select * from answers where Question_ID= ? ",[req.params.Question_ID]);
    if (!Q[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }

    //delete question
        await query("delete from questions where Question_ID = ?",
        [
            Q[0].Question_ID
        ]);
        res.status(200).json({
            msg:"question deleted"
        });
    }
    catch(err){
        res.status(500).json(err);
    }
});
//list and search answer
router.get("/list",
async(req,res)=>{
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    let search="";
    if(req.query.search){
        search=`where Question_ID LIKE '%${req.query.search}%'`;
    }
    const questions =await query(`select * from answers ${search}`);
    questions.map(questions =>{
        questions.AudioFile= "http://"+req.hostname+":4000/"+questions.AudioFile;
    });
    res.status(200).json(questions);
});

module.exports = router;