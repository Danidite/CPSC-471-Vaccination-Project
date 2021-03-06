const   connection      = require("../database"),
        express         = require("express"),
        router          = express.Router(),
        middleware      = require("../middleware");

router.get('/', (req, res) => {

    connection.query("SELECT * FROM CLINIC", function (error, result, fields) {
        if (error) {
            console.log("Get clinics list: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/');
        }
        // console.log(result);
        res.render("clinic/index", {clinics: result});
    });
});

// NEW ROUTE
router.get("/new", middleware.isAdmin, (req, res) => {
    res.render("clinic/new");
});

// CREATE ROUTE
router.post("/", middleware.isAdmin, (req, res) => {
    connection.query('SELECT * FROM `CLINIC` WHERE `Name` = ?', [req.body.clinicname], function (error, results, fields) {
        if (error) {
            console.log("Select Clinic with name: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics/new');
        }
        if (results.length == 0) {
            connection.query('INSERT INTO CLINIC SET ?', {Name: req.body.clinicname, Address: req.body.address, PostalCode: req.body.postal, Country: req.body.country.toUpperCase(), Province: req.body.province.toUpperCase(), City: req.body.city.toUpperCase(), URL: req.body.image, CreaterID: req.session.user.ID}, function (error, results, fields) {
                if (error) {
                    console.log("Clinic creation: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect('/clinics/new');
                }
                req.flash("success", "Clinic Successfully Created!");
                res.redirect("/clinics");
            });
        } else {
            // res.status(404).send('Email already Taken');
            req.flash("error", "Clinic of this name already Exist!");
            return res.redirect('/clinics/new');
        }
    });
});



// SHOW ROUTE
router.get("/:id", (req, res) => {
    connection.query('SELECT * FROM `CLINIC` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Select clinics with ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        if (results.length >= 1) {
            let foundClinic = results[0];

            connection.query('SELECT * FROM CLINIC_PHONE_NUMBER WHERE `CID` = ?', [req.params.id], function (error, results, fields) {
                if (error) {
                    console.log("Load Phone number for clinic with ID: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect('/clinics');
                }

                let phones = results;

                connection.query('SELECT v.ID, v.Name FROM VACCINE v JOIN VACCINE_SUPPORT s ON v.ID = s.VID WHERE s.CID = ?', [req.params.id], function (error, results, fields) {
                    if (error) {
                        console.log("Get assigned Vaccines: " + error.message);
                        req.flash("error", error.message);            
                        return res.redirect('/clinics');
                    }
                    return res.render("clinic/show", {clinic: foundClinic, phones: phones, vaccines: results});
                });

                // return res.render("clinic/show", {clinic: foundClinic, phones: results});
            });
        } else {
            req.flash("error", "Clinic not found!");
            return res.redirect("back");
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", middleware.isAdmin, async(req, res) => {
    connection.query('DELETE FROM `CLINIC` WHERE `ID` = ?', [req.params.id], function (error, result, fields) {
        if (error) {
            console.log("DELETE clinics with ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        if (result.affectedRows >= 1) {
            req.flash("success", "Clinic of ID Deleted");
            res.redirect("/clinics");
        } else {
            req.flash("error", "No Clinic of ID found");
            res.redirect("/clinics");
        }
    });
});

// SHOW vaccines of clinics
router.get("/:id/vaccines", middleware.isAdmin, (req, res) => {
    connection.query('SELECT v.ID, v.Name FROM VACCINE v', function (error, results, fields) {
        if (error) {
            console.log("Get not assigned Vaccines: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        let vacines = results;

        connection.query('SELECT v.ID, v.Name FROM VACCINE v JOIN VACCINE_SUPPORT s ON v.ID = s.VID WHERE s.CID = ?', [req.params.id], function (error, results, fields) {
            if (error) {
                console.log("Get assigned Vaccines: " + error.message);
                req.flash("error", error.message);            
                return res.redirect('/clinics');
            }
            res.render("clinic/vaccine", {clinicID: req.params.id, vaccines: results, noVaccines: vacines.filter(a => !results.map(b=>b.ID).includes(a.ID))});
        });
    });
});

// ENROLL ROUTE
router.post("/:c_id/vaccines/:v_id/enroll", middleware.isAdmin, async(req, res) => {
    connection.query('INSERT INTO VACCINE_SUPPORT SET ?', {CID: req.params.c_id, VID: req.params.v_id}, function (error, results, fields) {
        if (error) {
            console.log("Inserted supported vaccine to clinic: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        req.flash("success", "Vaccine for clinic has been assigned");
        res.redirect("/clinics");
    });
});

// remove vaccine from clinic ROUTE
router.delete("/:c_id/vaccines/:v_id/remove", middleware.isAdmin, async(req, res) => {
    connection.query('DELETE FROM VACCINE_SUPPORT WHERE (CID = ?) AND (VID = ?)', [req.params.c_id, req.params.v_id], function (error, result, fields) {
        if (error) {
            console.log("DELETE vaccine support: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        req.flash("success", "Vaccine for clinic has been un assigned");
        res.redirect("/clinics");
    });
});


// SHOW ROUTE
router.get("/:id/phone", middleware.isAdmin, (req, res) => {
    res.render("clinic/phone", {clinicID: req.params.id});
});

router.post("/:id/phone", middleware.isAdmin, (req, res) => {
    connection.query('INSERT INTO CLINIC_PHONE_NUMBER SET ?', {CID: req.params.id, PhoneNumber: req.body.phone}, function (error, results, fields) {
        if (error) {
            console.log("Insert phone number to vaccine: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        req.flash("success", "Phone number successfully added!");
        return res.redirect('/clinics/');
    });

});

module.exports = router;