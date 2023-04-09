const router = require("express").Router();
const conn=require('../db/connection');
const{ body, validationResult}=require("express-validator");
const util =require("util");
const bcrypt = require ("bcrypt");
const crypto= require("crypto");


//login 
router.post("/login",
body("Email").isEmail().withMessage("enter a valid Email"),
body("Password").isLength({min:8,max:15}).withMessage("Password should be between (8-15) character"),
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
            const user = await query("select * from user_model where Email = ?",[req.body.Email]);
            const active = await query ("select Status from user_model");
            if (user.length==0){
                res.status(404).json({
                    errors:[{
                    msg:"Email not found",
                    },
                ],
                });
            }
            // compare hashed password
            const checkPassword= await bcrypt.compare(req.body.Password,user[0].Password);
            if(checkPassword){
                if(user[0].Status==[1]){
                    delete user[0].Password;
                    res.status(200).json(user);}
                    else {
                        res.status(404).json({
                            errors:[{
                            msg:"your account is not activated yet wait till admin activate it",
                            },
                        ],
                        });
                    }
            }
            else{
                res.status(404).json({
                    errors:[{
                    msg:"wrong password",
                    },
                ],
                });
            }

            res.json("hi");
        }
}catch(err){
    res.status(500).json({err:err});
}
});

//register
router.post("/register",
body("Email").isEmail().withMessage("enter a valid  Email"),
body("Name").isString().withMessage("enter a valid  Name").isLength({min :8,max:20}).withMessage("Name should be between (8-20) character"),
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
