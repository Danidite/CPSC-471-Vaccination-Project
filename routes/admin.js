const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

router.get('/', middleware.isAdmin, (req, res) => {
    res.render("admin/index");
});

router.get('/scores', middleware.isAdmin, (req, res) => {
    connection.query("CALL GetAllScores()", function (error, results, fields) {
        if (error) {
            console.log("Get User score list: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/admin');
        }
        results = results[0];
        res.render("admin/score", {users: results});
    });
});

router.get('/appointments', middleware.isAdmin, (req, res) => {
    connection.query('CALL GetAllAppointments()', function (error, results, fields) {
        if (error) {
            console.log("Select all appointments: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        results = results[0];
        res.render("admin/appointment", {appointments: results});
    });
});

module.exports = router;