const Schemas = require('../models/schemas');

exports.dodaj = async (req, res) => {
    const { imie, nazwisko, email, id, cena, countdown } = req.body;

    if (!imie || !nazwisko || !email || !id || !countdown || !cena) {
        return res.status(400).send('All fields are required');
    }

    try {
        const existingUser = await Schemas.Users.findOne({ id });

        if (existingUser) {
            return res.status(400).send('User with this ID already exists');
        }

        // Parse the countdown time in "hours:minutes" format
        const [hours, minutes] = countdown.split(':').map(Number);
        const countdownTime = (hours * 60 * 60) + (minutes * 60); // Convert to seconds
        
        const newUser = new Schemas.Users({ imie, nazwisko, email, id, cena, countdown: countdownTime });
        // newUser.updateExitDate();
        await newUser.save();
        res.send('User added successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
// Update user expiration status
exports.updateExpiration = async (req, res) => {
    const { id } = req.params;
    const { exitDate } = req.body;

    try {
        const user = await Schemas.Users.findOne({ id });

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.exitDate = exitDate;
        await user.save();

        res.send('User expiration status updated successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.data = async (req, res) => {
    try {
        const users = await Schemas.Users.find({});
        const currentTime = new Date().getTime();

        const usersWithRemainingTime = users.map(user => {
            const elapsedTime = (currentTime - new Date(user.entryDate).getTime()) / 1000;
            const remainingTime = Math.max(user.countdown - elapsedTime, 0);
            return { ...user.toObject(), remainingTime};
        });

        res.json(usersWithRemainingTime);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Nowa funkcja do usuwania użytkownika
exports.usun = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Schemas.Users.deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).send('User not found');
        }

        res.send('User deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
