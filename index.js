const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

const pool = mysql.createPool({
  host: '192.168.21.158',
  user: 'foo',
  password: 'bar',
  database: 'Your_mom',
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/name', async (req, res) => {
    const { name } = req.body;
  
    try {
      const connection = await pool.getConnection();
      await connection.query('INSERT INTO Names (Name) VALUES (?)', [name]);
      connection.release();
      res.status(201).json({ message: 'Name saved successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to save name' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
