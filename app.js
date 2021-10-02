"use strict";
const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const port = process.env.PORT || 3000;
const helmet = require("helmet");
let path = require("path");

require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(helmet.xssFilter());
app.use(helmet.frameguard({ action: "sameorigin" }));

const con = mysql.createPool({
  //一度に生成する接続インスタンスの数（これがないとmysqlがタイムアウトしてしまう）
  connectionLimit: 1,
  host: "us-cdbr-east-04.cleardb.com",
  user: "b49911f971b31b",
  password: process.env.KEY1,
  database: "heroku_e07d7162f5aeeb7",
});

//gitreset テスト用
//mergeしてみるよ
// const sql =
//   "CREATE TABLE IF NOT EXISTS t_reaction (t_talk_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, t_talk_contents VARCHAR(65535) NOT NULL)";
//   if (err) throw err;
// });

app.get("/", (req, res) => {
  //ランダムでデータを一つ持ってくる
  let sql = "select * from t_talk ORDER BY RAND() LIMIT 1;";
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    res.render("index.ejs", { talk: result });
  });
});

app.post("/", (req, res) => {
  //いいねボタンを一個足す
  let sql =
    "UPDATE t_talk SET t_talk_good = t_talk_good+1   WHERE t_talk_id = ?;";
  let goodbody = req.body.t_talk_id;
  con.query(sql, goodbody, (err, result, fields) => {
    if (err) throw err;
  });
  sql = "select * from t_talk WHERE t_talk_id = ?;";
  con.query(sql, goodbody, (err, result, fields) => {
    if (err) throw err;
    res.render("index.ejs", { talk: result });
  });
});

app.get("/regist", (req, res) => {
  let error_part = "";
  res.render("./regist/regist.ejs", { errorpart: error_part });
});

app.post("/regist/complete", (req, res) => {
  //herokuの使用でIDは１０とびで振られるので注意
  let sql = "INSERT INTO t_talk SET ?;";
  let error_part = "";

  let registbody = {
    t_talk_contents: req.body.t_talk_contents,
    t_talk_userid: req.body.t_talk_userid,
    t_talk_good: 0,
  };

  if (registbody.t_talk_contents === "" || registbody.t_talk_userid === "") {
    error_part = "話題もしくはユーザー名が空白です。確認してください";
  } else if (registbody.t_talk_contents.length <= 2) {
    error_part = "文字が短すぎます。最低３文字以上入力してください";
  } else if (registbody.t_talk_contents.length >= 150) {
    error_part = "文字が長すぎます。150字以下にしてください";
  }
  if (error_part != "") {
    res.render("./regist/regist.ejs", { errorpart: error_part });
  } else {
    con.query(sql, registbody, (err, result, fields) => {
      if (err) throw err;
    });
    res.render("./regist/complete.ejs");
  }
});

app.get("/contact", (req, res) => {
  res.render("./contact/contact.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
