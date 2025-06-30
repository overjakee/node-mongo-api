const express = require('express');
const userRoutes = require('./routes/user.route');
const errorMiddleware = require('./middlewares/error.middleware');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));          // Logging request แบบง่าย (console)
app.use(express.json());
app.use('/api/users', userRoutes);
app.use(errorMiddleware);

module.exports = app;
