require('dotenv').config()
const expressLayouts = require('express-ejs-layouts')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open',() => console.log('Connected to Database'))


app.set("view engine" ,"ejs");
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.render("index");
});




app.get("/", (req, res) => {
    res.render("index");
   });

app.listen(3000, () => console.log('Server Started'))