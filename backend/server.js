const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const connectDB=require("./database/config.js")
require('dotenv').config()

const app=express();
connectDB();

app.use(cors())
app.use(express.json())

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))