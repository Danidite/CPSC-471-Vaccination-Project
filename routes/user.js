const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

router.get('/', middleware.isUser, (req, res) => {
    res.render("user/index", {priorityscore: (req.session.user.Age * req.session.user.HealthNumber)});
});

router.get('/appointments', middleware.isUser, (req, res) => {
    connection.query('CALL GetAppointments (?)', [req.session.user.ID], function (error, results, fields) {
        if (error) {
            console.log("Select appointments with user ID: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        results = results[0];
        return res.render("user/appointment", {appointments: results});
    });
});

//UPDATE ROUTE
router.put("/appointments/:id/:status", middleware.isUser, (req, res) => {
    connection.query('CALL GetPatientIDFromRequestID (?)', [req.params.id], function (error, results, fields) {
        if (error) {
            console.log("Find Patient ID of appointment: " + error.message);
            req.flash("error", error.message);            
            return res.redirect("/user/appointments");
        }
        results = results[0];

        if (results.length == 0) {
            req.flash("error", error.message);            
            return res.redirect("You do not have access to this function");
        } else {
            let status = "waiting";

            if (req.params.status === "accept") {
                status = "Accepted";
            } else if (req.params.status === "reject") {
                status = "Rejected";
            } else {
                req.flash("error", "Error status change");            
                return res.redirect("/user/appointments");
            }

            connection.query('CALL UpdateAppointment (?,?)', [status, req.params.id], function (error, results, fields) {
                if (error) {
                    console.log("Update appointment to accept: " + error.message);
                    req.flash("error", error.message);            
                    return res.redirect("/user/appointments");
                }
                return res.redirect("/user/appointments");
            });
        }
    });
});


module.exports = router;
