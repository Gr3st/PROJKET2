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
