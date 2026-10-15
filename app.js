
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// 1. Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Module Exports Router
const blog = require('./blog');
app.use('/', blog);


// Connect Database
const { connectToMongoDB } = require('./db');
connectToMongoDB();

// 6. Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
