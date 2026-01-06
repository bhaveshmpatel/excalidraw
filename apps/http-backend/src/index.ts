import express from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config";

const app = express();
app.use(express.json());

app.post("/signup", (req,res) => {
    
})

app.post("/signin", (req,res) => {
    
})

app.post("/room", (req,res) => {
    
})



app.listen(3001);