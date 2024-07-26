var userService = require('../userService.js');
var userModel = require('../Model/userModel.js');

var createUserControllerFn = async (req, res) => {
  try {
    console.log("Zahtjev za registracijom primljen:", req.body);
    console.log('Tip lozinke:', typeof req.body.lozinka);

    const existingUser = await userService.checkUsernameExists(req.body.korisnickoime);
    if (existingUser) {
      return res.json({ status: false, message: 'Korisničko ime već postoji. Molimo odaberite drugo.' });
    }

    var result = await userService.createUserDBService(req.body);
    console.log(result);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.json({ status: false, message: 'Greška prilikom registracije. Molimo pokušajte ponovno.' });
  }
}

var loginUserControllerFn = async (req, res) => {
  try {
      const { korisnickoime, lozinka } = req.body;
      const user = await userModel.findOne({ korisnickoime: korisnickoime });
      
if (user && user.lozinka === lozinka) {
  req.session.korisnik = {
      _id: user._id,
      korisnickoime: user.korisnickoime,
      uloga: user.uloga
  };

  let redirectUrl = user.uloga === 'admin' ? '/gallery.html' : '/';
  return res.json({ status: true, redirect: redirectUrl }); 
} else {
  return res.status(401).json({ status: false, message: 'Neuspješna prijava. Provjerite korisničko ime i lozinku.' });
}

  } catch (err) {
      console.log(err);
      return res.status(500).json({ status: false, message: 'Greška prilikom prijave. Molimo pokušajte ponovno.' });
  }
}

module.exports = { createUserControllerFn, loginUserControllerFn };

