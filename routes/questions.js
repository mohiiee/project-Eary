const router = require("express").Router();
const con=require('../db/connection');
const authorized=require("../middleware/authorize");
const admin=require("../middleware/admin");
const{ body, validationResult}=require("express-validator");
const upload =require("../middleware/uploadaudio");
//admin [create ,update,delet list(get all) ] 
//Create The API
router.post("/create",admin,
upload.single("Audio"),
body("Name").isString().withMessage("Please Enter your Question Name").isLength({min:8,max:20}).withMessage("Question Name should be at least 8 character"),
body("Questions").isString().withMessage("Please Enter your Questions").isLength({min:8,max:200}).withMessage("Questions should be at least 8 character"),
authorized,(req,res)=>{
     //validdation request // law fe error hyrg3aly 
     const errors=validationResult(req);
     if (!errors.isEmpty()){
         return res.status(400).json({error:errors.array()});
     }
    res.status(200).json({
        msg:req.body,
    });
});
router.put("/update",admin,authorized,(req,res)=>{
    res.status(200).json({
        msg:"question updated",
    });
});
router.delete("/delete",admin,authorized,(req,res)=>{
    res.status(200).json({
        msg:"question deleted",
    });
});
router.get("/list",authorized,(req,res)=>{
    res.status(200).json({
        questions:[],
    });
});

//user[list , answer]

router.post("/answer",authorized,(req,res)=>{
    res.status(200).json({
        msg:"answers added",
    });
});
module.exports = router;
