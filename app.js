require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const setupSwagger = require('./swagger');
const routerApi = require('./routes/rutas');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
routerApi(app);
setupSwagger(app);

// Error Handler
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('No se puede conectar a MongoDB', err));

// Server Port
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
