require('dotenv').config();
const   Joi             = require('joi'),
        express         = require('express'),
        session         = require('cookie-session'),
        app             = express(),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        flash           = require("connect-flash");

const PORT = process.env.PORT || 3000;

const connection = require("./database");

//Requiring routes
const adminRoutes       = require("./routes/admin"),
      userRoutes        = require("./routes/user"),
      vaccineRoutes       = require("./routes/vaccine"),
      clinicRoutes        = require("./routes/clinic"),
      indexRoutes       = require("./routes/index");

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());

app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SECERT || 'LMAO Secret xddd',
	keys: [process.env.K1 || 'Rifatism', process.env.K2 || 'Noluna', process.env.K3 || 'JensusIsLife', process.env.K4 || 'LmaoKeyxd']
}));

// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
app.use(function (req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  next()
})

app.use((req, res , next) => {
    res.locals.currentUser = req.session.user;
    res.locals.error =req.flash("error");
    res.locals.success =req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/vaccines", vaccineRoutes);
app.use("/clinics", clinicRoutes);

app.get('*', (req, res) => {
    req.flash("error", "Page not found");   
    res.redirect("/");
});

// Login
app.post('/api/login', (req, res) => {
    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.body.username], function (error, results, fields) {
        if (results.length == 0) {
            res.status(404).send('User could not be found.');
        } else 
        if (results[0].Password == req.body.password) {
            res.status(200).send(results);
        } else {
            res.status(404).send('Password Incorrect');
        }
    });
});

// Register New User
app.post("/api/register", async (req, res) => {
    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.body.username], function (error, results, fields) {
        if (error) {
            console.log("Select user with email: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            connection.query('INSERT INTO USER SET ?', {Email: req.body.username, Password: req.body.password, FName: req.body.firstname, Mname: req.body.middlename, LName: req.body.lastname}, function (error, results, fields) {
                if (error) {
                    console.log("user creation: " + error.message);
                    return res.status(404).send(error.message);
                }
        
                let UserID = results.insertId;
        
                connection.query('INSERT INTO PATIENT SET ?', {ID: UserID, Age: req.body.age, PhoneNumber: req.body.phone, Address: req.body.address, PostalCode: req.body.postal, Country: req.body.country, Province: req.body.province, City: req.body.city.toUpperCase()}, function (error, results, fields) {
                    if (error) {
                        console.log("Patient creation: " + error.message);
                        return res.status(404).send(error.message);
                    }

                    connection.query('INSERT INTO HEALTH_PROFILE SET ?', {ID: UserID, HealthNumber: req.body.healthcard}, function (error, results, fields) {
                        if (error) {
                            console.log("Health Card creation: " + error.message);
                            return res.status(404).send(error.message);
                        }
                        res.status(200).send(results); // successful register
                    });
                });
            });
        } else {
            return res.status(404).send('Email already Taken!');
        }
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

