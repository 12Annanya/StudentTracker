const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


const app = express();
const PORT = 3000;

// middleware to read form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files (css, images)
app.use(express.static('public'));


// ROUTES FOR HTML PAGES

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});


// SIGNUP LOGIC

app.post('/signup', async (req, res) => {

    const users = JSON.parse(fs.readFileSync('users.json'));

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    };

    users.push(newUser);

    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    res.send("Signup successful!");
});


// LOGIN LOGIC

app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const users = JSON.parse(fs.readFileSync('users.json'));

    const user = users.find(u => u.email === email);

    if (!user) return res.send("User not found");

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.send("Invalid credentials");

    res.send("Login successful!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
