const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const app = express();

const Image = require('./src/Model/imageModel');
const CustomCake = require('./src/Model/customCakeModel');
const Cake = require('./src/Model/cakeModel');
const User = require('./src/Model/userModel');
const Tray = require('./src/Model/TrayModel');
const userService = require('./src/userService');


app.use(session({
    secret: 'tajna',
    resave: false,
    saveUninitialized: false,
    maxAge  : 24*60*60*1000,
    cookie: { secure: false, httpOnly: true, path: '/', }
}));


app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

var routes = require('./Route/routes.js');
const uploadRoutes = require('./Route/uploadRoutes');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/abc", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected successfully to MongoDB'))
    .catch((err) => console.error("Not connected", err));

// Login route
app.post('/slatkaZelja/login', async (req, res) => {
    const loginDetails = req.body;
    try {
        const user = await userService.loginUserDBService(loginDetails, req);
        if (user.status) {
            req.session.korisnik = user.user;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    res.status(500).json({ success: false, message: 'Server error while logging in.' });
                } else {
                    res.status(200).json({ success: true, message: 'Uspješna prijava!' });
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Netočno korisničko ime ili lozinka' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, message: 'Server error while logging in.' });
    }
});

// Session status route
app.get('/session-status', (req, res) => {
    console.log('req session', req.session);
    if (req.session.korisnik) {
        res.json({ loggedIn: true, korisnickoime: req.session.korisnik.korisnickoime });
    } else {
        res.json({ loggedIn: false });
    }
});


app.get('/gallery', async (req, res) => {
    try {
        const images = await Image.find({ isDeleted: false });
        const customCakes = await CustomCake.find({ isDeleted: false }).populate('userId');
        const trays = await Tray.find({ isDeleted: false }).populate('userId');
        const galleryData = [
            ...images.map(img => ({
                _id: img._id,
                tip: 'Slike',
                imagePath: img.imagePath,
                orderedByUsername: img.comments[0]?.commenterName,
                comments: img.comments.map(c => `${c.commenterName}: ${c.commentText}`).join(', '),
                datumPreuzimanja: img.pickupDate.toLocaleDateString("hr-HR"),
                status: img.status,
            })),
            ...customCakes.map(cake => ({
                _id: cake._id,
                tip: 'Torte',
                detalji: `Oblik: ${cake.shape}, Veličina: ${cake.size}, Boja: ${cake.color}, Biskvit: ${cake.biscuit}, Krema: ${cake.cream}, Katovi: ${cake.kat}, Rođendan: ${cake.birthday ? 'Da' : 'Ne'}, Godine: ${cake.age || 'N/A'}, Cijena: €${cake.totalPrice.toFixed(2)}, Datum preuzimanja: ${cake.pickupDateTime.toLocaleDateString("hr-HR")}`,
                orderedByUsername: cake.userId.korisnickoime,
                datumPreuzimanja: cake.pickupDateTime.toLocaleDateString("hr-HR"),
                status: cake.status,
            })),
            ...trays.map(tray => ({
                _id: tray._id,
                tip: 'Kolači',
                brojTacni: tray.trayCount,
                kolači: tray.cakes.map(cake => `Vrsta kolača: ${cake.cakeType}, Broj: ${cake.count}, Cijena po komadu: €${cake.pricePerPiece.toFixed(2)}`),
                ukupnaCijena: `€${tray.totalPrice.toFixed(2)}`,
                orderedByUsername: tray.userId.korisnickoime,
                datumPreuzimanja: tray.pickupDate.toLocaleDateString("hr-HR"),
                status: tray.status,
            }))
        ];

        console.log(galleryData);
        res.json(galleryData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/my-orders', async (req, res) => {
    try {
        const images = await Image.find({ isDeleted: false }).populate('userId');
        const customCakes = await CustomCake.find({ isDeleted: false }).populate('userId');
        const trays = await Tray.find({ isDeleted: false }).populate('userId');

        console.log("trays: ", trays, "images: ", images)

        const myOrdersData = [
            ...images.map(img => ({
                _id: img._id,
                userId: img.userId,
                tip: 'Slike',
                imagePath: img.imagePath,
                orderedByUsername: img.comments[0]?.commenterName,
                comments: img.comments.map(c => `${c.commenterName}: ${c.commentText}`).join(', '),
                datumKreiranja: img.createdAt.toLocaleDateString("hr-HR"),
                datumPreuzimanja: img.pickupDate.toLocaleDateString("hr-HR"),
                status: img.status,
            })),
            ...customCakes.map(cake => ({
                _id: cake._id,
                userId: cake.userId,
                tip: 'Torte',
                detalji: `Oblik: ${cake.shape}, Veličina: ${cake.size}, Boja: ${cake.color}, Biskvit: ${cake.biscuit}, Krema: ${cake.cream}, Katovi: ${cake.kat}, Rođendan: ${cake.birthday ? 'Da' : 'Ne'}, Godine: ${cake.age || 'N/A'}, Cijena: €${cake.totalPrice.toFixed(2)}`,
                datumPreuzimanja: cake.pickupDateTime.toLocaleDateString("hr-HR"),
                datumKreiranja: cake.createdAt.toLocaleDateString("hr-HR"),
                status: cake.status,
                orderedByUsername: cake.userId.korisnickoime
            })),
            ...trays.map(tray => ({
                _id: tray._id,
                userId: tray.userId,
                tip: 'Kolači',
                brojTacni: tray.trayCount,
                kolači: tray.cakes.map(cake => `Vrsta kolača: ${cake.cakeType}, Broj: ${cake.count}, Cijena po komadu: €${cake.pricePerPiece.toFixed(2)}`),
                ukupnaCijena: `€${tray.totalPrice.toFixed(2)}`,
                datumKreiranja: tray.createdAt.toLocaleDateString("hr-HR"),
                datumPreuzimanja: tray.pickupDate.toLocaleDateString("hr-HR"),
                status: tray.status,
   
            }))
        ];

        res.json(myOrdersData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.post('/save-tray', async (req, res) => {
    const { trayCount, cakes, totalPrice, totalCalories, pickupDate, userId } = req.body;
    try {
        const newTray = new Tray({
            userId,
            trayCount,
            cakes,
            totalPrice,
            totalCalories,
            pickupDate: new Date(pickupDate)
        });
        await newTray.save();
        console.log(newTray);
        res.status(201).json({ message: 'Tray saved successfully!' });
    } catch (error) {
        console.error('Error saving tray:', error);
        res.status(500).json({ error: 'Failed to save tray', message: error.toString() });
    }
});

app.post('/mark-order-as-deleted/:id', async (req, res) => {
    try {
        let result = await Image.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!result) {
            result = await CustomCake.findByIdAndUpdate(req.params.id, { isDeleted: true });
        }
        if (!result) {
            result = await Tray.findByIdAndUpdate(req.params.id, { isDeleted: true });
        }

        if (result) {
            res.json({ message: 'Narudžba je obrisana!' });
        } else {
            res.status(404).json({ message: 'Narudžba nije pronađena!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Došlo je do greške pri označavanju narudžbe kao obrisane.' });
    }
});

app.post('/update-order-status', async (req, res) => {
    const { orderId, status } = req.body;

    console.log('Order status: ',req.body)

    try {
        let updatedOrder = await CustomCake.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            updatedOrder = await Tray.findByIdAndUpdate(orderId, { status }, { new: true });
        }
        if (!updatedOrder) {
            updatedOrder = await Image.findByIdAndUpdate(orderId, { status }, { new: true });
        }

        if (updatedOrder) {
            res.json({ message: 'Status narudžbe ažuriran.' });
        } else {
            res.status(404).send('Narudžba nije pronađena.');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Greška pri ažuriranju statusa narudžbe.');
    }
});

app.get('/get-user-details', async (req, res) => {
    try {
        const user = await User.findById(User._id);
        if (!user) {
            console.log("korisnik nije pronaden");
            return res.status(404).send('Korisnik nije pronađen.');
        }
        res.json({ korisnickoime: user.korisnickoime, ime: user.ime, prezime: user.prezime });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Došlo je do server greške.');
    }
});

app.get('/get-user-details/:userName', async (req, res) => {
    const userName = req.params.userName;
    
    try {
        const user = await User.findOne({ korisnickoime: userName });
        console.log(user)
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }
        res.json({ user });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Došlo je do server greške.');
    }
});

app.post('/update-user-password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }
        if (user.lozinka === oldPassword) {
            user.lozinka = newPassword;
            await user.save();
            res.send({ success: true, message: 'Lozinka je ažurirana.' });
        } else {
            res.status(400).send({ success: false, message: 'Stara lozinka nije ispravna.' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send({ message: 'Došlo je do server greške.' });
    }
});

app.get('/Prijava.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Prijava.html'));
});

app.get('/gallery-view', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'gallery.html'));
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { fallthrough: false, index: false }));

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/Prijava.html');
    });
});

app.use((req, res, next) => {
    console.log("Received request:", req.method, req.originalUrl, req.body);
    next();
});

app.use(routes);
app.use('/upload', uploadRoutes);

app.listen(3000, function check(error) {
    if (error) {
        console.log("Error");
    } else {
        console.log("Server started and listening on port 3000");
    }
});
