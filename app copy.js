//ローカルでの開発状態
// "use strict";
// const express = require("express");
// const app = express();
// const ejs = require("ejs");
// const bodyParser = require("body-parser");
// const mysql = require("mysql");
// const port = process.env.PORT | 3000;
// let path = require("path");

// require("dotenv").config();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));
// app.set("view engine", "ejs");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: process.env.KEY1,
//   database: "talkgenerator_db",
// });

// // con.query(
// //   "CREATE DATABASE IF NOT EXISTS talkgenerator_db",
// //   function (err, result) {
// //     if (err) throw err;
// //     console.log("database created");
// //   }
// // );

// // const sql =
// //   "CREATE TABLE t_talk (t_talk_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, t_talk_contents VARCHAR(65535) NOT NULL)";
// // con.query(sql, function (err, result) {
// //   if (err) throw err;
// //   console.log("table created");
// // });

// app.get("/", (req, res) => {
//   //ランダムでデータを一つ持ってくる
//   let sql = "select * from t_talk ORDER BY RAND() LIMIT 1";
//   con.query(sql, (err, result, fields) => {
//     if (err) throw err;
//     res.render("index.ejs", { talk: result });
//   });
// });

// app.get("/regist", (req, res) => {
//   res.render("./regist/regist.ejs");
// });

// app.post("/", (req, res) => {
//   let sql = "INSERT INTO t_talk SET ?";
//   con.query(sql, req.body, (err, result, fields) => {
//     if (err) throw err;
//     console.log("regist complete");
//   });
//   res.render("./regist/complete.ejs");
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
