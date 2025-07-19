const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to BiteSpeed Task" });
});

// Versioned API routes
const apiV1Router = express.Router();
app.use('/api/v1', apiV1Router);

module.exports = app;
