const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    database: 'todo',
    user: 'root',
    password: 'mykonalsql'
});

app.get('/', (req, res) => {
    const sql = "SELECT * FROM task";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error retrieving tasks" });
        return res.json(data);
    });
});
app.post('/create', (req, res) => {
    const sql = "INSERT INTO task (`title`, `description`, `priority`, `due_date`) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.title,
        req.body.description,
        req.body.priority,
        req.body.due_date 
    ];

    db.query(sql, values, (err, data) => {
        if (err) return res.status(500).json({ error: "Error creating task" });
        return res.status(201).json(data);
    });
});


app.put('/update/:id', (req, res) => {
    const sql = "UPDATE task SET title = ?, description = ?, due_date = ?, priority = ? WHERE ID = ?";
    const values = [
      req.body.title,
      req.body.description,
      req.body.dueDate,
      req.body.priority,
    ];
  
    const id = req.params.id;
  
    db.query(sql, [...values, id], (err, data) => {
      if (err) return res.status(500).json({ error: "Error updating task" });
      return res.status(200).json(data);
    });
  });


app.delete('/task/:id', (req, res) => {
    const sql = "DELETE FROM task WHERE ID=?";
    const id = req.params.id;
    db.query(sql, [id], (err, data) => {
        if (err) return res.status(500).json({ error: "Error updating task" });
        return res.status(200).json(data);
    });
});

app.put('/markCompleted/:id', (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE task SET status = ? WHERE ID = ?";
    const values = [status, req.params.id];
  
    db.query(sql, values, (err, data) => {
      if (err) return res.status(500).json({ error: "Error updating task status" });
      return res.status(200).json(data);
    });
  });
  



app.listen(8081, () => {
    console.log("Server listening on http://localhost:8081");
    db.connect((err) => {
        if (err) throw err;
        console.log("Database connected");
    });
});
