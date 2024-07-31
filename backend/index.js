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
    .then(() => {
        console.log('DB Connected!');
        initializeDefaultPrices();  // Initialize default prices after DB connection
    })
    .catch(err => console.log(err));

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const Schemas = require('../models/schemas');

// Function to initialize default prices
const initializeDefaultPrices = async () => {
    const defaultPrices = [
        { timeRange: ["00:01", "00:05"], cena: ["1zł", "2zł"] },
        // Add more default prices as needed
    ];

    for (const price of defaultPrices) {
        try {
            const existingPrice = await Schemas.Ceny.findOne({ timeRange: price.timeRange });
            if (!existingPrice) {
                const newPrice = new Schemas.Ceny(price);
                await newPrice.save();
                console.log(`Default price ${price.cena} added successfully.`);
            } else {
                console.log(`Default price ${price.cena} already exists.`);
            }
        } catch (error) {
            console.error('Error initializing default prices:', error);
        }
    }
};
