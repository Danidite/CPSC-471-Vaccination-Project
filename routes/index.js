const   connection  = require("../database"),
        express     = require("express"),
        router      = express.Router();

router.get('/', (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    if(req.session.user) {
        req.flash("error", "You are already logged in!");   
        return res.redirect('/');
    } 
    res.render("register");
});

//Show login form
router.get("/login", (req, res) => {
    if(req.session.user) {
        req.flash("error", "You are already logged in!");   
        return res.redirect('/');
    } 
    res.render("login");
});

// Login (in website)
router.post('/login', (req, res) => {
    // console.log(req.body.username + " " + req.body.password);
    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.body.username], function (error, results, fields) {
        if (error) {
            console.log("Search User: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/login');
        }

        // console.log(results);
        if (results.length == 0) {
            // res.status(404).send('User could not be found.');
            req.flash("error", "User could not be found!");
            res.redirect("/login");
        } else 
        if (results[0].Password == req.body.password) {

            req.session.user = results[0];
            
            connection.query('SELECT * FROM `ADMIN` WHERE `ID` = ?', [req.session.user.ID], function (error, results, fields) {
                if (error) {
                    console.log("Search Admin: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect('/login');
                }
                if (results.length == 0) {
                    // console.log("User: "+ req.session.user.email + ", is NOT ADMIN!");
                    req.session.user.Admin = false;
                    req.session.user.Password = '*******';
                    // console.log(req.session.user);
                    connection.query('SELECT * FROM `PATIENT` WHERE `ID` = ?', [req.session.user.ID], function (error, results, fields) {
                        if (error) {
                            console.log("Search Patient: " + error.message);
                            req.flash("error", error.message);            
                            return res.redirect('/login');
                        }

                        if (results.length == 0) {  
                            console.log("This user is neither a admin or patient!!!!!");
                            // req.flash("error", "This user is neither a admin or patient!!!!!");  
                            // return res.status(404).send('ERROR!!!! This user is neither a admin or patient!!!!!');

                            req.flash("error", "ERROR!!!! This user is neither a admin or patient!!!!!");            
                            return res.redirect('/login');
                        } else {
                            let patientInfo = results[0];
                            req.session.user.Age = patientInfo.Age;
                            req.session.user.PhoneNumber = patientInfo.PhoneNumber;
                            req.session.user.PostalCode = patientInfo.PostalCode;
                            req.session.user.Country = patientInfo.Country;
                            req.session.user.Province = patientInfo.Province;
                            req.session.user.City = patientInfo.City;
                            // console.log(req.session.user);
                            connection.query('SELECT * FROM `HEALTH_PROFILE` WHERE `ID` = ?', [req.session.user.ID], function (error, results, fields) {
                                if (error) {
                                    console.log("Search Heath Profile: " + error.message);
                                    req.flash("error", error.message);            
                                    return res.redirect('/login');
                                }
                                if (results.length == 0) {  
                                    console.log("This patient do NOT HAVE A healthcard!!!!!");
                                    // req.flash("error", "This patient do NOT HAVE A healthcard!!!!!");  
                                    // return res.status(404).send('ERROR!!!! This patient do NOT HAVE A healthcard!!!!!');
                                    req.flash("error", "This patient do NOT HAVE A healthcard!!!!!");            
                                    req.session.user = undefined;
                                    return res.redirect('/login');
                                } else {
                                    let healthInfo = results[0];
                                    req.session.user.HealthNumber = healthInfo.HealthNumber;
                                    // console.log(req.session.user);
                                    req.flash("success", "Welcome patient user!");
                                    // return res.redirect("back");
                                    res.redirect("/");
                                }   
                            });
                        }
                    });
                    // return res.status(404).send('NOT ADMIN.');
                } else {
                    // console.log("User: "+ req.session.user.email + ", is ADMIN!");
                    req.session.user.Admin = true;

                    req.flash("success", "Welcome admin user!");
                    // console.log(req.session.user);
                    // return res.redirect("back");
                    res.redirect("/");
                }
            });
        } else {
            // res.status(404).send('Password Incorrect');
            req.flash("error", "Password Incorrect!");
            res.redirect("/login");
        }
    });
});

// //Handing Sign Up Logic
router.post("/register", async (req, res) => {
    if(req.session.user) {
        req.flash("error", "You are already logged in!");   
        return res.redirect('/');
    } 

    connection.query('SELECT * FROM `USER` WHERE `Email` = ?', [req.body.username], function (error, results, fields) {
        if (error) {
            console.log("Select user with email: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/register');
        }
        
        if (results.length == 0) {
            connection.query('INSERT INTO USER SET ?', {Email: req.body.username, Password: req.body.password, FName: req.body.firstname, Mname: req.body.middlename, LName: req.body.lastname}, function (error, results, fields) {
                if (error) {
                    console.log("user creation: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect('/register');
                }
        
                let UserID = results.insertId;
        
                connection.query('INSERT INTO PATIENT SET ?', {ID: UserID, Age: req.body.age, PhoneNumber: req.body.phone, Address: req.body.address, PostalCode: req.body.postal, Country: req.body.country, Province: req.body.province, City: req.body.city.toUpperCase()}, function (error, results, fields) {
                    if (error) {
                        console.log("Patient creation: " + error.message);
                        req.flash("error", error.message);            
                        return res.redirect('/register');
                    }

                    connection.query('INSERT INTO HEALTH_PROFILE SET ?', {ID: UserID, HealthNumber: req.body.healthcard}, function (error, results, fields) {
                        if (error) {
                            console.log("Health Card creation: " + error.message);
                            req.flash("error", error.message);            
                            return res.redirect('/register');
                        }
                        req.flash("success", "Patient Successfully Created!");
                        res.redirect("/login");
                    });
                });
            });
        } else {
            // res.status(404).send('Email already Taken');
            req.flash("error", "Email already Taken!");
            res.redirect("/register");
        }
    });
});

//Logout
router.get("/logout", (req, res) => {
    req.session.user = undefined;
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;