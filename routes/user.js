const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

router.get('/', middleware.isUser, (req, res) => {
    res.render("user/index", {priorityscore: (req.session.user.Age * req.session.user.HealthNumber)});
});




// app.get('/priorityScore', (req, res) => {
//     res.render("user/priority");
// });

module.exports = router;
;
