const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

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

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/user", async (req, res) => {
  const { name, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const decriptedPasword = await bcrypt.hash(password, salt);
    const connection = await pool.getConnection();
    await connection.query("INSERT INTO users (Name, Password) VALUES (?, ?)", [
      name,
      decriptedPasword,
    ]);
    connection.release();
    res.status(201).json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
