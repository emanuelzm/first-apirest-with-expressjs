/*var DasdB = {
    HOST: process.env.NEXT_DB_HOST?.toString() || 'a',
    USER: process.env.NEXT_DB_USER?.toString() || 'b',
    PASS: process.env.NEXT_DB_PASS?.toString() || 'c',
    LINK: process.env.NEXT_DB_LINK?.toString() || 'd',
    NAME: process.env.NEXT_DB_NAME?.toString() || 'e',
}*/

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
    //mongoose.connect('mongodb://localhost:27017/userDB')
    mongoose.connect("mongodb+srv://brionna7:H3HMXX3wK7aXwfLx@cluster0.capxycv.mongodb.net/userDB");
    console.log('DB is connected');
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

app.get("/users/db/user/:id", async (req, res) => {
    const { id } = req.params;

    await User.find({"_id": id}).limit(1)
        .then(user =>  res.json(user))
        .catch(err => res.json(err))
});

app.get("/users", async (req, res) => {

    await User.find()
        .then(user => res.render("index.ejs", {users: user}))
        .catch(err => res.json(err));

});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Rutas para guardar usuarios

app.get("/users/signup", (req, res) => {
    res.sendFile("./login/signup.html", { root: "./src/public" });
});

app.post("/users/signup", (req, res) => {
    const body = req.body;
    const user = new User(body);
    user.save();

    res.json({
        message: "User saved",
        user
    });
});

app.get("/users/signin", (req, res) => {
    res.sendFile("./login/signin.html", { root: "./src/public" });
});

app.post("/users/signin", async (req, res) => {
    const body = req.body;
    const user = User(body);
    
        const saveDato = await User.find({"username": user.username, "password": user.password}).limit(1)
            .then(user => {
                res.status(200).json({ 
                    message: 'Search User retrieved successfully', 
                    user
                })
            })
            .catch(err => {
                res.status(500).json({ 
                    message: 'Error retrieving users', 
                    err
                })
            })
});

app.get("/users/logout", (req, res) => {
    res.sendFile("./logout/index.html", { root: "./src/public" });
});

// Ruta para el dashboard

app.get("/dashboard/", (req, res) => {
    res.sendFile("./dashboard/index.html", { root: "./src/public" });
});

app.get("/dashboard/:id", (req, res) => {
    const { id } = req.params;
    res.render("dashboard.ejs", {userid: id})
});

// Ruta para actualizar

app.put("/users/update/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body;
   
    const newDato = await User.findByIdAndUpdate(id,body,{new:true});9
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