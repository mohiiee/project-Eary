const router = require("express").Router();
const con=require('../db/connection');

//admin [create ,update,delet list(get all) ] 
router.post("/create",(req,res)=>{
    res.status(200).json({
        msg:"question created",
    });
});
router.put("/update",(req,res)=>{
    res.status(200).json({
        msg:"question updated",
    });
});
router.delete("/delete",(req,res)=>{
    res.status(200).json({
        msg:"question deleted",
    });
});
router.get("/list",(req,res)=>{
    res.status(200).json({
        questions:[],
    });
});

//user[list , answer]
router.get("/view",(req,res)=>{
    res.status(200).json({
        questions:[],
    });
});
router.post("/answer",(req,res)=>{
    res.status(200).json({
        msg:"answers added",
    });
});
module.exports = router;