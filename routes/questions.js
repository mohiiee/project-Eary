const router = require("express").Router();
const conn=require('../db/connection');
const authorized=require("../middleware/authorize");
const util =require("util");
const admin=require("../middleware/admin");
const{ body, validationResult}=require("express-validator");
const upload =require("../middleware/uploadaudio");
const fs = require("fs");

//admin [create ,update,delet list(get all) ] 
//Create The API
//add new quesiton audio
router.post("/create",admin,
upload.single("Audio"),
body("Name").isString().withMessage("Please Enter your Question Name").isLength({min:8,max:20}).withMessage("Question Name should be at least 8 character"),
async(req,res)=>{
    try{
     //validdation request // law fe error hyrg3aly 
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    // validate the auio file 
    if(!req.file){
        return res.status(400).json({
            errors:[{
                msg:"audio file is required",
            },],
        });
    }
    // prepare question object
    const Ques={
        Name:req.body.Name,
        AudioFile :req.file.filename
    };
    // insert into database
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    await query("insert into hearing_assistance_model set ?",Ques);

    res.status(200).json({
        msg:"question created",
    });
    }
    catch(err){
        res.status(500).json(err);
    }
});
//update question
router.put("/update/:ID",
admin,
upload.single("Audio"),
body("Name").isString().withMessage("Please Enter your Question Name").isLength({min:8,max:20}).withMessage("Question Name should be at least 8 character"),
async(req,res)=>{
    try{
     //validdation request // law fe error hyrg3aly
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({error:errors.array()});
    }
    // 2- check if question exist
    const Q= await query("select * from hearing_assistance_model where ID= ? ",[req.params.ID]);
    if (!Q[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }
    
    // prepare question object
    const Ques={
        Name: req.body.Name,
    }
    // lw 3ayz a8yr el audio file 
    if (req.file){
        Ques.AudioFile=req.file.filename;
        //delete old audio
        fs.unlinkSync("./AudioFolder/"+Q[0].AudioFile)
    }
    //update question
        await query("update hearing_assistance_model set ? where id =?",
        [
            Ques,
            Q[0].ID
        ]);
        res.status(200).json({
            msg:"question updated"
        });
    }
    catch(err){
        res.status(500).json(err);
    }
});
//delete question
router.delete("/delete/:ID",
admin,
async(req,res)=>{
    try{
    // 2- check if question exist
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const Q= await query("select * from hearing_assistance_model where ID= ? ",[req.params.ID]);
    if (!Q[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }
            //delete question audio
        fs.unlinkSync("./AudioFolder/"+Q[0].AudioFile)
    
    //delete question
        await query("delete from hearing_assistance_model where id =?",
        [
            Q[0].ID
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
        search=`where Name LIKE '%${req.query.search}%'`;
    }
    const questions =await query(`select * from hearing_assistance_model ${search}`);
    questions.map(questions =>{
        questions.AudioFile= "http://"+req.hostname+":4000/"+questions.AudioFile;
    });
    res.status(200).json(questions);
});
//show spacific question 
router.get("/show/:ID",
async(req,res)=>{
    const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
    const questions =await query("select * from hearing_assistance_model where ID = ?",req.params.ID);
    if (!questions[0]){
        res.status(404).json({
            msg:"Question not found"
        });
    }
    questions.map(questions =>{
        questions.AudioFile= "http://"+req.hostname+":4000/"+questions.AudioFile;
    });
    res.status(200).json(questions);
});
//user[list , answer]

router.post("/answer",authorized,(req,res)=>{
    res.status(200).json({
        msg:"answers added",
    });
});
module.exports = router;
