const Schemas = require('../models/schemas');

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

    res.send('Price status updated successfully');
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
async function initializePrices() {
  const predefinedPrices = [
    { timeRange: '00:01', cena: 0.5 },
    { timeRange: '00:05', cena: 1 },
    { timeRange: '01:00', cena: 20 },
    { timeRange: '02:00', cena: 35 },
    { timeRange: '24:00', cena: 200 }
  ];

  for (const price of predefinedPrices) {
    const existingPrice = await Schemas.Ceny.findOne({ timeRange: price.timeRange });
    if (!existingPrice) {
      const newPrice = new Schemas.Ceny(price);
      await newPrice.save();
    }
  }
}

