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

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());


app.set('trust proxy', 1);

app.use(session({
    secret:'LMAO Secret xddd',
    saveUninitialized: true,
    resave: false
}));

app.use(function(req,res,next){
    if(!req.session){
        return next(new Error('Oh no')) //handle error
    }
    next() //otherwise continue
 });

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



const vaccines = [
    {
        ID: 1,
        Name: 'Moderna',
        Advisery: 'COVID-19',
        Description: '2 dose vaccine',
        CreaterID: 1
    },
    {
        ID: 2,
        Name: 'Pfizer',
        Advisery: 'COVID-19',
        Description: '2 dose vaccine',
        CreaterID: 1
    }
];

const users = [
    {
        ID: 1,
        Email: "test1@gmail.com",
        Password: "1212",
        FName: "Bob",
        MName: "Tanner",
        LName: "Mgee"
    },
    {
        ID: 2,
        Email: "test2@gmail.com",
        Password: "1234",
        FName: "Iris",
        MName: "West",
        LName: "Allen"
    }
]


//Basic APIs below


// Login
app.get('/api/login/:email/:password', (req, res) => {
    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.params.email], function (error, results, fields) {
        // console.log(results);
        if (results.length == 0) {
            res.status(404).send('User could not be found.');
        } else 
        if (results[0].Password == req.params.password) {
            res.status(200).send(results);
        } else {
            res.status(404).send('Password Incorrect');
        }
    });
});


// View Vaccines
app.get('/api/vaccines', (req, res) => {
    res.status(200).send(vaccines);
});



// Select Vaccine
app.get('/api/vaccines/:name', (req, res) => {
    const vaccine = vaccines.find(v => v.Name === req.params.name);
    if (!vaccine) {
        res.status(404).send('Vaccine could not be found.');
        return;
    }
    res.status(200).send(vaccine);
});

// Add Vaccine
app.post('/api/vaccines', (req, res) => {
    const { error } = validateVaccine(req.body);
    if(error) {
        // 400 Bad Request
        res.status(400).send(error);
        return;
    }

    const vaccine = {
        ID: vaccines.length + 1,
        Name: req.body.name,
        Advisery: req.body.advisery,
        Description: req.body.description,
        CreaterID: req.body.createrID
    };
    vaccines.push(vaccine);
    res.send(vaccine);
});

// Edit Customer
app.put('/api/customers/:id', (req, res) => {
    const user = users.find(u => u.ID === parseInt(req.params.id));
    if (!user)  {
        res.status(404).send('Customer could not be found.');
        return;
    }

    const { error} = validateCustomer(req.body);
    if(error) {
        // 400 Bad Request
        res.status(400).send(error);
        return;
    }

    // Edit The Customer
    user.Email = req.body.email;
    user.Password = req.body.password;
    user.FName = req.body.fName;
    user.MName = req.body.mName;
    user.LName = req.body.lName;
    res.send(user);
});


// Validation functions
function validateVaccine(vaccine) {
    const schema = Joi.object ({
        name: Joi.string().required(),
        advisery: Joi.string().required(),
        description: Joi.string().required(),
        createrID: Joi.number().required()
    });

    return schema.validate(vaccine);
}

function validateCustomer(user) {
    const schema = Joi.object ({
        email: Joi.string().required(),
        password: Joi.string().required(),
        fName: Joi.string().required(),
        mName: Joi.string().required(),
        lName: Joi.string().required()
    });

    return schema.validate(user);
}

// Remove Offered Vaccine
app.delete('/api/vaccines/:id', (req, res) => {
    const vaccine = vaccines.find(v => v.ID === parseInt(req.params.id));
    if (!vaccine) {
        res.status(404).send('Vaccine could not be found.');
        return;
    }

    // Delete
    const index = vaccines.indexOf(vaccine);
    vaccines.splice(index, 1);

    res.send(vaccine);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

