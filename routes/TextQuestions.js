const router = require("express").Router();
const conn=require('../db/connection');
const authorized=require("../middleware/authorize");
const util =require("util");
const admin=require("../middleware/admin");
const{ body, validationResult}=require("express-validator");
const upload =require("../middleware/uploadaudio");
const fs = require("fs");

// create new question in questions table in database
router.post("/add",
body("Question").isString().withMessage("Please Enter your Question"),
body("AudioID").isNumeric().withMessage("enter valid audio id"), //foregin key
async(req,res)=>{
    try{
     //validdation request // law fe error hyrg3aly 
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const checkAudioExists = await query("select * from hearing_assistance_model where ID = ?",[req.body.AudioID]);
    if (checkAudioExists.length==0){
        res.status(400).json({
            errors:[{
            msg:"question audio is not found",
            },
        ],
        });
    }
    // prepare question object
    const Ques={
        Question:req.body.Question,
        AudioID:req.body.AudioID
    };
    // insert into database
    //const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    await query("insert into questions set  ?",Ques);

    res.status(200).json({
        msg:"question created",
    });
    }
    catch(err){
        res.status(500).json(err);
    }
});
//update question
router.put("/update/:Question_ID",
admin,
body("Qustion").isString().withMessage("Please Enter your Question "),
async(req,res)=>{
    try{
     //validdation request // law fe error hyrg3aly
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    // 2- check if question exist
    const Q= await query("select * from questions where ID = ? ",[req.params.Question_ID]);
    if (!Q[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }
    // prepare question object
    const Ques={
        Question: req.body.Name,
    }
    //update question
        await query("update questions set ? where Question_ID =?",
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

//activate question
router.put("/active"
,admin,
body("Qusetion_ID").isNumeric().withMessage("enter a valid Question ID"),
async (req,res)=>{
    try{
        //validdation request
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }
        else{
        //check Question ID if its already exists
            const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
            const question = await query("select * from questions where Question_ID = ?",[req.body.Question_ID]);
            const active = await query ("select Status from questions");
            if (question.length==0){
                res.status(404).json({
                    errors:[{
                    msg:"Question not found",
                    },
                ],
                });
            }
            //check if status of question is active or not 
            if(question[0].Status==[1]){
                res.status(404).json({
                    msg:"question  is already activated"
                });
            }
            else {
                await query("update questions SET Status ='1' where Question_ID = ? ",question[0].Question_ID);
                res.status(200).json({
                    mag:"question activated"
                });
            }
}}catch(err){
    res.status(500).json({err:err});
}
});
//delete question
router.delete("/delete/:ID",
admin,
async(req,res)=>{
    try{
    // 2- check if question exist
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const Q= await query("select * from questions where Question_ID= ? ",[req.params.Question_ID]);
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
//list and search question
router.get("/list",
async(req,res)=>{
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    let search="";
    if(req.query.search){
        search=`where Question_ID LIKE '%${req.query.search}%'`;
    }
    const questions =await query(`select * from questions ${search}`);
    questions.map(questions =>{
        questions.AudioFile= "http://"+req.hostname+":4000/"+questions.AudioFile;
    });
    res.status(200).json(questions);
});
//show spacific question 
router.get("/show/:Question_ID",
async(req,res)=>{
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const questions =await query("select * from questions where Question_ID = ?",req.params.Question_ID);
    if (!questions[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }
    res.status(200).json(questions);
});
module.exports = router;