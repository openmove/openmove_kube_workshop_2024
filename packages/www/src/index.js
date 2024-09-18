const express = require("express");
const config = require("./config");
const app = express();
const port = config.port;

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/img/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const item = {
        name: "test",
        url: "https://placecats.com/bella/300/200",
    };

    res.render("img", { item });
});

// startup
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
