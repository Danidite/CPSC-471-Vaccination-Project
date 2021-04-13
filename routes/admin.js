const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

router.get('/', middleware.isAdmin, (req, res) => {
    res.render("admin/index");
});

router.get('/scores', middleware.isAdmin, (req, res) => {
    connection.query("SELECT u.FName, u.MName, u.LName, p.Age, h.HealthNumber FROM USER u JOIN PATIENT p ON u.ID = p.ID JOIN HEALTH_PROFILE h ON p.ID = h.ID", function (error, result, fields) {
        if (error) {
            console.log("Get User score list: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/admin');
        }
        // console.log(result);
        res.render("admin/score", {users: result});
    });
});

router.get('/appointments', middleware.isAdmin, (req, res) => {
    connection.query('SELECT u.ID, u.FName, u.MName, u.LName, v.Name as VName, c.Name as CName, a.Date, a.Status FROM APPOINTMENT a JOIN REQUEST_APPOINTMENT r ON a.RID = r.ID JOIN CLINIC c ON c.ID = a.CID JOIN VACCINE v ON v.ID = r.VID JOIN USER u ON u.ID = r.PID', function (error, results, fields) {
        if (error) {
            console.log("Select all appointments: " + error.message);
            req.flash("error", error.message);            
            return res.redirect('/clinics');
        }
        res.render("admin/appointment", {appointments: results});
    });
});

module.exports = router;