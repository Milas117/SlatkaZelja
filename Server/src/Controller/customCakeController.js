const CustomCake = require('../Model/customCakeModel');
const User = require('../Model/userModel');  

exports.createCustomCake = async (req, res) => {
    try {
        const customCake = new CustomCake({
            ...req.body, 
            userId: req.body.userId 
        });

        await customCake.save();
        res.status(201).json({ message: 'Torta je uspješno personalizirana!' });
    } catch (error) {
        console.error('Error creating custom cake:', error);
        res.status(500).json({ message: 'Došlo je do greške prilikom spremanja torte.', error: error.toString() });
    }
};

exports.checkDateAvailability = async (req, res) => {
    try {
        const chosenDate = new Date(req.query.date);
        const startOfDay = new Date(chosenDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(chosenDate.setHours(23, 59, 59, 999));

        const cakes = await CustomCake.find({
            pickupDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        res.json({ isAvailable: cakes.length === 0 });
    } catch (error) {
        console.error('Error checking date availability:', error);
        res.status(500).json({ error: error.toString() });
    }
};
