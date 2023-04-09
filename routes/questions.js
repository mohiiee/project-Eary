const router = require("express").Router();
const con=require('../db/connection');
const authorized=require("../middleware/authorize");
//admin [create ,update,delet list(get all) ] 
router.post("/create",authorized,(req,res)=>{
    res.status(200).json({
        msg:"question created",
    });
});
router.put("/update",authorized,(req,res)=>{
    res.status(200).json({
        msg:"question updated",
    });
});
router.delete("/delete",authorized,(req,res)=>{
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

router.post("/answer",(req,res)=>{
    res.status(200).json({
        msg:"answers added",
    });
});
module.exports = router;