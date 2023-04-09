const conn=require('../db/connection');
const util = require ("util");
const express=require("express");

const admin =async (req,res,next)=>{
    const query =util.promisify(conn.query).bind(conn);
    const {token} = req.headers;
    const admin = await query("select * from user_model where token = ?",[token]);
    if (admin[0]&&admin[0].Type=="1"){
        next();
    }
    else {
        res.status(403).json({
            msg:"you are not authrized to access this route",
        });
    }
};

module.exports=admin;