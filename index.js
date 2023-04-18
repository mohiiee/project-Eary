//init express

const express =require("express");
const app=express();

// global middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));// to access urlencod
const cors = require("cors")
app.use(cors());//allow http request localhosts 

// require moudles 
const auth = require("./routes/Auth");
const questions = require("./routes/questions");
const TextQuestions = require("./routes/TextQuestions");
const answers = require("./routes/answers");
const userAnswers = require("./routes/userAnswers");
const { log } = require("console");

//run the app

app.listen(4000.,"localhost",()=>{
    console.log("server started");
});


// api routes 
app.use("/auth",auth);
app.use("/questions",questions);
app.use("/TextQuestions",TextQuestions);
app.use("/answers",answers);
app.use("/userAnswers",userAnswers);
