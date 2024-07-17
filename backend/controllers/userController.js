const Schemas = require('../models/schemas');

exports.dodaj = async (req, res) => {
    const { imie, nazwisko, email, id } = req.body;

    if (!imie || !nazwisko || !email || !id) {
        return res.status(400).send('All fields are required');
    }

    try {
        const existingUser = await Schemas.Users.findOne({ id });

        if (existingUser) {
            return res.status(400).send('User with this ID already exists');
        }

        const newUser = new Schemas.Users({ imie, nazwisko, email, id });
        await newUser.save();
        res.send('User added successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
