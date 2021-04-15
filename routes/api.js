const   connection      = require("../database"),
        express         = require("express"),
        router             = express.Router();

router.use(express.json());



module.exports = router;