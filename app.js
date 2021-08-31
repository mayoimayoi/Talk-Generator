"use strict";
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const port = process.env.PORT || 3000;
let path = require("path");

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

const con = mysql.createPool({
  //一度に生成する接続インスタンスの数
  connectionLimit: 1,
  host: "us-cdbr-east-04.cleardb.com",
  user: "b49911f971b31b",
  password: process.env.KEY1,
  database: "heroku_e07d7162f5aeeb7",
});

//mysqlは一定時間操作がないと接続を切ってしまうので切られないように起動時に処理をする
//こね
// function handleDisconnect() {
//   con.connect((err) => {
//     if (err) {
//       console.log("1. error when connecting to db:", err);
//       setTimeout(handleDisconnect, 1000);
//     }
//   });
//   con.on("error", function (err) {
//     console.log("3. db error", err);
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }

// handleDisconnect();

// con.query(
//   "CREATE DATABASE IF NOT EXISTS talkgenerator_db",
//   function (err, result) {
//     if (err) throw err;
//     console.log("database created");
//   }
// );

// const sql =
//   "CREATE TABLE IF NOT EXISTS t_talk (t_talk_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, t_talk_contents VARCHAR(65535) NOT NULL)";
// con.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log(result.body);
// });

app.get("/", (req, res) => {
  //ランダムでデータを一つ持ってくる
  let sql = "select * from t_talk ORDER BY RAND() LIMIT 1";
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    res.render("index.ejs", { talk: result });
  });
});

app.post("/", (req, res) => {
  //いいねボタンを一個足す
  let talkcontents = req.body.t_talk_contents;
  let goodnumber = 0;
  let sql = "UPDATE t_talk SET t_talk_good = ? WHERE t_talk_contents = ?";
  goodnumber = Number(req.body.t_talk_good) + 1;
  let goodbody = [goodnumber, talkcontents];
  con.query(sql, goodbody, (err, result, fields) => {
    if (err) throw err;
  });
  sql = "select * from t_talk WHERE t_talk_contents = ?";
  con.query(sql, talkcontents, (err, result, fields) => {
    if (err) throw err;
    res.render("index.ejs", { talk: result });
  });
});

app.get("/regist", (req, res) => {
  res.render("./regist/regist.ejs");
});

app.post("/regist/complete", (req, res) => {
  let sql = "INSERT INTO t_talk SET ?;";
  let registbody = {
    t_talk_contents: req.body.t_talk_contents,
    t_talk_userid: req.body.t_talk_userid,
    t_talk_good: 0,
  };
  con.query(sql, registbody, (err, result, fields) => {
    console.log(req.body);
    if (err) throw err;
  });
  res.render("./regist/complete.ejs");
});

app.get("/contact", (req, res) => {
  res.render("./contact/contact.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
