var express = require('express');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.korisnik) {
        next();
    } else {
        res.status(401).send('Morate biti prijavljeni da biste izvršili ovu akciju.');
    }
}
var userController = require('../src/Controller/userController.js'); 
const customCakeController = require('../src/Controller/customCakeController.js');
const cake2Controller = require('../src/Controller/customCake2Controller.js');

const router = express.Router();

router.route('/slatkaZelja/login').post(userController.loginUserControllerFn);
router.route('/slatkaZelja/create').post(userController.createUserControllerFn); 

router.post('/custom-cake/create', customCakeController.createCustomCake);
router.post('/create-Tray',isAuthenticated, cake2Controller.createCustomCake2);
router.get('/check-date-availability',isAuthenticated, customCakeController.checkDateAvailability);

module.exports = router;
