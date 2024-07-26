const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Image = require('../src/Model/imageModel');
const User = require('../src/Model/userModel')

function isAuthenticated(req, res, next) {
    if (req.session && req.session.korisnik) {
        next();
    } else {
        res.status(401).send('Morate biti prijavljeni da biste izvršili ovu akciju.');
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const { comment, pickupDate, userId } = req.body;
  
      if (!comment) {
        return res.status(400).send('Comment is required.');
      }
  
      if (!pickupDate) {
        return res.status(400).send('Pickup date is required.');
      }
  
      const pickupDateObj = new Date(pickupDate);
      if (isNaN(pickupDateObj.getTime())) {
        return res.status(400).send('Invalid pickup date.');
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
      const newImage = new Image({
        imagePath: imageUrl,
        userId: userId,
        comments: [{ commenterName: user.korisnickoime, commentText: comment }],
        pickupDate: pickupDateObj
      });
  
      await newImage.save();
      res.status(201).json({ message: 'Slika je uspješno poslana!', imageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
