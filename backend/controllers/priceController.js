const Schemas = require('../models/schemas');

exports.dodajCene = async (req, res) => {
    const { czas, cena} = req.body;

    if (!czas || !cena) {
        return res.status(400).send('All fields are required');
    }

    try {
        const existingUser = await Schemas.Users.findOne({ cena });

        if (existingUser) {
            return res.status(400).send('Cena already exists');
        }

        const newUser = new Schemas.Users({ imie, nazwisko, email, id, cena, countdown: countdownTime });
        await newUser.save();
        res.send('User added successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};


