const Tray = require('../Model/TrayModel');
const User= require('../Model/userModel');  


exports.createCustomCake2 = async (req, res) => {
    try {
        const newTray = new Tray({
            ...req.body,
            userId: req.body.userId,
            pickupDate: new Date(pickupDate) 
        });

        console.log("New Tray being saved:", newTray);
        await newTray.save();
        res.status(201).json({ message: 'Pladanj je uspješno spremljen!' });
    } catch (error) {
        console.error('Error saving tray:', error);
        res.status(500).json({ message: 'Došlo je do greške prilikom spremanja pladnja.', error: error.toString() });
    }
};
