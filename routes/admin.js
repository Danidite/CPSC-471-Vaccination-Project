const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router(),
        middleware      = require("../middleware");

router.get('/', middleware.isAdmin, (req, res) => {
    res.render("admin/index");
});

module.exports = router;