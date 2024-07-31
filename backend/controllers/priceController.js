const Schemas = require('../models/schemas');

// Predefined time ranges and prices
const predefinedPrices = [
  { timeRange: '1 min', cena: 0.5 },
  { timeRange: '5 min', cena: 1 },
  { timeRange: '1 godz', cena: 20 },
  { timeRange: '2 godz', cena: 35 },
  { timeRange: 'cały dzień', cena: 200 }
];

exports.dodajCene = async (req, res) => {
  const { czas, cena } = req.body;

  if (!czas || !cena) {
    return res.status(400).send('All fields are required');
  }

  try {
    const existingCeny = await Schemas.Ceny.findOne({ cena });

    if (existingCeny) {
      return res.status(400).send('Cena already exists');
    }

    const newCena = new Schemas.Ceny({ timeRange: czas, cena });
    await newCena.save();
    res.send('Price added successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.dataPrice = async (req, res) => {
  try {
    const price = await Schemas.Ceny.find({});
    res.json(price);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updatePrice = async (req, res) => {
  const { cena, nowaCena } = req.body;

  try {
    const ceny = await Schemas.Ceny.findOne({ cena });

    if (!ceny) {
      return res.status(404).send('Price not found');
    }

    ceny.cena = nowaCena;
    await ceny.save();

    res.send('Price updated successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.usunPrice = async (req, res) => {
  const { timeRange } = req.params;

  try {
    const result = await Schemas.Ceny.deleteOne({ timeRange });

    if (result.deletedCount === 0) {
      return res.status(404).send('Price not found');
    }

    res.send('Price deleted successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Initialize the predefined prices on server start
const initializePrices = async () => {
  try {
    const existingPrices = await Schemas.Ceny.find({});
    if (existingPrices.length === 0) {
      await Schemas.Ceny.insertMany(predefinedPrices);
      console.log('Predefined prices initialized.');
    } else {
      console.log('Prices already initialized.');
    }
  } catch (error) {
    console.error('Error initializing prices:', error);
  }
};

initializePrices();
