// this will be where the server handles CRUD requests
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
app.use(express.static("build"));
app.use(express.json()); // auto JSON.parse the req.body

app.post('/', (req, res) => {
    console.log("Handling post request");
    console.log(req.body);
    res.json(req.body.toAdd);
});

app.listen(port, err => {
    if (err) throw err;
    else {
        console.log(`server ready on http://localhost:${port}`);
    }
});