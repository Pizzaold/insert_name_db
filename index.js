const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "qwerty",
  database: "margus_shit",
});

app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/api/register", async (req, res) => {
  const { name, password } = req.body;

  try {
    const [result] = await pool.query("SELECT COUNT(*) AS count FROM users WHERE name = ?", [name]);
    if (result[0].count > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const connection = await pool.getConnection();

    await connection.query("INSERT INTO users (name, password) VALUES (?, ?)", [name, hashedPassword]);

    const [newUser] = await connection.query("SELECT * FROM users WHERE name = ?", [name]);
    connection.release();

    const token = jwt.sign({ id: newUser[0].id, name: newUser[0].name }, 'your_secret_key', { expiresIn: '1d' });
    
    res.status(201).json({ message: "User saved successfully", token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE name = ?", [name]);
    const user = users[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ id: user.id, name: user.name }, 'your_secret_key', { expiresIn: '1d' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
