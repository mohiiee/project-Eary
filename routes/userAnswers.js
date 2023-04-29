const router = require("express").Router();
const conn=require('../db/connection');
const authorized=require("../middleware/authorize");
const util =require("util");
const admin=require("../middleware/admin");
const{ body, validationResult}=require("express-validator");
const upload =require("../middleware/uploadaudio");
const fs = require("fs");

// create new answer in answers table in database
router.post("/add",authorized,
body("UserID").isNumeric().withMessage("enter valid user ID"),//foregin key
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
    //check if user exists 
    const checkUserExists = await query("select * from user_model where ID = ?",[req.body.UserID]);
    if(checkUserExists==0){
        res.status(400).json({
            errors:[{
            msg:"user  is not found",
            },
        ],
        });
    }
    //check if question exists 
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
    //chack of answer exists 
    const checkAnswerExists = await query("select * from answers where answer = ?",[req.body.answer]);
    if(checkAnswerExists==0){
        res.status(400).json({
            errors:[{
            msg:"answer  is not found",
            },
        ],
        });
    }
    // prepare question object
    const Ques={
        UserID:req.body,UserID,
        QuestionID:req.body.QuestionID,
        answer:req.body.answer,
        
    };
    // insert into database
    //const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    await query("insert into useranswers set ?",Ques);
    //check if answer is right or not 
    const checkkk=await query ("select Periority from answers where answer =?",[req.body.answer])
    if (checkkk=="1"){
        await query("UPDATE useranswers SET rightanswer='1' WHERE answer=?",[req.body.answer])
    
    res.status(200).json({
        msg:"answer added",
    });
    }
}

    catch(err){
        res.status(500).json(err);
    }
});
//list and search answer
router.get("/list",
async(req,res)=>{
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    ;
    
    const questions =await query(`select * from useranswers ${search}`);
    res.status(200).json(questions);
});
module.exports = router;