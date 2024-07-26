var userModel = require('./Model/userModel');
var session = require('express-session');

module.exports.checkUsernameExists = async (korisnickoime) => {
  try {
    const existingUser = await userModel.findOne({ korisnickoime: korisnickoime });
    return existingUser !== null;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

module.exports.createUserDBService = async (userDetails) => {
  console.log('Received request:', userDetails);
  console.log('Form data:', userDetails);

  const usernameExists = await module.exports.checkUsernameExists(userDetails.korisnickoime);

  if (usernameExists) {
    return { status: false, message: 'Korisničko ime već postoji. Molimo odaberite drugo korisničko ime.' };
  }

  try {
    console.log('Inside createUserDBService');

    var userModelData = new userModel();

    userModelData.ime = userDetails.ime;
    userModelData.prezime = userDetails.prezime;
    userModelData.korisnickoime = userDetails.korisnickoime;
    userModelData.email = userDetails.email;
    userModelData.lozinka = userDetails.lozinka;

    console.log('Usermodeldata: ' + userModelData.ime);
    const result = await userModelData.save();
    console.log('User saved successfully:', result);
    return { status: true, message: 'Uspješno ste se registrirali!' };
  } catch (error) {
    console.error('Error saving to database:', error);
    return { status: false, message: 'Registracija nije uspjela. Molimo pokušajte ponovno.' };
  }
};

module.exports.loginUserDBService = async (loginDetails, req) => {
  try {
    console.log('Received login request:', loginDetails);

    const korisnickoime = loginDetails.korisnickoime;
    const lozinka = loginDetails.lozinka;

    const user = await userModel.findOne({ korisnickoime: korisnickoime });
    console.log('Tražim usera u bazi za korisnickoime:', korisnickoime);
    console.log('Unesena lozinka:', lozinka);

    if (user && user.lozinka === lozinka) {
      console.log("user??" + user)
      req.session.korisnik = user;
      console.log('req sessuibn jorn' + req.session.korisnik)
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          throw err;
        }
        req.session.korisnik = user;
        console.log('Uspješna prijava!', req.session.korisnik);
      });
      return { status: true, message: 'Uspješna prijava!' };
    } else {
      console.log('Neuspješna prijava. Provjerite korisničko ime i lozinku.');
      return { status: false, message: 'Neuspješna prijava. Provjerite korisničko ime i lozinku.' };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { status: false, message: 'Greška prilikom prijave. Molimo pokušajte ponovno.' };
  }
};
