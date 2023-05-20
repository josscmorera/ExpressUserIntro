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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})