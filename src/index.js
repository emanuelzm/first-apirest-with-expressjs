const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json())
app.use(express.static("public"));

app.set("AppName", "My first server");
app.set("port", 3100);
app.set("view engine", "ejs");

// Conexion a la base de datos

try {
    mongoose.connect('mongodb://localhost:27017/userDB')
    console.log('DB is connected')
} catch (error) {
    console.log(error);
}

// Modelos Shema mongoDB

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    image: String,
});

const User = mongoose.model('User', userSchema);

// Rutas

app.get("/users/db", async (req, res) => {
    await User.find()
        .then(user =>  res.json(user))
        .catch(err => res.json(err))
});

app.get("/users", async (req, res) => {
    let data = [];

    await User.find()
        .then(user => res.render("index.ejs", {users: user}))
        .catch(err => res.json(err));

});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Rutas para guardar usuarios

app.get("/users/new", (req, res) => {
    res.sendFile("./login/signup.html", { root: "./src/public" });
});

app.post("/users/new", (req, res) => {
    const body = req.body;
    const user = new User(body);
    user.save();

    res.json({
        message: "User saved",
        user
    });
});

// Ruta para actualizar

app.put("/users/update/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body;
   
    const newDato = await User.findByIdAndUpdate(id,body,{new:true});
    res.json({
        message: "User updated",
        body
    });
});

// Ruta para eliminar

app.delete("/users/delete/:id", async (req, res) => {
    const { id } = req.params;
   
    await User.findByIdAndDelete(id);

    res.json({
        message: "User deleted"
    });
});

app.listen(app.get("port"), () => {
    console.log(app.get("AppName"));
    console.log(`Serve on port ${app.get("port")}`);
});