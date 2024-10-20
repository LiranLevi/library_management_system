const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);
app.use('/users', userRoutes);

mongoose.connect(config.mongoURI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(config.port, () => console.log(`Server is running on port ${config.port}`));
    })
    .catch(err => console.error('MongoDB connection failed:', err));

module.exports = app;