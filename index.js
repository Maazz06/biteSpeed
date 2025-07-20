const express = require('express');
const cors = require('cors');
const identify = require('./controller/contactController');

const app = express();
const router = express.Router();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Base route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to BiteSpeed Task" });
});

// Routes
router.post('/identify', identify);
app.use(router); 



module.exports = app;
