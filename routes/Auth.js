const router = require("express").Router();
const conn=require('../db/connection');
const{ body, validationResult}=require("express-validator");
const util =require("util");
const bcrypt = require ("bcrypt");
const crypto= require("crypto");


//login 


//register
router.post("/register",
body("Email").isEmail().withMessage("enter a valid  Email"),
body("Name").isString().withMessage("enter a valid  Name").isLength({min :10,max:20}).withMessage("Name should be between (10-20) character"),
body("Password").isLength({min:8,max:15}).withMessage("Password should be between (8-25) character"),
body("Phone").isMobilePhone(['ar-EG']).withMessage("plz enter valid phone number"),
async (req,res)=>{
    try{
        //validdation request 
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({error:errors.array()});
        }
        else{
        //check email if its already exists
            const query =util.promisify(conn.query).bind(conn);// transform sql query to promis to use (await / async)
            const checkEmailExists = await query("select * from user_model where Email = ?",[req.body.Email]);
            if (checkEmailExists.length>0){
                res.status(400).json({
                    errors:[{
                    msg:"Email is registerd before",
                    },
                ],
                });
            }
            else{
                //save new user 
                const userData ={
                    Email: req.body.Email,
                    Name:req.body.Name,
                    Password: await bcrypt.hash(req.body.Password,10),
                    Phone:req.body.Phone,
                    Token:crypto.randomBytes(16).toString("hex"),
                }
                //insert new user to db
                await query("insert into user_model set ?",userData);
                delete userData.Password;
                res.status(200).json(userData);
            }
        }

    }catch(err){
        res.status(500).json({err:err});
    }
});



module.exports = router;