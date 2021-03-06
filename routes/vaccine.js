const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

router.use(express.json());

// Show Vaccines
router.get('/', (req, res) => {
    connection.query("SELECT * FROM VACCINE", function (error, result, fields) {
        if (error) {
            console.log("Get vaccine list: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/');
        }
        // console.log(result);
        res.render("vaccine/index", {vaccines: result});
    });
});
//Show Vaccines API
router.get('/api', (req, res) => {
    connection.query("SELECT * FROM VACCINE", function (error, result, fields) {
        if (error) {
            console.log("Get vaccine list: " + error.message);
            return res.status(404).send(error.message);
        }
        // console.log(result);
        res.status(200).send(result);
    });
});

// NEW ROUTE
router.get("/new", middleware.isAdmin, (req, res) => {
    res.render("vaccine/new");
});

// CREATE Vaccine
router.post("/", middleware.isAdmin, (req, res) => {
    connection.query('SELECT * FROM `VACCINE` WHERE `Name` = ?', [req.body.vaccinename], function (error, results, fields) {
        if (error) {
            console.log("Select vaccine with name: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/vaccines/new');
        }
        if (results.length == 0) {
            connection.query('INSERT INTO VACCINE SET ?', {Name: req.body.vaccinename, Advisery: req.body.advisory, URL: req.body.image, Description: req.body.description, CreaterID: req.session.user.ID}, function (error, results, fields) {
                if (error) {
                    console.log("Vaccine creation: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect('/vaccines/new');
                }
                req.flash("success", "Vaccine Successfully Created!");
                res.redirect("/vaccines");
            });
        } else {
            // res.status(404).send('Email already Taken');
            req.flash("error", "Vaccine of this name already Exist!");
            return res.redirect('/vaccines/new');
        }
    });
});
// Create Vaccine API
router.post("/api/create/:id", (req, res) => {
    connection.query('SELECT * FROM `ADMIN` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            //console.log("Search Admin: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            return res.status(404).send("User is not Admin!");
        }
        connection.query('SELECT * FROM `VACCINE` WHERE `Name` = ?', [req.body.vaccinename], function (error, results, fields) {
            if (error) {
                console.log("Select vaccine with name: " + error.message);
                return res.status(404).send(error.message);
            }
            if (results.length == 0) {
                connection.query('INSERT INTO VACCINE SET ?', {Name: req.body.vaccinename, Advisery: req.body.advisory, URL: req.body.image, Description: req.body.description, CreaterID: req.params.id}, function (error, results, fields) {
                    if (error) {
                        console.log("Vaccine creation: " + error.message);
                        return res.status(404).send(error.message);
                    }
                    res.status(200).send("Vaccine Added");
                });
            } else {
                // res.status(404).send('Email already Taken');
                return res.status(404).send('Name already Taken');
            }
        });
    });
});

// SHOW Vaccine
router.get("/:id", (req, res) => {
    connection.query('SELECT * FROM `VACCINE` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Select vaccine with ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/vaccines');
        }
        if (results.length >= 1) {
            let foundVaccine = results[0];

            connection.query('SELECT c.ID, c.Name FROM CLINIC c JOIN VACCINE_SUPPORT s ON c.ID = s.CID WHERE s.VID = ?', [req.params.id], function (error, results, fields) {
                if (error) {
                    console.log("Get clinics offereing this: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect('/vaccines');
                }
                return res.render("vaccine/show", {vaccine: foundVaccine, clinics: results});
            });
        } else {
            // res.status(404).send('Email already Taken');
            req.flash("error", "Vaccine not found!");
            return res.redirect("back");
        }
    });
});

// DESTROY Vaccine
router.delete("/:id", middleware.isAdmin, async(req, res) => {
    connection.query('DELETE FROM `VACCINE` WHERE `ID` = ?', [req.params.id], function (error, result, fields) {
        if (error) {
            console.log("DELETE vaccine with ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/vaccines');
        }
        if (result.affectedRows >= 1) {
            req.flash("success", "VACCINE of ID Deleted");
            res.redirect("/vaccines");
        } else {
            req.flash("error", "No Vaccine of ID found");
            res.redirect("/vaccines");
        }
    });
});
// Remove Offered Vaccine API
router.delete("/api/delete/:id/:userID", async(req, res) => {

    connection.query('SELECT * FROM `ADMIN` WHERE `ID` = ?', [req.params.userID], function (error, results, fields) {
        if (error) {
            console.log("Search Admin: " + error.message);
            return res.status(404).send(error.message);
        }
        if (results.length == 0) {
            return res.status(404).send("User is not Admin!");
        }

        connection.query('DELETE FROM `VACCINE` WHERE `ID` = ?', [req.params.id], function (error, result, fields) {
            if (error) {
                console.log("DELETE vaccine with ID: " + error.message);
                return res.status(404).send(error.message);
            }
            if (result.affectedRows >= 1) {
                res.status(200).send("Vaccine Deleted");
            } else {
                return res.status(404).send(error.message);
            }
        });
    });
});

// EDIT Route
router.get("/:id/edit", middleware.isAdmin, (req, res) => {
    connection.query('SELECT * FROM `VACCINE` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Select vaccine with ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/vaccines');
        }
        if (results.length >= 1) {
            let foundVaccine = results[0];
            res.render("vaccine/edit", {vaccine: foundVaccine});
        } else {
            req.flash("error", "Vaccine not found!");
            return res.redirect("back");
        }
    });
});

// Edit Vaccine
router.put("/:id", middleware.isAdmin, (req, res) => {
    // connection.query('UPDATE VACCINE SET Name = ?, Advisery = ?, Description = ?, URL = ? WHERE ID = ?', [req.body.vaccinename, req.body.advisory, req.body.description, req.body.image, req.params.id], function (error, results, fields) {
    connection.query('CALL UpdateVaccine(?,?,?,?,?)', [req.body.vaccinename, req.body.advisory, req.body.description, req.body.image, req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Update vaccine with new information: " + error.message);
            req.flash("error", error.message);            
            return res.redirect("/vaccines");
        }
        return res.redirect("/vaccines");
    });
});

// Request appointment 
router.post("/:v_id/request", middleware.isLoggedIn, middleware.isUser, (req, res) => {
    connection.query('CALL SelectClinicIDFromCity (?, ?)', [req.params.v_id, req.session.user.City], function (error, results, fields) {
        if (error) {
            console.log("Select vaccine ID of all conditions: " + error.message);
            req.flash("error", error.message);            
            return res.redirect("back");
        }
        results = results[0];
        // If no clinic serve this
        if (results.length == 0) {
            req.flash("error", "There are no clinic that serve this vaccine in the city you are located in!");            
            return res.redirect("back");
        }

        let selectClinicIndex = Math.floor((Math.random() * (results.length)) + 0);

        let c_id = results[selectClinicIndex].ID;

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        
        connection.query('INSERT INTO REQUEST_APPOINTMENT SET ?', {Date: today, PID: req.session.user.ID, VID: req.params.v_id}, function (error, results, fields) {
            if (error) {
                console.log("Request appointment creation: " + error.message);
                req.flash("error", error.message);            
                return res.redirect("back");
            }

            let requestID = results.insertId;
            
            // 5 days in future
            let appointment_date = new Date();
            appointment_date.setDate(appointment_date.getDate() + 5);
            
            let d = String(appointment_date.getDate()).padStart(2, '0');
            let y = appointment_date.getFullYear();
            
            let month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";
            var m = month[appointment_date.getMonth()];

            let newDate = m + " " + d + ", " + y;

            // console.log(newDate);

            connection.query('INSERT INTO APPOINTMENT SET ?', {RID: requestID, Date: newDate, Status: "waiting", CID: c_id}, function (error, results, fields) {
                if (error) {
                    console.log("Appointment creation: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect("back");
                }
                req.flash("success", "Appointment created");            
                return res.redirect("/user");
            });
        });
    });
});

module.exports = router;