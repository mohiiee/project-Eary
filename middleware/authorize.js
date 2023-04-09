const conn=require('../db/connection');
const util = require ("util");

const authorized =async (req,res)=>{
    const query =util.promisify(conn.query).bind(conn);
    const {token} = req.headers;
    const user = await query("select * from user_model where token = ?");
    if (user[0]){
        next();
    }
    else {
        res.status(403).json({
            msg:"you are not authrized to access this route",
        });
    }
};

module.exports=authorized;