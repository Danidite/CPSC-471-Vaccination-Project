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
            connection.query('INSERT INTO CLINIC SET ?', {Name: req.body.clinicname, Address: req.body.address, PostalCode: req.body.postal, Country: req.body.country, Province: req.body.province, City: req.body.city, URL: req.body.image, CreaterID: req.session.user.ID}, function (error, results, fields) {
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
            res.render("clinic/show", {clinic: foundClinic});
        } else {
            // res.status(404).send('Email already Taken');
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

            // let vaccinesNotAssigned = vacines.filter(n => !results.includes(n));
            // // console.log(vacines.filter(n => !results.includes(n)));

            res.render("clinic/vaccine", {clinicID: req.params.id, vaccines: results, noVaccines: vacines.filter(n => !results.includes(n))});
            // return res.redirect("back");
        });
    });

    // /clinics/<%= clinic._id%>/vaccine
});

module.exports = router;