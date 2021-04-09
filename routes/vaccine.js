const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

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

// NEW ROUTE
router.get("/new", middleware.isAdmin, (req, res) => {
    res.render("vaccine/new");
});

// CREATE ROUTE
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

// SHOW ROUTE
router.get("/:id", (req, res) => {
    connection.query('SELECT * FROM `VACCINE` WHERE `ID` = ?', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Select vaccine with ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/vaccines');
        }
        if (results.length >= 1) {
            let foundVaccine = results[0];
            res.render("vaccine/show", {vaccine: foundVaccine});
        } else {
            // res.status(404).send('Email already Taken');
            req.flash("error", "Vaccine not found!");
            return res.redirect("back");
        }
    });
});

// DESTROY ROUTE
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

module.exports = router;