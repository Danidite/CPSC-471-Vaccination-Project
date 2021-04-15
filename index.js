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

//API ROUTES
const apiRoutes       = require("./routes/api");

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
app.use("/api", apiRoutes);

app.get('*', (req, res) => {
    req.flash("error", "Page not found");   
    res.redirect("/");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

