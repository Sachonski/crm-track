import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import mysql from 'mysql'
import express from 'express'

const db = mysql.createPool({
    host:"sql10.freesqldatabase.com",
    user: "sql10668768",
    password: "d72j94LcqC",
    database: "sql10668768"
  });

const app = express()

app.get("/api/getPayments", (req,res) =>{
    console.log("aca ta")
  //  db.query('SELECT * FROM Payments')
    
})  

