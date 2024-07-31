const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'https://webtest.com.pl',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use('/', router);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected!'))
    .catch(err => console.log(err));

// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//     console.log('Connected to MongoDB');

//     // Wywołaj funkcję inicjalizacji cen po połączeniu z bazą danych
//     initializePrices().then(() => {
//     console.log('Prices initialized');
//     }).catch((error) => {
//     console.error('Error initializing prices:', error);
//     });
// })
.catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
