// Bring in Express code
const express = require('express')

const app = express()
const port = 3000
const usersList = require("./userData");

app.use(express.json()) // This line is necessary for Express to be able to parse JSON in request body's

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// All users route
app.get('/all-users', (req, res) => {
    res.send(usersList);
});

// Single user route
app.get('/single-user/:phoneNumber', (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    const user = usersList.find(user => user.phone === phoneNumber);
    res.send(user);
});

// Some users route
app.get('/some-users/:countryName', (req, res) => {
    const countryName = req.params.countryName.toLowerCase();
    const users = usersList.filter(user => user.location.country.toLowerCase() === countryName);
    res.send(users);
});

// Post new user
app.post('/new-user', (req, res) => {
    console.log('New user received:', req.body);

    if (!req.body || !req.body.gender || !req.body.name || !req.body.location || !req.body.email || !req.body.phone || !req.body.cell || !req.body.nat) {
        return res.status(404).json({ error: true, message: "please fix your post data request" });
    }

    const newUser = {
        gender: req.body.gender,
        name: {
            title: req.body.name.title,
            first: req.body.name.first,
            last: req.body.name.last,
        },
        location: {
            city: req.body.location.city,
            state: req.body.location.state,
            country: req.body.location.country,
            postcode: req.body.location.postcode,
        },
        email: req.body.email,
        phone: req.body.phone,
        cell: req.body.cell,
        nat: req.body.nat,
    };

    usersList.push(newUser);
    res.status(200).json({ message: "Success" });
});

// Put update user
app.put('/update-user/:email', (req, res) => {
    const email = req.params.email;
    const findIndex = usersList.findIndex(user => user.email === email);

    if (findIndex === -1) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = usersList[findIndex];
    const updatedUserInfo = { ...user };

    for (let key in req.body) {
        if (req.body[key]) {
            updatedUserInfo[key] = req.body[key];
        }
    }

    usersList.splice(findIndex, 1, updatedUserInfo);

    console.log(updatedUserInfo);
    res.status(200).json({ message: 'Success' });
});

// Delete user
app.delete('/delete-user/:cellNumber', (req, res) => {
    const cellNumber = req.params.cellNumber;
    const userIndex = usersList.findIndex(user => user.cell === cellNumber);

    if (userIndex !== -1) {
        usersList.splice(userIndex, 1);
        res.status(200).send({ success: true });
    } else {
        res.status(404).send({ success: false, message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})