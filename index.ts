const express = require("express");
const app = express();
const process = require('dotenv').config()
const http = require("http");
const port = 5432;
const host = "185.154.193.21";
const urlencodedParser = express.urlencoded({ extended: false }); 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.USER_DB,
  host: host,
  database:  process.DB_NAME,
  password:  process.DB_PASSWORD,
  port: port,
});

// Создание таблицы
// const createTableQuery = `
//   CREATE TABLE questions (
//     id SERIAL PRIMARY KEY,
//     question_1 TEXT NOT NULL,
//     question_2 TEXT NOT NULL,
//     question_3 TEXT NOT NULL
//   );
//   `;


function addData(question_1, question_2, question_3) {
  let setTableQuery = `
INSERT INTO questions (question_1,question_2,question_3) VALUES ('${question_1}', '${question_2}', '${question_3}');
`

  pool.query(setTableQuery, (error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Запись успешна')
      pool.end();
    }
  });
}


app.use(express.json())

app.get('/answers', async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  try {

    const result = await pool.query('SELECT * FROM questions')
    const questions = result.rows
    res.json(questions)
    console.log(questions)
  

  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
});

app.post('/',(req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  res.send('Ответы сохранены')
  addData(req.body.question_1, req.body.question_2, req.body.question_3)
  console.log(req.body)
});

app.listen(port, host, () => {
  console.log("Сервер запущен: http://" + host + ":" + port);
});
